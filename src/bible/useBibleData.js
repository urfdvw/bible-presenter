import {
    getSelectedVersions,
    getMultipleVerses,
    versesToRangeText,
    versesToParagraphsMD,
    getChapterVerses,
} from "./utils";
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

    function _getChapterVerses(book, chapter) {
        const versions = getSelectedVersions(
            ChineseSimplifiedVersion,
            ChineseTraditionalVersion,
            EnglishVersion,
            BibleVersionConfig
        );
        return getChapterVerses(versions, book, chapter);
    }

    return { getVerseText, getChapterVerses: _getChapterVerses };
}
