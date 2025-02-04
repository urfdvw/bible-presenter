export function getSelectedVersions(
    ChineseSimplifiedVersion,
    ChineseTraditionalVersion,
    EnglishVersion,
    BibleVersionConfig
) {
    console.log(BibleVersionConfig.chinese === "简体");
    const ChineseVersion = BibleVersionConfig.chinese === "简体" ? ChineseSimplifiedVersion : ChineseTraditionalVersion;
    if (BibleVersionConfig.language === "中文") {
        return [ChineseVersion];
    } else if (BibleVersionConfig.language === "English") {
        return [EnglishVersion];
    } else if (BibleVersionConfig.language === "对照") {
        return [ChineseVersion, EnglishVersion];
    }
}

export function getVerseInVersion(version, book, chapter, verse) {
    const indexInput = version.verses
        .map((verse, index) => {
            return { ...verse, index: index };
        })
        .filter((verseObj) => {
            return verseObj.book === book && verseObj.chapter === chapter && verseObj.verse === verse;
        })[0].index;
    return version.verses[indexInput];
}
