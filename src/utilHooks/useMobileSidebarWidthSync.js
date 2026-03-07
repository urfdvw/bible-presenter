import { useEffect } from "react";
import * as FlexLayout from "flexlayout-react";
import { getViewportWidth } from "../utilFunctions/viewport";

export default function useMobileSidebarWidthSync(flexModel, isMobileReadingMode) {
    useEffect(() => {
        if (!isMobileReadingMode) {
            return;
        }

        const updateSidebarWidths = () => {
            const sidebarWidth = getViewportWidth();
            flexModel.visitNodes((node) => {
                if (node.getType() !== "border" || typeof node.getLocation !== "function") {
                    return;
                }
                const locationName = node.getLocation().getName();
                if (locationName !== "left" && locationName !== "right") {
                    return;
                }
                flexModel.doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), { size: sidebarWidth }));
            });
        };

        updateSidebarWidths();
        window.addEventListener("resize", updateSidebarWidths);
        window.addEventListener("orientationchange", updateSidebarWidths);
        window.visualViewport?.addEventListener("resize", updateSidebarWidths);

        return () => {
            window.removeEventListener("resize", updateSidebarWidths);
            window.removeEventListener("orientationchange", updateSidebarWidths);
            window.visualViewport?.removeEventListener("resize", updateSidebarWidths);
        };
    }, [flexModel, isMobileReadingMode]);
}
