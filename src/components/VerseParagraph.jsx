import Box from "@mui/material/Box";
import { useContext } from "react";
import AppContext from "../AppContext";
import MarkdownExtended from "../utilComponents/MarkdownExtended";
import { versesToRangeText, versesToParagraphsMD } from "../bible/utils";

/** @typedef {import("../models/VerseRef").VerseRefLike} VerseRefLike */

/**
 * @param {{verseObj: VerseRefLike, forceNoteAfterVerse?: boolean}} props
 */
export default function VerseParagraph({ verseObj, forceNoteAfterVerse = false }) {
    const { appConfig, getMultipleVerses } = useContext(AppContext);

    const verses = getMultipleVerses(verseObj);
    const rangeList = versesToRangeText(verses);
    const textList = versesToParagraphsMD(verses);
    const paragraphs = rangeList.map((range, versionIndex) => {
        if (verseObj.book === 19) {
            return `### ${verses[0][versionIndex].book_name} ${verseObj.chapter} \n\n ${textList[versionIndex]}`;
        }
        if (textList[versionIndex].length === 0) {
            return "";
        }
        return appConfig.config.bible_display.range_location === "开头"
            ? `(${range}) ${textList[versionIndex]}`
            : `${textList[versionIndex]}\t——${range}`;
    });

    const useParallelContrastLayout =
        appConfig.config.bible_display.language === "对照" &&
        appConfig.config.bible_display.contrast_layout === "并排" &&
        paragraphs.length === 2;
    const notePosition = verseObj.notePosition || "开头";
    const isNoteHidden = notePosition === "不显示";
    const noteText = verseObj.note || "";
    const hasNote = !isNoteHidden && noteText.length > 0;
    const showNoteBefore = hasNote && !forceNoteAfterVerse && notePosition === "开头";
    const showNoteAfter = hasNote && (forceNoteAfterVerse || notePosition === "结尾");

    return (
        <Box>
            {showNoteBefore && <MarkdownExtended>{noteText}</MarkdownExtended>}
            {useParallelContrastLayout ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 2,
                    }}
                >
                    <Box>
                        <MarkdownExtended>{paragraphs[0] || ""}</MarkdownExtended>
                    </Box>
                    <Box>
                        <MarkdownExtended>{paragraphs[1] || ""}</MarkdownExtended>
                    </Box>
                </Box>
            ) : (
                <MarkdownExtended>{paragraphs.join("\n\n")}</MarkdownExtended>
            )}
            {showNoteAfter && <MarkdownExtended>{noteText}</MarkdownExtended>}
        </Box>
    );
}
