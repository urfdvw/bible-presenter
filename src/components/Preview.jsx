import AppContext from "../AppContext";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PreviewVerseBox } from "./VerseBox";
import { scroller, Element } from "react-scroll";
import { Button, Typography } from "@mui/material";
import TabToolBar from "../utilComponents/TabToolBar";
import { selectTabById } from "../layout/layoutUtils";
import VerseRef from "../models/VerseRef";

function PreviewList({ selected, setSelected, previewVerse, tabId }) {
    const { getChapterVerses, isMobileReadingMode } = useContext(AppContext);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);
    const containerId = `previewContainer-${tabId}`;
    const latestTargetNameRef = useRef("");

    const scrollPrecisely = useCallback(
        (targetName) => {
            const container = document.getElementById(containerId);
            if (!container) {
                return;
            }
            const target = document.getElementById(targetName);
            if (!target) {
                return;
            }
            const top =
                container.scrollTop + target.getBoundingClientRect().top - container.getBoundingClientRect().top;
            container.scrollTop = top;
        },
        [containerId]
    );

    useEffect(() => {
        if (!previewVerse.verse) {
            return;
        }
        const targetName = `preview-verse-${previewVerse.verse}`;
        latestTargetNameRef.current = targetName;
        if (!isMobileReadingMode) {
            scroller.scrollTo(targetName, {
                duration: 800,
                delay: 0,
                smooth: "easeInOutQuart",
                containerId: containerId,
            });
            return;
        }

        // Mobile: no animation, plus multiple recalculations for layout changes.
        const rafId = requestAnimationFrame(() => scrollPrecisely(targetName));
        const timeoutIds = [80, 180, 320, 520].map((delay) =>
            setTimeout(() => scrollPrecisely(targetName), delay)
        );
        return () => {
            cancelAnimationFrame(rafId);
            timeoutIds.forEach(clearTimeout);
        };
    }, [previewVerse, containerId, isMobileReadingMode, scrollPrecisely, verses.length]);

    useEffect(() => {
        if (!isMobileReadingMode) {
            return;
        }
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }
        const resizeObserver = new ResizeObserver(() => {
            if (latestTargetNameRef.current) {
                scrollPrecisely(latestTargetNameRef.current);
            }
        });
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [containerId, isMobileReadingMode, scrollPrecisely]);

    useEffect(() => {
        if (selected && selected.book !== verses[0][0].book) {
            setSelected(null);
        }
    }, [selected, verses, setSelected]);

    return (
        <div id={containerId} style={{ height: "100%", overflowY: "auto" }}>
            {verses.map((verseVersions) => {
                return (
                    <Element key={verseVersions[0].verse} name={`preview-verse-${verseVersions[0].verse}`}>
                        <div id={`preview-verse-${verseVersions[0].verse}`}>
                            <PreviewVerseBox
                                setSelected={setSelected}
                                selected={selected}
                                verseObj={
                                    new VerseRef({
                                        book: verseVersions[0].book,
                                        chapter: verseVersions[0].chapter,
                                        verse: verseVersions[0].verse,
                                    })
                                }
                                highlighted={
                                    selected &&
                                    verseVersions[0].book === selected.book &&
                                    verseVersions[0].chapter === selected.chapter &&
                                    verseVersions[0].verse === selected.verse
                                }
                            />
                        </div>
                    </Element>
                );
            })}
        </div>
    );
}

export default function Preview({ tabId }) {
    const [selected, setSelected] = useState(null);
    const {
        getChapterVerses,
        getPreviewVerseForTab,
        setPreviewVerseForTab,
        getMultipleVerses,
        helpTabSelection,
        flexModel,
    } = useContext(AppContext);
    const previewVerse = getPreviewVerseForTab(tabId);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);
    const notificationHeight = selected ? "5em" : "0em";

    const selectedVerseObj = selected ? getMultipleVerses(selected) : null;

    const notification = selectedVerseObj
        ? `已选中 ${selectedVerseObj[0][0].book_name} ${selectedVerseObj[0][0].chapter}:${selectedVerseObj[0][0].verse}`
        : "暂无选中章节";

    const tools = [
        {
            text: "上一章",
            handler: () => {
                if (previewVerse.chapter === 1) {
                    console.log("没有上一章了");
                    return;
                }
                console.log("上一章");
                setPreviewVerseForTab(tabId, new VerseRef({ book: previewVerse.book, chapter: previewVerse.chapter - 1, verse: 1 }));
            },
        },
        {
            text: "下一章",
            handler: () => {
                const testVerse = getMultipleVerses(
                    new VerseRef({ book: previewVerse.book, chapter: previewVerse.chapter + 1, verse: 1 })
                );
                if (testVerse.length === 0) {
                    console.log("没有下一章了");
                    return;
                }
                console.log("下一章");
                setPreviewVerseForTab(tabId, new VerseRef({ book: previewVerse.book, chapter: previewVerse.chapter + 1, verse: 1 }));
            },
        },
        {
            text: "帮助",
            handler: () => {
                selectTabById(flexModel, "help_tab");
                helpTabSelection.setTabName("preview");
            },
        },
    ];
    return (
        <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
            <div style={{ flexGrow: 0 }}>
                <TabToolBar title={`${verses[0][0].book_name} ${verses[0][0].chapter}`} tools={tools} />
            </div>
            <PreviewList selected={selected} setSelected={setSelected} previewVerse={previewVerse} tabId={tabId} />
            <Typography
                sx={{
                    flexGrow: 0,
                    transition: "max-height 1s ease",
                    overflowY: "hidden",
                    maxHeight: notificationHeight,
                }}
                component={"div"}
            >
                {notification}
                <Button
                    onClick={() => {
                        setSelected(null);
                    }}
                >
                    取消选中
                </Button>
            </Typography>
        </div>
    );
}
