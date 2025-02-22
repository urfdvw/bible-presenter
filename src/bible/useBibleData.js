import { getSelectedVersions, getMultipleVerses, getChapterVerses, getNextVerse, getPreviousVerse } from "./utils";
export default function useBibleData(
    ChineseSimplifiedVersion,
    ChineseTraditionalVersion,
    EnglishVersion,
    BibleVersionConfig
) {
    function _getSelectedVersions() {
        return getSelectedVersions(
            ChineseSimplifiedVersion,
            ChineseTraditionalVersion,
            EnglishVersion,
            BibleVersionConfig
        );
    }

    function _getMultipleVerses(book, chapter, verse, endChapter, endVerse) {
        const versions = _getSelectedVersions();
        return getMultipleVerses(versions, book, chapter, verse, endChapter, endVerse);
    }

    function _getChapterVerses(book, chapter) {
        const versions = _getSelectedVersions();
        return getChapterVerses(versions, book, chapter);
    }
    function _getNextVerse(book, chapter, verse) {
        const versions = _getSelectedVersions();
        return getNextVerse(versions, book, chapter, verse);
    }

    function _getPreviousVerse(book, chapter, verse) {
        const versions = _getSelectedVersions();
        return getPreviousVerse(versions, book, chapter, verse);
    }

    return {
        getMultipleVerses: _getMultipleVerses,
        getChapterVerses: _getChapterVerses,
        getSelectedVersions: _getSelectedVersions,
        getNextVerse: _getNextVerse,
        getPreviousVerse: _getPreviousVerse,
    };
}
