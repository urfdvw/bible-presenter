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

    const notePosition = verseObj.notePosition || "开头";
    const isNoteHidden = notePosition === "不显示";

    let displayMarkdown = paragraphs.join("\n\n");
    if (!isNoteHidden && verseObj.note && verseObj.note.length > 0) {
        if (forceNoteAfterVerse) {
            displayMarkdown = [displayMarkdown, verseObj.note].filter((text) => text && text.length > 0).join("\n\n");
        } else if (notePosition === "开头") {
            displayMarkdown = verseObj.note + "\n\n" + displayMarkdown;
        } else if (notePosition === "结尾") {
            displayMarkdown = displayMarkdown + "\n\n" + verseObj.note;
        } // other wise do nothing
    }

    return <MarkdownExtended>{displayMarkdown}</MarkdownExtended>;
}
