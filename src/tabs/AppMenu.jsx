import MenuBar from "../utilComponents/MenuBar";
import { grey, red } from "@mui/material/colors";
import { useContext } from "react";
import AppContext from "../AppContext";

const DARK_RED = red[900];
const DARK_GREY = grey[900];

export default function AppMenu() {
    const { setProjectorWindowPopped } = useContext(AppContext);

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
            text: "投影窗口",
            color: DARK_GREY,
            handler: () => {
                setProjectorWindowPopped((popped) => !popped);
            },
        },
    ];
    return <MenuBar menuStructure={menuStructure} />;
}
