import { useContext } from "react";
import AppContext from "../AppContext";
import MarkdownExtended from "../utilComponents/MarkdownExtended";
import { versesToRangeText, versesToParagraphsMD } from "../bible/utils";

export default function VerseParagraph({ verseObj }) {
    const { appConfig, getMultipleVerses } = useContext(AppContext);

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
    return <MarkdownExtended>{paragraphs.join("\n\n")}</MarkdownExtended>;
}
