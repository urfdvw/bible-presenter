import { getMultipleVerses, getChapterVerses, getNextVerse, getPreviousVerse, verseExists } from "./utils";
export default function useBibleData(bible, BibleVersionConfig) {
    function _getSelectedVersions() {
        const ChineseVersion = BibleVersionConfig.chinese === "简体" ? bible.cuvs : bible.cuvt;
        const EnglishVersion =
            BibleVersionConfig.english === "KJV"
                ? bible.kjv
                : BibleVersionConfig.english === "ASV"
                ? bible.asv
                : bible.web;
        if (BibleVersionConfig.language === "中文") {
            return [ChineseVersion];
        } else if (BibleVersionConfig.language === "English") {
            return [EnglishVersion];
        } else if (BibleVersionConfig.language === "对照") {
            return [ChineseVersion, EnglishVersion];
        }
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

    function _verseExists(book, chapter, verse, endChapter, endVerse) {
        if (!endChapter) {
            endChapter = chapter;
        }
        const versions = _getSelectedVersions();
        const startExists = verseExists(versions, book, chapter, verse);
        const endExists = verseExists(versions, book, endChapter, endVerse);
        return endVerse ? startExists && endExists : startExists;
    }

    return {
        getMultipleVerses: _getMultipleVerses,
        getChapterVerses: _getChapterVerses,
        getSelectedVersions: _getSelectedVersions,
        getNextVerse: _getNextVerse,
        getPreviousVerse: _getPreviousVerse,
        verseExists: _verseExists,
    };
}
