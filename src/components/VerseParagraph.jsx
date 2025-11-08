import { useContext } from "react";
import AppContext from "../AppContext";
import MarkdownExtended from "../utilComponents/MarkdownExtended";
import { versesToRangeText, versesToParagraphsMD } from "../bible/utils";

export default function VerseParagraph({ verseObj }) {
    const { appConfig, getMultipleVerses } = useContext(AppContext);

    console.log("VerseParagraph render", verseObj);

    const verses = getMultipleVerses(
        verseObj.book,
        verseObj.chapter,
        verseObj.verse,
        verseObj.endChapter,
        verseObj.endVerse
    );
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

    const note_position = appConfig.config.bible_display.note_position;

    let displayMarkdown = paragraphs.join("\n\n");
    if (verseObj.note && verseObj.note.length > 0) {
        if (note_position === "开头") {
            displayMarkdown = verseObj.note + "\n\n" + displayMarkdown;
        } else if (note_position === "结尾") {
            displayMarkdown = displayMarkdown + "\n\n" + verseObj.note;
        } // other wise do nothing
    }

    return <MarkdownExtended>{displayMarkdown}</MarkdownExtended>;
}
