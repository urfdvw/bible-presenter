import { compareLists } from "../utilFunctions/jsHelper";
import VerseRef from "../models/VerseRef";

/**
 * Get verses from index
 */

export function verseExists(versions, verseRef) {
    const position = VerseRef.from(verseRef);
    let badGivenVersePosition = true;
    for (let version of versions) {
        if (
            version.verses.filter(
                (verseObj) =>
                    verseObj.book === position.book &&
                    verseObj.chapter === position.chapter &&
                    verseObj.verse === position.verse,
            ).length > 0
        ) {
            badGivenVersePosition = false;
        }
    }
    return !badGivenVersePosition;
}

export function _getVerseInVersion(version, verseRef) {
    const position = VerseRef.from(verseRef);
    const foundVerse = version.verses.filter((verseObj) => {
        return (
            verseObj.book === position.book &&
            verseObj.chapter === position.chapter &&
            verseObj.verse === position.verse
        );
    });
    return foundVerse.length > 0 ? foundVerse[0] : null;
}

export function _getVerseIndexInVersion(version, verseRef) {
    const position = VerseRef.from(verseRef);
    const foundVerse = version.verses
        .map((verse, index) => {
            return { ...verse, index: index };
        })
        .filter((verseObj) => {
            return (
                verseObj.book === position.book &&
                verseObj.chapter === position.chapter &&
                verseObj.verse === position.verse
            );
        });
    if (foundVerse.length === 0) {
        return null;
    } else {
        return foundVerse[0].index;
    }
}

export function getMultipleVerses(versions, verseRef) {
    const position = VerseRef.from(verseRef);
    let book = position.book;
    let chapter = position.chapter;
    let verse = position.verse;
    let endChapter = position.endChapter;
    let endVerse = position.endVerse;
    // auto fill
    if (!endChapter) {
        endChapter = chapter;
    }
    if (!endVerse) {
        endVerse = verse;
    }
    // verify
    if (!verseExists(versions, new VerseRef({ book, chapter, verse }))) {
        console.error("starting verse does not exist", [book, chapter, verse]);
        return [];
    }
    if (!verseExists(versions, new VerseRef({ book, chapter: endChapter, verse: endVerse }))) {
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
        let index = _getVerseIndexInVersion(version, new VerseRef({ book, chapter, verse }));
        if (index === null || index === undefined) {
            // verse not found
            continue;
        }
        let verseObj = version.verses[index];
        while (
            verseObj.book === book &&
            compareLists([verseObj.chapter, verseObj.verse], [endChapter, endVerse]) <= 0
        ) {
            verseUniquePositions.add(
                JSON.stringify({ book: verseObj.book, chapter: verseObj.chapter, verse: verseObj.verse }),
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
        versions.map((version) => _getVerseInVersion(version, position)),
    );
}

export function _getChapterEndVerse(versions, book, chapter) {
    if (!verseExists(versions, new VerseRef({ book, chapter, verse: 1 }))) {
        return -1;
    }
    return Math.max(
        ...versions.map((version) =>
            Math.max(
                ...version.verses
                    .filter((verseObj) => verseObj.book === book && verseObj.chapter === chapter)
                    .map((verseObj) => verseObj.verse),
            ),
        ),
    );
}

export function getChapterVerses(versions, book, chapter) {
    const endVerse = _getChapterEndVerse(versions, book, chapter);
    return getMultipleVerses(versions, new VerseRef({ book, chapter, verse: 1, endVerse }));
}

/**
 * Get Expressions of Verses
 */

export function versesToRangeText(verses) {
    if (verses.length === 0) {
        return [];
    }
    const returnRanges = [];
    for (var i = 0; i < verses[0].length; i++) {
        try {
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
                    `${bookName} ${startVerse.chapter}:${startVerse.verse}-${endVerse.chapter}:${endVerse.verse}`,
                );
            }
        } catch (error) {
            console.error(error);
            returnRanges.push("");
        }
    }
    return returnRanges;
}

export function versesToParagraphsMD(verses) {
    if (verses.length === 0) {
        return "";
    }
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

export function getNextVerse(versions, verseRef) {
    const position = VerseRef.from(verseRef);
    const { book, chapter, verse } = position;
    var attempt;
    for (var i = 1; i <= 3; i++) {
        attempt = new VerseRef({
            book: book,
            chapter: chapter,
            verse: verse + i,
        });
        if (verseExists(versions, attempt)) {
            return attempt;
        }
    }

    attempt = new VerseRef({
        book: book,
        chapter: chapter + 1,
        verse: 1,
    });
    if (verseExists(versions, attempt)) {
        return attempt;
    }

    console.log("already at the end of book");

    return new VerseRef({
        book: book,
        chapter: chapter,
        verse: verse,
    });
}
export function getPreviousVerse(versions, verseRef) {
    const position = VerseRef.from(verseRef);
    const { book, chapter, verse } = position;
    var attempt;
    for (var i = 1; i <= 3; i++) {
        attempt = new VerseRef({
            book: book,
            chapter: chapter,
            verse: verse - i,
        });
        if (verseExists(versions, attempt)) {
            return attempt;
        }
    }

    attempt = new VerseRef({
        book: book,
        chapter: chapter - 1,
        verse: _getChapterEndVerse(versions, book, chapter - 1),
    });
    if (verseExists(versions, attempt)) {
        return attempt;
    }

    console.log("already at the start of book");

    return new VerseRef({
        book: book,
        chapter: chapter,
        verse: verse,
    });
}
