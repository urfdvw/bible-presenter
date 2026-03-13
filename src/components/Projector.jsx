import PopUp from "../utilComponents/PopUp";
import Box from "@mui/material/Box";
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import AppContext from "../AppContext";
import { NoTheme } from "react-lazy-dark-theme";

import VerseParagraph from "./VerseParagraph";
import Reader, { ReaderMenu, ReaderTitle } from "./Reader";
import Typography from "@mui/material/Typography";
import VerseRef from "../models/VerseRef";

function VerseProjectionContent({ displayVerse, projectorConfig, popupWindow }) {
    const minZoom = Math.max(1, parseInt(projectorConfig.zoom, 10) || 100);
    const maxZoom = minZoom * 10;
    const fillScreen = Boolean(projectorConfig.verse_fullscreen);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [appliedZoom, setAppliedZoom] = useState(minZoom);

    const calculateBestZoom = useCallback(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) {
            return;
        }
        if (!fillScreen) {
            setAppliedZoom(minZoom);
            return;
        }

        const hasOverflow = () => container.scrollHeight > container.clientHeight || container.scrollWidth > container.clientWidth;
        const applyCandidate = (zoomPercent) => {
            content.style.zoom = String(zoomPercent / 100);
        };

        applyCandidate(minZoom);
        if (hasOverflow()) {
            setAppliedZoom(minZoom);
            return;
        }

        let low = minZoom;
        let high = maxZoom;
        let best = minZoom;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            applyCandidate(mid);
            if (hasOverflow()) {
                high = mid - 1;
            } else {
                best = mid;
                low = mid + 1;
            }
        }
        setAppliedZoom(best);
    }, [fillScreen, maxZoom, minZoom]);

    useLayoutEffect(() => {
        calculateBestZoom();
    }, [calculateBestZoom, displayVerse]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const resizeObserver = new ResizeObserver(() => {
            calculateBestZoom();
        });
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [calculateBestZoom]);

    useEffect(() => {
        // Recalculate when projection target window is popped or switched.
        calculateBestZoom();
        const id = requestAnimationFrame(() => {
            calculateBestZoom();
        });
        return () => cancelAnimationFrame(id);
    }, [popupWindow, calculateBestZoom]);

    useEffect(() => {
        const hostWindow = popupWindow || window;
        const onResize = () => {
            calculateBestZoom();
        };
        hostWindow.addEventListener("resize", onResize);
        return () => {
            hostWindow.removeEventListener("resize", onResize);
        };
    }, [popupWindow, calculateBestZoom]);

    const effectiveZoom = fillScreen ? appliedZoom : minZoom;
    return (
        <Box ref={containerRef} sx={{ height: "100%", overflow: "auto" }}>
            <Box ref={contentRef} style={{ zoom: effectiveZoom / 100 }}>
                <VerseParagraph verseObj={displayVerse} />
            </Box>
        </Box>
    );
}

export default function Projector() {
    const { appConfig, projectorWindowPopped, setProjectorWindowPopped, projectorDisplay, displayVerse } =
        useContext(AppContext);
    const [popupWindow, setPopupWindow] = useState(null);

    var Pop;
    var Alt;
    var Children;

    if (appConfig.config.projector.display_type === "经节") {
        Pop = null;
        Alt = (
            <Box sx={{ height: "100%", overflowY: "scroll" }}>
                <Typography>正在投影：</Typography>
                <VerseParagraph verseObj={displayVerse} />
            </Box>
        );
        Children = projectorDisplay ? (
            <VerseProjectionContent
                displayVerse={displayVerse}
                projectorConfig={appConfig.config.projector}
                popupWindow={popupWindow}
            />
        ) : (
            <NoTheme>
                <div style={{ backgroundColor: "black", height: "100000px" }}></div>
            </NoTheme>
        );
    } else if (appConfig.config.projector.display_type === "整章") {
        Pop = projectorDisplay ? (
            <Box
                style={{ zoom: appConfig.config.projector.zoom / 100 }}
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
                        verseObj={
                            new VerseRef({ book: displayVerse.book, chapter: displayVerse.chapter, verse: displayVerse.verse })
                        }
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
                    style={{ zoom: appConfig.config.projector.zoom / 100 }}
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
