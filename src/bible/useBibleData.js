import { getSelectedVersions, getMultipleVerses, versesToRangeText, versesToParagraphsMD } from "./utils";
export default function useBibleData(
    ChineseSimplifiedVersion,
    ChineseTraditionalVersion,
    EnglishVersion,
    BibleVersionConfig
) {
    function getVerseText(book, chapter, verse, endChapter, endVerse) {
        const versions = getSelectedVersions(
            ChineseSimplifiedVersion,
            ChineseTraditionalVersion,
            EnglishVersion,
            BibleVersionConfig
        );
        const verses = getMultipleVerses(versions, book, chapter, verse, endChapter, endVerse);
        return {
            rangeList: versesToRangeText(verses),
            textList: versesToParagraphsMD(verses),
        };
    }

    return { getVerseText };
}
