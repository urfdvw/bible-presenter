import { useHotkeys } from "react-hotkeys-hook";
export default function useDisplayHotKeys(
    config,
    setPageTurnTrigger,
    setVerseTurnTrigger,
    setProjectorWindowPopped,
    setProjectorDisplay
) {
    useHotkeys(
        "alt+equal",
        (event) => {
            event.preventDefault();
            console.log("hotkey: increase display size");
            config.setConfigField("projector", "zoom", parseInt(config.config.projector.zoom * 1.2));
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+minus",
        (event) => {
            event.preventDefault();
            console.log("hotkey: decrease display size");
            config.setConfigField("projector", "zoom", parseInt(config.config.projector.zoom / 1.2));
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+0",
        (event) => {
            event.preventDefault();
            console.log("hotkey: display size reset");
            config.setConfigField("projector", "zoom", 100);
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+d",
        () => {
            if (config.config.projector.display_type === "经节") {
                config.setConfigField("projector", "display_type", "整章");
            }
            if (config.config.projector.display_type === "整章") {
                config.setConfigField("projector", "display_type", "经节");
            }
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+left",
        (event) => {
            event.preventDefault();
            console.log("hotkey: page up");
            setPageTurnTrigger((x) => -(Math.abs(x) + 1));
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+right",
        (event) => {
            event.preventDefault();
            console.log("hotkey: page down");
            setPageTurnTrigger((x) => Math.abs(x) + 1);
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+up",
        (event) => {
            event.preventDefault();
            console.log("hotkey: previous verse");
            setVerseTurnTrigger((x) => -(Math.abs(x) + 1));
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+down",
        (event) => {
            event.preventDefault();
            console.log("hotkey: next verse");
            setVerseTurnTrigger((x) => Math.abs(x) + 1);
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+b",
        (event) => {
            event.preventDefault();
            console.log("hotkey: show/hide projector content");
            setProjectorDisplay((displayStatus) => !displayStatus);
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+p",
        (event) => {
            event.preventDefault();
            console.log("hotkey: show/hide popup window");
            setProjectorWindowPopped((popped) => !popped);
        },
        { enableOnFormTags: true }
    );
}
