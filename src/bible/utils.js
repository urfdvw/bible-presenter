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

export function verseExists(versions, book, chapter, verse) {
    let badGivenVersePosition = true;
    for (let version of versions) {
        if (
            version.verses.filter(
                (verseObj) => verseObj.book === book && verseObj.chapter === chapter && verseObj.verse === verse
            ).length > 0
        ) {
            badGivenVersePosition = false;
        }
    }
    return !badGivenVersePosition;
}

export function getVerseInVersion(version, book, chapter, verse) {
    const foundVerse = version.verses.filter((verseObj) => {
        return verseObj.book === book && verseObj.chapter === chapter && verseObj.verse === verse;
    });
    return foundVerse.length > 0 ? foundVerse[0] : null;
}

export function getVerseIndexInVersion(version, book, chapter, verse) {
    const foundVerse = version.verses
        .map((verse, index) => {
            return { ...verse, index: index };
        })
        .filter((verseObj) => {
            return verseObj.book === book && verseObj.chapter === chapter && verseObj.verse === verse;
        });
    if (foundVerse.length === 0) {
        return null;
    } else {
        return foundVerse[0].index;
    }
}

export function getMultipleVerses(versions, book, chapter, verse, endChapter, endVerse) {
    // auto fill
    if (!endChapter) {
        endChapter = chapter;
    }
    if (!endVerse) {
        endVerse = verse;
    }
    // verify
    if (!verseExists(versions, book, chapter, verse)) {
        console.error("starting verse does not exist", [book, chapter, verse]);
        return [];
    }
    if (!verseExists(versions, book, endChapter, endVerse)) {
        console.error("ending verse does not exist", [book, endChapter, endVerse]);
        return [];
    }
    if ([chapter, verse] > [endChapter, endVerse]) {
        console.error("starting verse should locate before ending verse");
        return [];
    }
    // get position list
    const verseUniquePositions = new Set();
    for (const version of versions) {
        let index = getVerseIndexInVersion(version, book, chapter, verse);
        let verseObj = version.verses[index];
        while ([verseObj.chapter, verseObj.verse] <= [endChapter, endVerse]) {
            verseUniquePositions.add(
                JSON.stringify({ book: verseObj.book, chapter: verseObj.chapter, verse: verseObj.verse })
            );
            if (index === version.verses.length - 1) {
                break;
            }
            index += 1;
            verseObj = version.verses[index];
        }
    }
    const versePositions = Array.from(verseUniquePositions).map((str) => JSON.parse(str));
    // get verses
    return versePositions.map((position) =>
        versions.map((version) => getVerseInVersion(version, position.book, position.chapter, position.verse))
    );
}

export function versesToRangeText(verses) {
    const returnRanges = [];
    for (var i = 0; i < verses[0].length; i++) {
        const bookName = verses[0][i].book_name;
        const startVerse = verses[0][i];
        const endVerse = verses.at(-1)[i];

        if (startVerse.chapter === endVerse.chapter) {
            if (startVerse.verse === endVerse.verse) {
                returnRanges.push(`${bookName} ${startVerse.chapter}:${startVerse.verse}`);
            } else {
                returnRanges.push(`${bookName} ${startVerse.chapter}:${startVerse.verse}-${endVerse.verse}`);
            }
        } else {
            returnRanges.push(
                `${bookName} ${startVerse.chapter}:${startVerse.verse}-${endVerse.chapter}:${endVerse.verse}`
            );
        }
    }
    return returnRanges;
}

export function versesToParagraphsMD(verses) {
    const returnParagraphs = [];
    const multipleChapters = verses[0][0].chapter !== verses.at(-1)[0].chapter;
    for (var i = 0; i < verses[0].length; i++) {
        const paragraph = verses
            .map((versionVerse, index) => {
                if (!versionVerse[i]) {
                    return null;
                }
                var positionText;
                if (multipleChapters && (positionText = index === 0 || versionVerse[i].verse === 1)) {
                    positionText = `${versionVerse[i].chapter}:${versionVerse[i].verse}`;
                } else {
                    positionText = `${versionVerse[i].verse}`;
                }
                return `^${positionText}^${versionVerse[i].text}`;
            })
            .filter((x) => x)
            .join(" ");
        returnParagraphs.push(paragraph);
    }
    return returnParagraphs;
}
