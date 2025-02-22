import { useContext } from "react";
import AppContext from "../AppContext";
import MarkdownExtended from "../utilComponents/MarkdownExtended";
import { versesToRangeText, versesToParagraphsMD } from "../bible/utils";

export default function VerseParagraph() {
    const { appConfig, getMultipleVerses, displayVerse } = useContext(AppContext);

    const verses = getMultipleVerses(
        displayVerse.book,
        displayVerse.chapter,
        displayVerse.verse,
        displayVerse.endChapter,
        displayVerse.endVerse
    );
    const rangeList = versesToRangeText(verses);
    const textList = versesToParagraphsMD(verses);
    const paragraphs = rangeList.map((range, versionIndex) => {
        if (displayVerse.book === 19) {
            return `### ${verses[0][versionIndex].book_name} ${displayVerse.chapter} \n\n ${textList[versionIndex]}`;
        }
        return appConfig.config.bible_display.range_location === "开头"
            ? `(${range}) ${textList[versionIndex]}`
            : `${textList[versionIndex]}\t——${range}`;
    });
    return <MarkdownExtended>{paragraphs.join("\n\n")}</MarkdownExtended>;
}
