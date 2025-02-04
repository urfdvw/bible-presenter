export default function useBibleData(
    ChineseSimplifiedVersion,
    ChineseTraditionalVersion,
    EnglishVersion,
    BibleVersionConfig
) {
    function _getVerseInVersion(version, book, chapter, verse) {
        const indexInput = version.verses
            .map((verse, index) => {
                return { ...verse, index: index };
            })
            .filter((verseObj) => {
                return verseObj.book === book && verseObj.chapter === chapter && verseObj.verse === verse;
            })[0].index;
        return version.verses[indexInput];
    }

    function _getNextVerseInVersion(version, book, chapter, verse) {
        const indexInput = version.verses
            .map((verse, index) => {
                return { ...verse, index: index };
            })
            .filter((verseObj) => {
                return verseObj.book === book && verseObj.chapter === chapter && verseObj.verse === verse;
            })[0].index;
        try {
            return version.verses[indexInput + 1];
        } catch (error) {
            console.error(error);
            return version.verses[indexInput];
        }
    }

    function getNextVerse(book, chapter, verse) {
        let nextBook = book;
        let nextChapter = chapter;
        let nextVerse = verse;

        const versions = _getSelectedVersions();

        // verify given verse valid
        let badGivenVerseIndex = true;
        for (let version of versions) {
            if (
                version.verses.filter(
                    (verse) => verse.book === book && verse.chapter === chapter && verse.verse === verse
                )
            ) {
                badGivenVerseIndex = false;
            }
        }
        if (badGivenVerseIndex) {
            console.error("invalid verse index");
            return {
                nextBook: book,
                nextChapter: chapter,
                nextVerse: verse,
            };
        }

        // console.log(
        //     "check selected versions",
        //     versions.map((version) => version.verses[0])
        // );

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
