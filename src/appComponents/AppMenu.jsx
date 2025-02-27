import MenuBar from "../utilComponents/MenuBar";
import { grey, red } from "@mui/material/colors";
import { useContext } from "react";
import AppContext from "../AppContext";
import { selectTabById } from "../layout/layoutUtils";

const DARK_RED = red[900];
const DARK_GREY = grey[900];

export default function AppMenu() {
    const {
        appConfig,
        projectorWindowPopped,
        setProjectorWindowPopped,
        projectorDisplay,
        setProjectorDisplay,
        showHints,
        flexModel,
        helpTabSelection,
    } = useContext(AppContext);

    const menuStructure = [
        {
            label: "投影圣经",
            color: DARK_RED,
            options: [
                {
                    text: "帮助",
                    handler: () => {
                        selectTabById(flexModel, "help_tab");
                        helpTabSelection.setTabName("home");
                    },
                },
                {
                    text: "关于",
                    handler: () => {
                        selectTabById(flexModel, "help_tab");
                        helpTabSelection.setTabName("about");
                    },
                },
                {
                    text: "Github Repo",
                    handler: () => {
                        window.open("https://github.com/urfdvw/bible-presenter", "_blank").focus();
                    },
                },
            ],
        },
        {
            text: (showHints ? "(P)" : "") + (projectorWindowPopped ? "收回投影" : "开始投影"),
            color: DARK_GREY,
            handler: () => {
                setProjectorWindowPopped((popped) => !popped);
            },
        },
        {
            text: (showHints ? "(⩲)" : "") + "放大",
            color: DARK_GREY,
            handler: () => {
                appConfig.setConfigField("bible_display", "zoom", parseInt(appConfig.config.bible_display.zoom * 1.2));
            },
        },
        {
            text: (showHints ? "(-)" : "") + "缩小",
            color: DARK_GREY,
            handler: () => {
                appConfig.setConfigField("bible_display", "zoom", parseInt(appConfig.config.bible_display.zoom / 1.2));
            },
        },
        {
            text: (showHints ? "(B)" : "") + (projectorDisplay ? "隐藏投影" : "显示投影"),
            color: DARK_GREY,
            handler: () => {
                setProjectorDisplay((displayStatus) => !displayStatus);
            },
        },
        {
            text: (showHints ? "(D)" : "") + "切换显示方式",
            color: DARK_GREY,
            handler: () => {
                if (appConfig.config.bible_display.display_type === "仅选中") {
                    appConfig.setConfigField("bible_display", "display_type", "上下文");
                }
                if (appConfig.config.bible_display.display_type === "上下文") {
                    appConfig.setConfigField("bible_display", "display_type", "仅选中");
                }
            },
        },
    ];
    return <MenuBar menuStructure={menuStructure} />;
}
