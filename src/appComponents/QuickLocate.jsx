import TabToolBar from "../utilComponents/TabToolBar";
import { selectTabById } from "../layout/layoutUtils";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { Box } from "@mui/material";
import VerseParagraph from "./VerseParagraph";
import IMETextArea from "./IMETextArea";
import { siDict, trDict, enDict } from "../bible";
import { getBook, getChapterVerse } from "../bible/parser";
import { filterUndefined } from "../utilFunctions/jsHelper";

export default function QuickLocate() {
    const { appConfig, helpTabSelection, flexModel, displayVerse, previewVerse, verseExists } = useContext(AppContext);
    const [text, setText] = useState("");
    const [stagedVerse, setStagedVerse] = useState({ verse: 99 });
    const [displayTarget, setDisplayTarget] = useState(displayVerse);
    const [previewTarget, setPreviewTarget] = useState({});

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

    useEffect(() => {
        if (!displayVerse) {
            return;
        }
        const filtered = filterUndefined(stagedVerse);
        console.log(displayVerse, stagedVerse, { ...displayVerse, ...filtered });
        setDisplayTarget({ ...displayVerse, ...filtered });
    }, [stagedVerse, displayVerse]);

    useEffect(() => {
        if (!previewVerse) {
            return;
        }
        const filtered = filterUndefined(stagedVerse);
        console.log(previewVerse, stagedVerse, { ...previewVerse, ...filtered });
        setPreviewTarget({ ...previewVerse, ...filtered });
    }, [stagedVerse, previewVerse]);

    const tools = [
        {
            text: "Help",
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
                    <IMETextArea text={text} setText={setText} DICTIONARY={IMEDictionary} />
                    {verseExists(displayTarget.book, displayTarget.chapter, displayTarget.verse) ? (
                        <VerseParagraph verseObj={displayTarget} />
                    ) : (
                        "欲访问的经节不存在"
                    )}
                    {verseExists(previewTarget.book, previewTarget.chapter, previewTarget.verse) ? (
                        <VerseParagraph verseObj={previewTarget} />
                    ) : (
                        "欲访问的经节不存在"
                    )}
                </Box>
            </Box>
        </Box>
    );
}
