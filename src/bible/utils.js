import { compareLists } from "../utilFunctions/jsHelper";

/**
 * Version util
 */

export function getSelectedVersions(
    ChineseSimplifiedVersion,
    ChineseTraditionalVersion,
    EnglishVersion,
    BibleVersionConfig
) {
    const ChineseVersion = BibleVersionConfig.chinese === "简体" ? ChineseSimplifiedVersion : ChineseTraditionalVersion;
    if (BibleVersionConfig.language === "中文") {
        return [ChineseVersion];
    } else if (BibleVersionConfig.language === "English") {
        return [EnglishVersion];
    } else if (BibleVersionConfig.language === "对照") {
        return [ChineseVersion, EnglishVersion];
    }
}

/**
 * Get verses from index
 */

export function _verseExists(versions, book, chapter, verse) {
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

export function _getVerseInVersion(version, book, chapter, verse) {
    const foundVerse = version.verses.filter((verseObj) => {
        return verseObj.book === book && verseObj.chapter === chapter && verseObj.verse === verse;
    });
    return foundVerse.length > 0 ? foundVerse[0] : null;
}

export function _getVerseIndexInVersion(version, book, chapter, verse) {
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
    if (!_verseExists(versions, book, chapter, verse)) {
        console.error("starting verse does not exist", [book, chapter, verse]);
        return [];
    }
    if (!_verseExists(versions, book, endChapter, endVerse)) {
        console.error("ending verse does not exist", [book, endChapter, endVerse]);
        return [];
    }
    if (compareLists([chapter, verse], [endChapter, endVerse]) > 0) {
        var cup = chapter;
        chapter = endChapter;
        endChapter = cup;
        cup = verse;
        verse = endVerse;
        endVerse = cup;
    }
    // get position list
    const verseUniquePositions = new Set();
    for (const version of versions) {
        let index = _getVerseIndexInVersion(version, book, chapter, verse);
        let verseObj = version.verses[index];
        while (
            verseObj.book === book &&
            compareLists([verseObj.chapter, verseObj.verse], [endChapter, endVerse]) <= 0
        ) {
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
        versions.map((version) => _getVerseInVersion(version, position.book, position.chapter, position.verse))
    );
}

export function _getChapterEndVerse(versions, book, chapter) {
    if (!_verseExists(versions, book, chapter, 1)) {
        return -1;
    }
    return Math.max(
        ...versions.map((version) =>
            Math.max(
                ...version.verses
                    .filter((verseObj) => verseObj.book === book && verseObj.chapter === chapter)
                    .map((verseObj) => verseObj.verse)
            )
        )
    );
}

export function getChapterVerses(versions, book, chapter) {
    const endVerse = _getChapterEndVerse(versions, book, chapter);
    return getMultipleVerses(versions, book, chapter, 1, null, endVerse);
}

/**
 * Get Expressions of Verses
 */

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
    const startVerse = verses[0][0];
    const endVerse = verses.at(-1)[0];
    const isMultipleChapters = startVerse.chapter !== endVerse.chapter;
    const isSingleVerse = !isMultipleChapters && startVerse.verse === endVerse.verse;
    for (var i = 0; i < verses[0].length; i++) {
        const paragraph = verses
            .map((versionVerse, index) => {
                if (!versionVerse[i]) {
                    return null;
                }
                var positionText;
                if (isSingleVerse && startVerse.book !== 19) {
                    return versionVerse[i].text;
                }
                if (isMultipleChapters && (positionText = index === 0 || versionVerse[i].verse === 1)) {
                    positionText = `${versionVerse[i].chapter}:${versionVerse[i].verse}`;
                } else {
                    positionText = `${versionVerse[i].verse}`;
                }
                return `^${positionText}^${versionVerse[i].text}`;
            })
            .filter((x) => x)
            .join(startVerse.book === 19 ? "\n\n" : " ");
        returnParagraphs.push(paragraph);
    }
    return returnParagraphs;
}

/**
 * navigation
 */

export function getNextVerse(versions, book, chapter, verse) {
    var attempt;
    for (var i = 1; i <= 3; i++) {
        attempt = {
            book: book,
            chapter: chapter,
            verse: verse + i,
        };
        if (_verseExists(versions, attempt.book, attempt.chapter, attempt.verse)) {
            return attempt;
        }
    }

    attempt = {
        book: book,
        chapter: chapter + 1,
        verse: 1,
    };
    if (_verseExists(versions, attempt.book, attempt.chapter, attempt.verse)) {
        return attempt;
    }

    console.log("already at the end of book");

    return {
        book: book,
        chapter: chapter,
        verse: verse,
    };
}
export function getPreviousVerse(versions, book, chapter, verse) {
    var attempt;
    for (var i = 1; i <= 3; i++) {
        attempt = {
            book: book,
            chapter: chapter,
            verse: verse - i,
        };
        if (_verseExists(versions, attempt.book, attempt.chapter, attempt.verse)) {
            return attempt;
        }
    }

    attempt = {
        book: book,
        chapter: chapter - 1,
        verse: _getChapterEndVerse(versions, book, chapter - 1),
    };
    if (_verseExists(versions, attempt.book, attempt.chapter, attempt.verse)) {
        return attempt;
    }

    console.log("already at the start of book");

    return {
        book: book,
        chapter: chapter,
        verse: verse,
    };
}
