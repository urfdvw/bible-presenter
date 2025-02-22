import PopUp from "../utilComponents/PopUp";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { NoTheme } from "react-lazy-dark-theme";

import VerseParagraph from "./VerseParagraph";
import Reader, { ReaderMenu, ReaderTitle } from "./Reader";

function ProjectorContext() {
    const { appConfig, projectorWindowPopped, setProjectorWindowPopped, projectorDisplay } = useContext(AppContext);
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
            altChildren={<ReaderMenu />}
            popChildren={
                projectorDisplay ? (
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
                )
            }
        >
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
                <Box
                    style={{ zoom: appConfig.config.bible_display.zoom / 100 }}
                    sx={{ height: "100%", overflowY: "scroll" }}
                >
                    <VerseParagraph />
                </Box>
            }
        >
            {projectorDisplay ? (
                <Box
                    style={{ zoom: appConfig.config.bible_display.zoom / 100 }}
                    sx={{ height: "100%", overflowY: "scroll" }}
                >
                    <VerseParagraph />
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
