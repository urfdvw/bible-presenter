export default function useBibleData(
    ChineseSimplifiedVersion,
    ChineseTraditionalVersion,
    EnglishVersion,
    BibleVersionConfig
) {
    function _getSelectedVersions() {
        console.log(BibleVersionConfig.chinese === "简体");
        const ChineseVersion =
            BibleVersionConfig.chinese === "简体" ? ChineseSimplifiedVersion : ChineseTraditionalVersion;

        console.log(ChineseSimplifiedVersion.verses[0]);
        if (BibleVersionConfig.language === "中文") {
            return [ChineseVersion];
        } else if (BibleVersionConfig.language === "English") {
            return [EnglishVersion];
        } else if (BibleVersionConfig.language === "对照") {
            return [ChineseVersion, EnglishVersion];
        }
    }
    function getNextVerse(book, chapter, verse) {
        let nextBook = book;
        let nextChapter = chapter;
        let nextVerse = verse;

        const versions = _getSelectedVersions();

        console.log(
            "versions",
            versions.map((version) => version.verses[0])
        );
        return {
            nextBook: nextBook,
            nextChapter: nextChapter,
            nextVerse: nextVerse,
        };
    }

    function getVerseText(book, chapter, verse, endChapter, endVerse) {
        const verseText = "";
        return verseText;
    }

    function getRangeText(book, chapter, verse, endChapter, endVerse) {
        const rangeText = "";
        return rangeText;
    }

    return { getNextVerse, getVerseText, getRangeText };
}
