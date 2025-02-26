import PopUp from "../utilComponents/PopUp";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { NoTheme } from "react-lazy-dark-theme";

import VerseParagraph from "./VerseParagraph";
import Reader, { ReaderMenu, ReaderTitle } from "./Reader";
import { Typography } from "@mui/material";

export default function Projector() {
    const { appConfig, projectorWindowPopped, setProjectorWindowPopped, projectorDisplay, displayVerse } =
        useContext(AppContext);
    const [popupWindow, setPopupWindow] = useState(null);

    var Pop;
    var Alt;
    var Children;

    if (appConfig.config.bible_display.display_type === "仅选中") {
        Pop = null;
        Alt = (
            <Box sx={{ height: "100%", overflowY: "scroll" }}>
                <Typography>正在投影：</Typography>
                <VerseParagraph verseObj={displayVerse} />
            </Box>
        );
        Children = projectorDisplay ? (
            <Box
                style={{ zoom: appConfig.config.bible_display.zoom / 100 }}
                sx={{ height: "100%", overflowY: "scroll" }}
            >
                <VerseParagraph verseObj={displayVerse} />
            </Box>
        ) : (
            <NoTheme>
                <div style={{ backgroundColor: "black", height: "100000px" }}></div>
            </NoTheme>
        );
    } else if (appConfig.config.bible_display.display_type === "上下文") {
        Pop = projectorDisplay ? (
            <Box
                style={{ zoom: appConfig.config.bible_display.zoom / 100 }}
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ flexGrow: 0 }}>
                    <ReaderTitle />
                </Box>
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <Reader popupWindow={popupWindow} />
                </Box>
            </Box>
        ) : (
            <NoTheme>
                <div style={{ backgroundColor: "black", height: "100000px" }}></div>
            </NoTheme>
        );
        Alt = (
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ flexGrow: 0 }}>
                    <ReaderMenu />
                </Box>
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <Typography>正在投影：</Typography>
                    <VerseParagraph
                        verseObj={{ book: displayVerse.book, chapter: displayVerse.chapter, verse: displayVerse.verse }}
                    />
                </Box>
            </Box>
        );
        Children = (
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ flexGrow: 0 }}>
                    <ReaderMenu />
                </Box>
                <Box
                    style={{ zoom: appConfig.config.bible_display.zoom / 100 }}
                    sx={{ flexGrow: 1, overflowY: "auto" }}
                >
                    <Reader popupWindow={popupWindow} />
                </Box>
            </Box>
        );
    }

    // This callback receives the popup window's window object
    const handlePopupOpen = (win) => {
        setPopupWindow(win);
    };

    return (
        <PopUp
            handlePopupOpen={handlePopupOpen}
            popped={projectorWindowPopped}
            setPopped={setProjectorWindowPopped}
            parentStyle={{ height: "100%" }}
            altChildren={Alt}
            popChildren={Pop}
        >
            {Children}
        </PopUp>
    );
}
