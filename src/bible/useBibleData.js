import { getMultipleVerses, getChapterVerses, getNextVerse, getPreviousVerse, verseExists, getBookMeta } from "./utils";
import VerseRef from "../models/VerseRef";
import { preloadVersionFuseIndices } from "./fuseIndex";
export default function useBibleData(bible, BibleVersionConfig) {
    function _getSelectedVersions() {
        const ChineseVersion = BibleVersionConfig.chinese === "简体" ? bible.cuvs : bible.cuvt;
        const EnglishVersion =
            BibleVersionConfig.english === "KJV"
                ? bible.kjv
                : BibleVersionConfig.english === "ASV"
                ? bible.asv
                : bible.web;
        let versions = [];
        if (BibleVersionConfig.language === "中文") {
            versions = [ChineseVersion];
        } else if (BibleVersionConfig.language === "English") {
            versions = [EnglishVersion];
        } else if (BibleVersionConfig.language === "对照") {
            versions = [ChineseVersion, EnglishVersion];
        }
        preloadVersionFuseIndices(versions);
        return versions;
    }

    function _getMultipleVerses(verseRef) {
        const versions = _getSelectedVersions();
        return getMultipleVerses(versions, verseRef);
    }

    function _getChapterVerses(book, chapter) {
        const versions = _getSelectedVersions();
        return getChapterVerses(versions, book, chapter);
    }
    function _getNextVerse(verseRef) {
        const versions = _getSelectedVersions();
        return getNextVerse(versions, verseRef);
    }

    function _getPreviousVerse(verseRef) {
        const versions = _getSelectedVersions();
        return getPreviousVerse(versions, verseRef);
    }

    function _verseExists(verseRef) {
        const normalized = VerseRef.from(verseRef);
        const start = new VerseRef({
            book: normalized.book,
            chapter: normalized.chapter,
            verse: normalized.verse,
        });
        const end = new VerseRef({
            book: normalized.book,
            chapter: normalized.endChapter || normalized.chapter,
            verse: normalized.endVerse,
        });
        const versions = _getSelectedVersions();
        const startExists = verseExists(versions, start);
        const endExists = verseExists(versions, end);
        return normalized.endVerse ? startExists && endExists : startExists;
    }

    function _getBookMeta(book) {
        const versions = _getSelectedVersions();
        return getBookMeta(versions, book);
    }

    return {
        getMultipleVerses: _getMultipleVerses,
        getChapterVerses: _getChapterVerses,
        getSelectedVersions: _getSelectedVersions,
        getNextVerse: _getNextVerse,
        getPreviousVerse: _getPreviousVerse,
        verseExists: _verseExists,
        getBookMeta: _getBookMeta,
    };
}
