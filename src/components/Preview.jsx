import AppContext from "../AppContext";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PreviewVerseBox } from "./VerseBox";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TabToolBar from "../utilComponents/TabToolBar";
import { selectTabById } from "../layout/layoutUtils";
import VerseRef from "../models/VerseRef";

function PreviewList({ selected, setSelected, previewVerse, tabId }) {
    const { getChapterVerses, isMobileReadingMode } = useContext(AppContext);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);
    const containerId = `previewContainer-${tabId}`;
    const latestTargetNameRef = useRef("");

    const scrollToTarget = useCallback(
        (targetName, { animated = false } = {}) => {
            const container = document.getElementById(containerId);
            if (!container) {
                return false;
            }
            const target = container.querySelector(`[data-preview-anchor="${targetName}"]`);
            if (!target) {
                return false;
            }
            const top =
                container.scrollTop + target.getBoundingClientRect().top - container.getBoundingClientRect().top;
            if (animated) {
                container.scrollTo({ top, behavior: "smooth" });
            } else {
                container.scrollTop = top;
            }
            return true;
        },
        [containerId]
    );

    useEffect(() => {
        if (!previewVerse.verse) {
            return;
        }
        const targetName = `preview-verse-${tabId}-${previewVerse.verse}`;
        latestTargetNameRef.current = targetName;
        if (!isMobileReadingMode) {
            scrollToTarget(targetName, { animated: true });
            return;
        }

        // Mobile: no animation. Retry via animation frame until the target is ready.
        let cancelled = false;
        let rafId = 0;
        let attempts = 0;
        const maxAttempts = 12;

        const tryScroll = () => {
            if (cancelled) {
                return;
            }
            const scrolled = scrollToTarget(targetName, { animated: false });
            if (scrolled || attempts >= maxAttempts) {
                return;
            }
            attempts += 1;
            rafId = requestAnimationFrame(tryScroll);
        };
        tryScroll();

        return () => {
            cancelled = true;
            cancelAnimationFrame(rafId);
        };
    }, [previewVerse, tabId, isMobileReadingMode, scrollToTarget, verses.length]);

    useEffect(() => {
        if (!isMobileReadingMode) {
            return;
        }
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }
        let rafId = 0;
        const resizeObserver = new ResizeObserver(() => {
            if (latestTargetNameRef.current) {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }
                rafId = requestAnimationFrame(() =>
                    scrollToTarget(latestTargetNameRef.current, { animated: false })
                );
            }
        });
        resizeObserver.observe(container);
        return () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            resizeObserver.disconnect();
        };
    }, [containerId, isMobileReadingMode, scrollToTarget]);

    useEffect(() => {
        if (selected && selected.book !== verses[0][0].book) {
            setSelected(null);
        }
    }, [selected, verses, setSelected]);

    return (
        <div id={containerId} style={{ height: "100%", overflowY: "auto", scrollBehavior: "auto" }}>
            {verses.map((verseVersions) => {
                const verseAnchorName = `preview-verse-${tabId}-${verseVersions[0].verse}`;
                return (
                    <div key={verseAnchorName} id={verseAnchorName} data-preview-anchor={verseAnchorName}>
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
