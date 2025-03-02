import { useHotkeys } from "react-hotkeys-hook";
import { Actions } from "flexlayout-react";
import { toggleSelectTabById } from "../layout/layoutUtils";

export default function useLayoutHotKeys(flexModel, setShowHints) {
    const hint_tab_ids = ["quick_locate_tab", "bible_toc_tab", "search_tab", "history_tab", "notes_tab"];
    useHotkeys(
        "alt+q",
        (event) => {
            event.preventDefault();
            console.log("hotkey: show quick_locate_tab");
            toggleSelectTabById(flexModel, "quick_locate_tab");
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+m",
        (event) => {
            event.preventDefault();
            console.log("hotkey: show bible_toc_tab");
            toggleSelectTabById(flexModel, "bible_toc_tab");
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+s",
        (event) => {
            event.preventDefault();
            console.log("hotkey: show search_tab");
            toggleSelectTabById(flexModel, "search_tab");
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+h",
        (event) => {
            event.preventDefault();
            console.log("hotkey: show history_tab");
            toggleSelectTabById(flexModel, "history_tab");
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt+n",
        (event) => {
            event.preventDefault();
            console.log("hotkey: show notes_tab");
            toggleSelectTabById(flexModel, "notes_tab");
        },
        { enableOnFormTags: true }
    );
    useHotkeys(
        "alt",
        (event) => {
            event.preventDefault();
            console.log("SHOW_HINT");
            setShowHints(true);
            for (const tab_id of hint_tab_ids) {
                const tab = flexModel.getNodeById(tab_id);
                flexModel.doAction(
                    Actions.updateNodeAttributes(tab_id, {
                        name: tab.attributes.altName,
                    })
                );
            }
        },
        { keyup: false, keydown: true, enableOnFormTags: true }
    );
    useHotkeys(
        "alt",
        (event) => {
            event.preventDefault();
            console.log("HIDE_HINT");
            setShowHints(false);
            for (const tab_id of hint_tab_ids) {
                const tab = flexModel.getNodeById(tab_id);
                flexModel.doAction(
                    Actions.updateNodeAttributes(tab_id, {
                        name: tab.attributes.helpText,
                    })
                );
            }
        },
        { keyup: true, keydown: false, enableOnFormTags: true }
    );
}
