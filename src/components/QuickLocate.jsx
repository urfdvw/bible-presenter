import TabToolBar from "../utilComponents/TabToolBar";
import { selectTabById } from "../layout/layoutUtils";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import Box from "@mui/material/Box";
import IMETextArea from "./IMETextArea";
import { siDict, trDict, enDict } from "../bible";
import { getBook, getChapterVerse } from "../bible/parser";
import { removeAllDuplicatesKeepLast } from "../utilFunctions/jsHelper";
import { LocateVerseBox } from "./VerseBox";
import VerseRef from "../models/VerseRef";

/** @typedef {import("../models/VerseRef").VerseRefLike} VerseRefLike */

export default function QuickLocate() {
    const {
        appConfig,
        helpTabSelection,
        flexModel,
        isMobileReadingMode,
        collapseLeftSidebar,
        displayVerse,
        setDisplayVerse,
        setPreviewVerse,
        setNoteList,
        setHistory,
    } = useContext(AppContext);
    const [text, setText] = useState("");
    /** @type {[VerseRefLike, import("react").Dispatch<import("react").SetStateAction<VerseRefLike>>]} */
    const [stagedVerse, setStagedVerse] = useState(new VerseRef({ verse: 99 }));
    /** @type {[VerseRef, import("react").Dispatch<import("react").SetStateAction<VerseRef>>]} */
    const [displayTarget, setDisplayTarget] = useState(VerseRef.from(displayVerse));

    useEffect(() => {
        const { book, remnant } = getBook(text);
        const { chapter, verse, endChapter, endVerse } = getChapterVerse(remnant);
        setStagedVerse(new VerseRef({ book, chapter, verse, endChapter, endVerse }));
    }, [text]);

    /**
     * @param {VerseRefLike} original
     * @param {VerseRefLike} staged
     * @returns {VerseRef}
     */
    function fusion(original, staged) {
        let target = VerseRef.from(original);
        if (!staged.book && !staged.chapter && !staged.verse && !staged.endChapter && !staged.endVerse) {
            return target;
        } else if (staged.book && staged.chapter && staged.verse) {
            target = new VerseRef({
                book: staged.book,
                chapter: staged.chapter,
                verse: staged.verse,
                endChapter: staged.endChapter,
                endVerse: staged.endVerse,
            });
        } else if (!staged.book && staged.chapter && staged.verse) {
            target = new VerseRef({
                book: original.book,
                chapter: staged.chapter,
                verse: staged.verse,
                endChapter: staged.endChapter,
                endVerse: staged.endVerse,
            });
        } else if (!staged.book && !staged.chapter && staged.verse) {
            target = new VerseRef({
                book: original.book,
                chapter: original.chapter,
                verse: staged.verse,
                endChapter: staged.endChapter,
                endVerse: staged.endVerse,
            });
        } else if (!staged.book && !staged.chapter && !staged.verse) {
            target = new VerseRef({
                book: original.book,
                chapter: original.chapter,
                verse: original.verse,
                endChapter: staged.endChapter,
                endVerse: staged.endVerse,
            });
        }
        return target;
    }

    useEffect(() => {
        if (!displayVerse) {
            return;
        }
        setDisplayTarget(fusion(VerseRef.from(displayVerse), stagedVerse));
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
                <TabToolBar title="快速定位" tools={tools} />
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                <Box>
                    <IMETextArea
                        text={text}
                        setText={setText}
                        DICTIONARY={IMEDictionary}
                        onDisplay={() => {
                            if (isMobileReadingMode) {
                                setPreviewVerse(displayTarget);
                                collapseLeftSidebar();
                            } else {
                                setDisplayVerse(displayTarget);
                                setHistory((history) => removeAllDuplicatesKeepLast([...history, displayTarget]));
                            }
                        }}
                        onPreview={() => {
                            setPreviewVerse(displayTarget);
                            if (isMobileReadingMode) {
                                collapseLeftSidebar();
                            }
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
