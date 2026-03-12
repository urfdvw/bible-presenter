import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import AppContext from "../AppContext";
import MarkdownExtended from "../utilComponents/MarkdownExtended";
import { versesToRangeText, versesToParagraphsMD } from "../bible/utils";

/** @typedef {import("../models/VerseRef").VerseRefLike} VerseRefLike */

/**
 * @param {{verseObj: VerseRefLike, forceNoteAfterVerse?: boolean, pureText?: boolean}} props
 */
export default function VerseParagraph({ verseObj, forceNoteAfterVerse = false, pureText = false }) {
    const { appConfig, getMultipleVerses } = useContext(AppContext);

    const verses = getMultipleVerses(verseObj);
    const rangeList = pureText ? [] : versesToRangeText(verses);
    const textList = pureText
        ? verses.length > 0
            ? verses[0].map((_, versionIndex) =>
                  verses
                      .map((versionVerse) => versionVerse[versionIndex]?.text || "")
                      .filter((text) => text.length > 0)
                      .join(" ")
              )
            : []
        : versesToParagraphsMD(verses);
    const paragraphs = pureText
        ? textList
        : rangeList.map((range, versionIndex) => {
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
    const isNoteOnly = notePosition === "仅笔记";
    const noteText = verseObj.note || "";
    const hasNote = !isNoteHidden && noteText.length > 0;
    const showNoteBefore = hasNote && !forceNoteAfterVerse && notePosition === "开头";
    const showNoteAfter = hasNote && (forceNoteAfterVerse || notePosition === "结尾");

    return (
        <Box>
            {isNoteOnly ? (
                hasNote ? <MarkdownExtended>{noteText}</MarkdownExtended> : null
            ) : (
                <>
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
                                {pureText ? <Typography>{paragraphs[0] || ""}</Typography> : <MarkdownExtended>{paragraphs[0] || ""}</MarkdownExtended>}
                            </Box>
                            <Box>
                                {pureText ? <Typography>{paragraphs[1] || ""}</Typography> : <MarkdownExtended>{paragraphs[1] || ""}</MarkdownExtended>}
                            </Box>
                        </Box>
                    ) : pureText ? (
                        paragraphs.map((paragraph, index) => <Typography key={index}>{paragraph}</Typography>)
                    ) : (
                        <MarkdownExtended>{paragraphs.join("\n\n")}</MarkdownExtended>
                    )}
                    {showNoteAfter && <MarkdownExtended>{noteText}</MarkdownExtended>}
                </>
            )}
        </Box>
    );
}
