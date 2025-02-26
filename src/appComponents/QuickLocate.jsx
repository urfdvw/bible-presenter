import TabToolBar from "../utilComponents/TabToolBar";
import { selectTabById } from "../layout/layoutUtils";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { Box, Typography } from "@mui/material";
import IMETextArea from "./IMETextArea";
import { siDict, trDict, enDict } from "../bible";
import { getBook, getChapterVerse } from "../bible/parser";
import { removeAllDuplicatesKeepLast } from "../utilFunctions/jsHelper";
import { LocateVerseBox } from "./VerseBox";

export default function QuickLocate() {
    const {
        appConfig,
        helpTabSelection,
        flexModel,
        displayVerse,
        setDisplayVerse,
        setPreviewVerse,
        setNoteList,
        setHistory,
    } = useContext(AppContext);
    const [text, setText] = useState("");
    const [stagedVerse, setStagedVerse] = useState({ verse: 99 });
    const [displayTarget, setDisplayTarget] = useState(displayVerse);

    useEffect(() => {
        const { book, remnant } = getBook(text);
        // console.log(book, remnant);
        const { chapter, verse, endChapter, endVerse } = getChapterVerse(remnant);
        // console.log(chapter, verse, endChapter, endVerse);
        setStagedVerse({
            book: book,
            chapter: chapter,
            verse: verse,
            endChapter: endChapter,
            endVerse: endVerse,
        });
    }, [text]);

    function fusion(original, staged) {
        var target = {
            book: original.book,
            chapter: original.chapter,
            verse: original.verse,
            endChapter: original.endChapter,
            endVerse: original.endVerse,
        };
        if (!staged.book && !staged.chapter && !staged.verse && !staged.endChapter && !staged.endVerse) {
            return target;
        } else if (staged.book && staged.chapter && staged.verse) {
            target = {
                book: staged.book,
                chapter: staged.chapter,
                verse: staged.verse,
                endChapter: staged.endChapter,
                endVerse: staged.endVerse,
            };
        } else if (!staged.book && staged.chapter && staged.verse) {
            target = {
                book: original.book,
                chapter: staged.chapter,
                verse: staged.verse,
                endChapter: staged.endChapter,
                endVerse: staged.endVerse,
            };
        } else if (!staged.book && !staged.chapter && staged.verse) {
            target = {
                book: original.book,
                chapter: original.chapter,
                verse: staged.verse,
                endChapter: staged.endChapter,
                endVerse: staged.endVerse,
            };
        } else if (!staged.book && !staged.chapter && !staged.verse) {
            target = {
                book: original.book,
                chapter: original.chapter,
                verse: original.verse,
                endChapter: staged.endChapter,
                endVerse: staged.endVerse,
            };
        }
        return target;
    }

    useEffect(() => {
        if (!displayVerse) {
            return;
        }
        setDisplayTarget(fusion(displayVerse, stagedVerse));
    }, [stagedVerse, displayVerse]);

    const tools = [
        {
            text: "帮助",
            handler: () => {
                selectTabById(flexModel, "help_tab");
                helpTabSelection.setTabName("quick_locate");
            },
        },
    ];

    const IMEDictionary =
        appConfig.config.bible_display.language === "English"
            ? enDict
            : appConfig.config.bible_display.chinese === "简体"
            ? siDict
            : trDict;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ flexGrow: 0 }}>
                <TabToolBar title="快速投影" tools={tools} />
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                <Box>
                    <IMETextArea
                        text={text}
                        setText={setText}
                        DICTIONARY={IMEDictionary}
                        onDisplay={() => {
                            setDisplayVerse(displayTarget);
                            setHistory((history) => removeAllDuplicatesKeepLast([...history, displayTarget]));
                        }}
                        onPreview={() => {
                            setPreviewVerse(displayTarget);
                        }}
                        onAddToNote={() => {
                            setNoteList((notes) => {
                                console.log(notes, [...notes, displayTarget]);
                                return [...notes, displayTarget];
                            });
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                        <LocateVerseBox verseObj={displayTarget} />
                    </Box>
                    <br />
                </Box>
            </Box>
        </Box>
    );
}
