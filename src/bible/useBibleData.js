import { getSelectedVersions, getMultipleVerses, getChapterVerses } from "./utils";
export default function useBibleData(
    ChineseSimplifiedVersion,
    ChineseTraditionalVersion,
    EnglishVersion,
    BibleVersionConfig
) {
    function _getMultipleVerses(book, chapter, verse, endChapter, endVerse) {
        const versions = getSelectedVersions(
            ChineseSimplifiedVersion,
            ChineseTraditionalVersion,
            EnglishVersion,
            BibleVersionConfig
        );
        return getMultipleVerses(versions, book, chapter, verse, endChapter, endVerse);
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

    return { getMultipleVerses: _getMultipleVerses, getChapterVerses: _getChapterVerses };
}
