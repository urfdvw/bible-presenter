import MenuBar from "../utilComponents/MenuBar";
import { grey, red } from "@mui/material/colors";
import { useContext } from "react";
import AppContext from "../AppContext";

const DARK_RED = red[900];
const DARK_GREY = grey[900];

export default function AppMenu() {
    const { projectorWindowPopped, setProjectorWindowPopped, projectorDisplay, setProjectorDisplay, showHints } =
        useContext(AppContext);

    const menuStructure = [
        {
            label: "Bible Presenter",
            color: DARK_RED,
            options: [
                {
                    text: "About",
                    handler: () => {
                        console.log("App menu bar -> About");
                    },
                },
            ],
        },
        {
            text: (showHints ? "(P)" : "") + (projectorWindowPopped ? "收回投影窗口" : "弹出投影窗口"),
            color: DARK_GREY,
            handler: () => {
                setProjectorWindowPopped((popped) => !popped);
            },
        },
        {
            text: (showHints ? "(B)" : "") + (projectorDisplay ? "隐藏投影内容" : "显示投影内容"),
            color: DARK_GREY,
            handler: () => {
                setProjectorDisplay((displayStatus) => !displayStatus);
            },
        },
    ];
    return <MenuBar menuStructure={menuStructure} />;
}
