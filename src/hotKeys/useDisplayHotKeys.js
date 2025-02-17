import { useHotkeys } from "react-hotkeys-hook";
export default function useDisplayHotKeys(config) {
    useHotkeys("alt+equal", () => {
        console.log("hotkey: increase display size");
        config.setConfigField("bible_display", "zoom", parseInt(config.config.bible_display.zoom * 1.2));
    });
    useHotkeys("alt+minus", () => {
        console.log("hotkey: decrease display size");
        config.setConfigField("bible_display", "zoom", parseInt(config.config.bible_display.zoom / 1.2));
    });
    useHotkeys("alt+0", () => {
        console.log("hotkey: display size reset");
        config.setConfigField("bible_display", "zoom", 100);
    });
}
