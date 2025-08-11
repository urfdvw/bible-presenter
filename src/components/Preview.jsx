import AppContext from "../AppContext";
import { useContext, useEffect, useState } from "react";
import { PreviewVerseBox } from "./VerseBox";
import { scroller, Element } from "react-scroll";
import { Button, Typography } from "@mui/material";
import TabToolBar from "../utilComponents/TabToolBar";
import { selectTabById } from "../layout/layoutUtils";

function PreviewList({ selected, setSelected }) {
    const { getChapterVerses, previewVerse } = useContext(AppContext);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);

    useEffect(() => {
        if (!previewVerse.verse) {
            return;
        }
        const targetName = `preview-verse-${previewVerse.verse}`;
        scroller.scrollTo(targetName, {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
            containerId: "previewContainer",
        });
    }, [previewVerse]);

    useEffect(() => {
        if (selected && selected.book !== verses[0][0].book) {
            setSelected(null);
        }
    }, [selected, verses]);

    return (
        <div id="previewContainer" style={{ height: "100%", overflowY: "auto" }}>
            {verses.map((verseVersions) => {
                return (
                    <Element key={verseVersions[0].verse} name={`preview-verse-${verseVersions[0].verse}`}>
                        <PreviewVerseBox
                            setSelected={setSelected}
                            selected={selected}
                            book={verseVersions[0].book}
                            chapter={verseVersions[0].chapter}
                            verse={verseVersions[0].verse}
                            highlighted={
                                selected &&
                                verseVersions[0].book === selected.book &&
                                verseVersions[0].chapter === selected.chapter &&
                                verseVersions[0].verse === selected.verse
                            }
                        />
                    </Element>
                );
            })}
        </div>
    );
}

export default function Preview() {
    const [selected, setSelected] = useState(null);
    const { getChapterVerses, previewVerse, setPreviewVerse, getMultipleVerses, helpTabSelection, flexModel } =
        useContext(AppContext);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);
    const notificationHeight = selected ? "5em" : "0em";

    const selectedVerseObj = selected ? getMultipleVerses(selected.book, selected.chapter, selected.verse) : null;

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
                setPreviewVerse({
                    book: previewVerse.book,
                    chapter: previewVerse.chapter - 1,
                    verse: 1,
                });
            },
        },
        {
            text: "下一章",
            handler: () => {
                const testVerse = getMultipleVerses(previewVerse.book, previewVerse.chapter + 1, 1);
                if (testVerse.length === 0) {
                    console.log("没有下一章了");
                    return;
                }
                console.log("下一章");
                setPreviewVerse({
                    book: previewVerse.book,
                    chapter: previewVerse.chapter + 1,
                    verse: 1,
                });
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
            <PreviewList selected={selected} setSelected={setSelected} />
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
