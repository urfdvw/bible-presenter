import { getSelectedVersions, getMultipleVerses, getChapterVerses } from "./utils";
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

    return {
        getMultipleVerses: _getMultipleVerses,
        getChapterVerses: _getChapterVerses,
        getSelectedVersions: _getSelectedVersions,
    };
}
