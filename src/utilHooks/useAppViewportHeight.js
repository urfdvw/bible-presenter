import { useEffect } from "react";
import { getViewportHeight } from "../utilFunctions/viewport";

export default function useAppViewportHeight() {
    useEffect(() => {
        const updateAppHeight = () => {
            document.documentElement.style.setProperty("--app-height", `${getViewportHeight()}px`);
        };

        updateAppHeight();
        window.addEventListener("resize", updateAppHeight);
        window.addEventListener("orientationchange", updateAppHeight);
        window.visualViewport?.addEventListener("resize", updateAppHeight);
        window.visualViewport?.addEventListener("scroll", updateAppHeight);

        return () => {
            window.removeEventListener("resize", updateAppHeight);
            window.removeEventListener("orientationchange", updateAppHeight);
            window.visualViewport?.removeEventListener("resize", updateAppHeight);
            window.visualViewport?.removeEventListener("scroll", updateAppHeight);
        };
    }, []);
}
