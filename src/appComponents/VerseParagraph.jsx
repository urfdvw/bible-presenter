import { useContext } from "react";
import AppContext from "../AppContext";
import MarkdownExtended from "../utilComponents/MarkdownExtended";
import { versesToRangeText, versesToParagraphsMD } from "../bible/utils";

export default function VerseParagraph({ book, chapter, verse, endChapter, endVerse }) {
    const { appConfig, getMultipleVerses } = useContext(AppContext);

    const verses = getMultipleVerses(book, chapter, verse, endChapter, endVerse);
    const rangeList = versesToRangeText(verses);
    const textList = versesToParagraphsMD(verses);
    const paragraphs = rangeList.map((range, versionIndex) => {
        return appConfig.config.bible_display.range_location === "开头"
            ? `(${range}) ${textList[versionIndex]}`
            : `${textList[versionIndex]}\t——${range}`;
    });
    return <MarkdownExtended>{paragraphs.join("\n\n")}</MarkdownExtended>;
}
