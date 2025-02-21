import PopUp from "../utilComponents/PopUp";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { NoTheme } from "react-lazy-dark-theme";

import VerseParagraph from "./VerseParagraph";
import Reader from "./Reader";

function ProjectorContext() {
    const { appConfig, projectorWindowPopped, setProjectorWindowPopped, projectorDisplay, displayVerse } =
        useContext(AppContext);
    const [popupWindow, setPopupWindow] = useState(null);

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
            // altChildren={<></>}
            popChildren={
                projectorDisplay ? (
                    <Box
                        style={{ height: "100%", zoom: appConfig.config.bible_display.zoom / 100, overflowY: "scroll" }}
                    >
                        <Reader
                            book={displayVerse.book}
                            chapter={displayVerse.chapter}
                            verse={displayVerse.verse}
                            popupWindow={popupWindow}
                        />
                    </Box>
                ) : (
                    <NoTheme>
                        <div style={{ backgroundColor: "black", height: "100000px" }}></div>
                    </NoTheme>
                )
            }
        >
            <Box style={{ height: "100%", zoom: appConfig.config.bible_display.zoom / 100, overflowY: "scroll" }}>
                <Reader
                    book={displayVerse.book}
                    chapter={displayVerse.chapter}
                    verse={displayVerse.verse}
                    popupWindow={popupWindow}
                />
            </Box>
        </PopUp>
    );
}

function ProjectorSelected() {
    const { appConfig, projectorWindowPopped, setProjectorWindowPopped, projectorDisplay, displayVerse } =
        useContext(AppContext);
    return (
        <PopUp
            popped={projectorWindowPopped}
            setPopped={setProjectorWindowPopped}
            parentStyle={{ height: "100%" }}
            altChildren={
                <Box style={{ height: "100%", zoom: appConfig.config.bible_display.zoom / 100, overflowY: "scroll" }}>
                    <VerseParagraph
                        book={displayVerse.book}
                        chapter={displayVerse.chapter}
                        verse={displayVerse.verse}
                        endChapter={displayVerse.endChapter}
                        endVerse={displayVerse.endVerse}
                    />
                </Box>
            }
        >
            {projectorDisplay ? (
                <Box style={{ height: "100%", zoom: appConfig.config.bible_display.zoom / 100, overflowY: "scroll" }}>
                    <VerseParagraph
                        book={displayVerse.book}
                        chapter={displayVerse.chapter}
                        verse={displayVerse.verse}
                        endChapter={displayVerse.endChapter}
                        endVerse={displayVerse.endVerse}
                    />
                </Box>
            ) : (
                <NoTheme>
                    <div style={{ backgroundColor: "black", height: "100000px" }}></div>
                </NoTheme>
            )}
        </PopUp>
    );
}

export default function Projector() {
    const { appConfig } = useContext(AppContext);
    if (appConfig.config.bible_display.display_type === "仅选中") {
        return <ProjectorSelected />;
    } else if (appConfig.config.bible_display.display_type === "上下文") {
        return <ProjectorContext />;
    }
}
