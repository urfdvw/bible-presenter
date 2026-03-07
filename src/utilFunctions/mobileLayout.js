import baseLayout from "../layout/layout.json";
import { getViewportWidth } from "./viewport";

export function createLayoutJsonForMode(mobileReadingMode) {
    const nextLayout = JSON.parse(JSON.stringify(baseLayout));
    if (!mobileReadingMode) {
        return nextLayout;
    }

    const sidebarWidth = getViewportWidth();
    nextLayout.borders = (nextLayout.borders || []).map((border) => {
        const nextBorder = { ...border };
        if (nextBorder.location === "left") {
            nextBorder.children = (nextBorder.children || []).filter((tab) => tab.id !== "history_tab");
        }
        if (nextBorder.location === "left" || nextBorder.location === "right") {
            nextBorder.size = sidebarWidth;
        }
        // Collapse all sidebars on startup in mobile reading mode.
        nextBorder.selected = -1;
        return nextBorder;
    });

    if (nextLayout.layout?.children) {
        nextLayout.layout.children = nextLayout.layout.children.filter(
            (tabset) => !(tabset.children || []).some((tab) => tab.component === "projector")
        );
    }
    return nextLayout;
}
