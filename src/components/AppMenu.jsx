import MenuBar from "../utilComponents/MenuBar";
import { grey, red } from "@mui/material/colors";
import { useContext } from "react";
import AppContext from "../AppContext";
import { selectTabById } from "../layout/layoutUtils";
import { downloadUrlContent } from "../utilFunctions/jsHelper";
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
                    text: "下载到本地",
                    handler: () => {
                        downloadUrlContent(
                            "https://github.com/urfdvw/bible-presenter/raw/refs/heads/main/docs/index.html",
                        );
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
                appConfig.setConfigField("projector", "zoom", parseInt(appConfig.config.projector.zoom * 1.2));
            },
        },
        {
            text: (showHints ? "(-)" : "") + "缩小",
            color: DARK_GREY,
            handler: () => {
                appConfig.setConfigField("projector", "zoom", parseInt(appConfig.config.projector.zoom / 1.2));
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
                if (appConfig.config.projector.display_type === "经节") {
                    appConfig.setConfigField("projector", "display_type", "整章");
                }
                if (appConfig.config.projector.display_type === "整章") {
                    appConfig.setConfigField("projector", "display_type", "经节");
                }
            },
        },
    ];
    return <MenuBar menuStructure={menuStructure} />;
}
