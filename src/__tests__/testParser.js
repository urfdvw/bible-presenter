import { getBook, getChapterVerse } from "../bible/parser";

describe("Test getBook", () => {
    test("HE", () => {
        expect(getBook("约翰福音 3:16")).toStrictEqual({ book: 43, remnant: "3:16" });
    });
    test("BE", () => {
        expect(getBook(" 3:16")).toStrictEqual({ book: undefined, remnant: "3:16" });
    });
    test("BE, book name should be complete", () => {
        expect(getBook("约翰福 3:16")).toStrictEqual({ book: undefined, remnant: "约翰福 3:16" });
    });
});

describe("Test getChapterVerse", () => {
    test("single verse with :", () => {
        expect(getChapterVerse("3:16")).toStrictEqual({
            chapter: 3,
            verse: 16,
            endChapter: undefined,
            endVerse: undefined,
        });
    });
    test("single verse with space", () => {
        expect(getChapterVerse("3 16")).toStrictEqual({
            chapter: 3,
            verse: 16,
            endChapter: undefined,
            endVerse: undefined,
        });
    });
    test("single verse, verse only with :", () => {
        expect(getChapterVerse(":16")).toStrictEqual({
            chapter: undefined,
            verse: 16,
            endChapter: undefined,
            endVerse: undefined,
        });
    });
    test("chapter only, locate to the first verse", () => {
        expect(getChapterVerse("3")).toStrictEqual({
            chapter: 3,
            verse: 1,
            endChapter: undefined,
            endVerse: undefined,
        });
    });
    test("range of verse, same chapter", () => {
        expect(getChapterVerse("3:16-18")).toStrictEqual({
            chapter: 3,
            verse: 16,
            endChapter: undefined,
            endVerse: 18,
        });
    });
    test("range of verse, different chapter", () => {
        expect(getChapterVerse("3:16-4:1")).toStrictEqual({
            chapter: 3,
            verse: 16,
            endChapter: 4,
            endVerse: 1,
        });
    });
    test("range one end, same chapter", () => {
        expect(getChapterVerse("-18")).toStrictEqual({
            chapter: undefined,
            verse: undefined,
            endChapter: undefined,
            endVerse: 18,
        });
    });
    test("range one end, different chapter", () => {
        expect(getChapterVerse("-4:1")).toStrictEqual({
            chapter: undefined,
            verse: undefined,
            endChapter: 4,
            endVerse: 1,
        });
    });
    test("BE, matching none", () => {
        expect(getChapterVerse("ivihdivh")).toStrictEqual({
            chapter: undefined,
            verse: undefined,
            endChapter: undefined,
            endVerse: undefined,
        });
    });
    test("BE, matching empty", () => {
        expect(getChapterVerse("")).toStrictEqual({
            chapter: undefined,
            verse: undefined,
            endChapter: undefined,
            endVerse: undefined,
        });
    });
    test("BE, matching multiple", () => {
        expect(getChapterVerse("3:16 4:1")).toStrictEqual({
            chapter: undefined,
            verse: undefined,
            endChapter: undefined,
            endVerse: undefined,
        });
    });
});

describe("Additional representative tests for getChapterVerse", () => {
    test("start has chapter and verse, dash present but no end part (e.g. '3:16-')", () => {
        // Not in the original list, but let's see what we get:
        // "3:16-" => start: chapter=3, verse=16; end: empty => undefined
        expect(getChapterVerse("3:16-")).toStrictEqual({
            chapter: 3,
            verse: 16,
            endChapter: undefined,
            endVerse: undefined,
        });
    });

    test("end has chapter only, e.g. '3:16-4'", () => {
        // According to the rules:
        // End single number => that single number is the verse (NOT the chapter).
        // Actually, '4' at the end part should parse as endVerse=4, endChapter=undefined
        // So overall => start=3:16 => (c=3,v=16), end => (c=undefined, v=4)
        expect(getChapterVerse("3:16-4")).toStrictEqual({
            chapter: 3,
            verse: 16,
            endChapter: undefined,
            endVerse: 4,
        });
    });

    test("allow extra spaces around references, e.g. '  :16  -   :32  '", () => {
        // Start => ':16' => c=undefined,v=16
        // End   => ':32' => c=undefined,v=32
        expect(getChapterVerse("  :16  -   :32  ")).toStrictEqual({
            chapter: undefined,
            verse: 16,
            endChapter: undefined,
            endVerse: 32,
        });
    });

    test("same start and end reference, e.g. '1:1-1:1'", () => {
        expect(getChapterVerse("1:1-1:1")).toStrictEqual({
            chapter: 1,
            verse: 1,
            endChapter: 1,
            endVerse: 1,
        });
    });

    test("start is empty, end is single number => ' - 18'", () => {
        // Should parse as => { chapter: undefined, verse: undefined, endVerse: 18 }
        expect(getChapterVerse(" - 18")).toStrictEqual({
            chapter: undefined,
            verse: undefined,
            endChapter: undefined,
            endVerse: 18,
        });
    });

    test("start is single verse only (e.g. ':2') with no dash", () => {
        // That means c=undefined, v=2
        expect(getChapterVerse(":2")).toStrictEqual({
            chapter: undefined,
            verse: 2,
            endChapter: undefined,
            endVerse: undefined,
        });
    });

    test("invalid format with extra non-digit characters, e.g. '3a:16b'", () => {
        // Should return all undefined
        expect(getChapterVerse("3a:16b")).toStrictEqual({
            chapter: undefined,
            verse: undefined,
            endChapter: undefined,
            endVerse: undefined,
        });
    });

    test("ambiguous references (multiple numeric groups) e.g. '3 16 10'", () => {
        // We have 3 numbers, which doesn't match the single-chapter+verse pattern
        // Should be all undefined
        expect(getChapterVerse("3 16 10")).toStrictEqual({
            chapter: undefined,
            verse: undefined,
            endChapter: undefined,
            endVerse: undefined,
        });
    });
});
