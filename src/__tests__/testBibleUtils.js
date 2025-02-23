import {
    getSelectedVersions,
    verseExists,
    _getVerseInVersion,
    _getVerseIndexInVersion,
    getMultipleVerses,
    versesToRangeText,
    versesToParagraphsMD,
    _getChapterEndVerse,
    getChapterVerses,
} from "../bible/utils";

import Bible from "../bible";

describe("Test getSelectedVersions", () => {
    test("中文, 繁體", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "中文",
                chinese: "繁體",
            })
        ).toStrictEqual(["cuvt"]);
    });

    test("中文, 简体", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "中文",
                chinese: "简体",
            })
        ).toStrictEqual(["cuvs"]);
    });

    test("English, 繁體", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "English",
                chinese: "繁體",
            })
        ).toStrictEqual(["ASV"]);
    });

    test("English, 简体", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "English",
                chinese: "简体",
            })
        ).toStrictEqual(["ASV"]);
    });

    test("对照, 繁體", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "对照",
                chinese: "繁體",
            })
        ).toStrictEqual(["cuvt", "ASV"]);
    });

    test("对照, 简体", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "对照",
                chinese: "简体",
            })
        ).toStrictEqual(["cuvs", "ASV"]);
    });
});

describe("Test verseExists", () => {
    test("HE single version", () => {
        expect(
            verseExists(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                        ],
                    },
                ],
                43,
                3,
                16
            )
        ).toBe(true);
    });

    test("BE single version", () => {
        expect(
            verseExists(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                        ],
                    },
                ],
                43,
                3,
                18
            )
        ).toBe(false);
    });

    test("HE multiple version match all", () => {
        expect(
            verseExists(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                        ],
                    },
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                        ],
                    },
                ],
                43,
                3,
                16
            )
        ).toBe(true);
    });

    test("HE multiple version match one", () => {
        expect(
            verseExists(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                        ],
                    },
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                        ],
                    },
                ],
                43,
                3,
                15
            )
        ).toBe(true);
    });

    test("BE multiple version", () => {
        expect(
            verseExists(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                        ],
                    },
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                        ],
                    },
                ],
                43,
                3,
                14
            )
        ).toBe(false);
    });
});

describe("Test getVerseInVersion", () => {
    test("HE", () => {
        expect(
            _getVerseInVersion(
                {
                    verses: [
                        { book: 43, chapter: 3, verse: 16, text: "43, 3, 16" },
                        { book: 43, chapter: 3, verse: 17, text: "43, 3, 17" },
                    ],
                },
                43,
                3,
                16
            )
        ).toStrictEqual({ book: 43, chapter: 3, verse: 16, text: "43, 3, 16" });
    });

    test("BE", () => {
        expect(
            _getVerseInVersion(
                {
                    verses: [
                        { book: 43, chapter: 3, verse: 16, text: "43, 3, 16" },
                        { book: 43, chapter: 3, verse: 17, text: "43, 3, 17" },
                    ],
                },
                43,
                3,
                18
            )
        ).toStrictEqual(null);
    });
});

describe("Test getVerseInVersion", () => {
    test("HE", () => {
        expect(
            _getVerseIndexInVersion(
                {
                    verses: [
                        { book: 43, chapter: 3, verse: 15, text: "43, 3, 15" },
                        { book: 43, chapter: 3, verse: 16, text: "43, 3, 16" },
                        { book: 43, chapter: 3, verse: 17, text: "43, 3, 17" },
                    ],
                },
                43,
                3,
                16
            )
        ).toBe(1);
    });

    test("BE", () => {
        expect(
            _getVerseIndexInVersion(
                {
                    verses: [
                        { book: 43, chapter: 3, verse: 15, text: "43, 3, 15" },
                        { book: 43, chapter: 3, verse: 16, text: "43, 3, 16" },
                        { book: 43, chapter: 3, verse: 17, text: "43, 3, 17" },
                    ],
                },
                43,
                3,
                18
            )
        ).toBe(null);
    });
});

describe("Test getMultipleVerses", () => {
    test("HE single version", () => {
        expect(
            getMultipleVerses(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                            { book: 43, chapter: 3, verse: 18 },
                        ],
                    },
                ],
                43,
                3,
                16,
                3,
                17
            )
        ).toStrictEqual([[{ book: 43, chapter: 3, verse: 16 }], [{ book: 43, chapter: 3, verse: 17 }]]);
    });

    test("HE multi chapter", () => {
        expect(
            getMultipleVerses(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                            { book: 43, chapter: 3, verse: 18 },
                            { book: 43, chapter: 4, verse: 1 },
                            { book: 43, chapter: 4, verse: 2 },
                            { book: 43, chapter: 4, verse: 3 },
                        ],
                    },
                ],
                43,
                3,
                16,
                4,
                2
            )
        ).toStrictEqual([
            [{ book: 43, chapter: 3, verse: 16 }],
            [{ book: 43, chapter: 3, verse: 17 }],
            [{ book: 43, chapter: 3, verse: 18 }],
            [{ book: 43, chapter: 4, verse: 1 }],
            [{ book: 43, chapter: 4, verse: 2 }],
        ]);
    });

    test("HE multi version", () => {
        expect(
            getMultipleVerses(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15, text: "version1" },
                            { book: 43, chapter: 3, verse: 16, text: "version1" },
                            { book: 43, chapter: 3, verse: 17, text: "version1" },
                            { book: 43, chapter: 3, verse: 18, text: "version1" },
                        ],
                    },
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15, text: "version2" },
                            { book: 43, chapter: 3, verse: 16, text: "version2" },
                            { book: 43, chapter: 3, verse: 18, text: "version2" },
                        ],
                    },
                ],
                43,
                3,
                16,
                3,
                17
            )
        ).toStrictEqual([
            [
                { book: 43, chapter: 3, verse: 16, text: "version1" },
                { book: 43, chapter: 3, verse: 16, text: "version2" },
            ],
            [{ book: 43, chapter: 3, verse: 17, text: "version1" }, null],
        ]);
    });

    test("Auto complete, both", () => {
        expect(
            getMultipleVerses(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                            { book: 43, chapter: 3, verse: 18 },
                        ],
                    },
                ],
                43,
                3,
                16
            )
        ).toStrictEqual([[{ book: 43, chapter: 3, verse: 16 }]]);
    });

    test("Auto complete, chapter only", () => {
        expect(
            getMultipleVerses(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                            { book: 43, chapter: 3, verse: 18 },
                        ],
                    },
                ],
                43,
                3,
                16,
                null,
                17
            )
        ).toStrictEqual([[{ book: 43, chapter: 3, verse: 16 }], [{ book: 43, chapter: 3, verse: 17 }]]);
    });

    test("BE, starting verse does not exist", () => {
        expect(
            getMultipleVerses(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                            { book: 43, chapter: 3, verse: 18 },
                        ],
                    },
                ],
                43,
                2,
                16
            )
        ).toStrictEqual([]);
    });

    test("BE, ending verse does not exist", () => {
        expect(
            getMultipleVerses(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                            { book: 43, chapter: 3, verse: 18 },
                        ],
                    },
                ],
                43,
                3,
                16,
                4,
                99
            )
        ).toStrictEqual([]);
    });

    test("HE, starting verse after ending verse", () => {
        expect(
            getMultipleVerses(
                [
                    {
                        verses: [
                            { book: 43, chapter: 3, verse: 15 },
                            { book: 43, chapter: 3, verse: 16 },
                            { book: 43, chapter: 3, verse: 17 },
                            { book: 43, chapter: 3, verse: 18 },
                        ],
                    },
                ],
                43,
                3,
                18,
                3,
                16
            )
        ).toStrictEqual([
            [{ book: 43, chapter: 3, verse: 16 }],
            [{ book: 43, chapter: 3, verse: 17 }],
            [{ book: 43, chapter: 3, verse: 18 }],
        ]);
    });
});

describe("Test versesToRangeText", () => {
    test("single verse", () => {
        expect(versesToRangeText([[{ book_name: "book name", book: 43, chapter: 3, verse: 16 }]])).toStrictEqual([
            "book name 3:16",
        ]);
    });

    test("single version, same chapter", () => {
        expect(
            versesToRangeText([
                [{ book_name: "book name", book: 43, chapter: 3, verse: 16 }],
                [{ book_name: "book name", book: 43, chapter: 3, verse: 17 }],
            ])
        ).toStrictEqual(["book name 3:16-17"]);
    });

    test("single version, different chapter", () => {
        expect(
            versesToRangeText([
                [{ book_name: "book name", book: 43, chapter: 3, verse: 16 }],
                [{ book_name: "book name", book: 43, chapter: 3, verse: 17 }],
                [{ book_name: "book name", book: 43, chapter: 4, verse: 1 }],
                [{ book_name: "book name", book: 43, chapter: 4, verse: 2 }],
            ])
        ).toStrictEqual(["book name 3:16-4:2"]);
    });

    test("multi version, same chapter", () => {
        expect(
            versesToRangeText([
                [
                    { book_name: "book name1", book: 43, chapter: 3, verse: 16 },
                    { book_name: "book name2", book: 43, chapter: 3, verse: 16 },
                ],
                [
                    { book_name: "book name1", book: 43, chapter: 3, verse: 17 },
                    { book_name: "book name2", book: 43, chapter: 3, verse: 17 },
                ],
            ])
        ).toStrictEqual(["book name1 3:16-17", "book name2 3:16-17"]);
    });
});

describe("Test versesToParagraphsMD", () => {
    test("single verse", () => {
        expect(
            versesToParagraphsMD([[{ book_name: "book name", book: 43, chapter: 3, verse: 16, text: "text" }]])
        ).toStrictEqual(["text"]);
    });

    test("same chapter", () => {
        expect(
            versesToParagraphsMD([
                [{ book_name: "book name", book: 43, chapter: 3, verse: 16, text: "text" }],
                [{ book_name: "book name", book: 43, chapter: 3, verse: 17, text: "text" }],
            ])
        ).toStrictEqual(["^16^text ^17^text"]);
    });

    test("different chapter", () => {
        expect(
            versesToParagraphsMD([
                [{ book_name: "book name", book: 43, chapter: 3, verse: 16, text: "text" }],
                [{ book_name: "book name", book: 43, chapter: 3, verse: 17, text: "text" }],
                [{ book_name: "book name", book: 43, chapter: 4, verse: 1, text: "text" }],
                [{ book_name: "book name", book: 43, chapter: 4, verse: 2, text: "text" }],
            ])
        ).toStrictEqual(["^3:16^text ^17^text ^4:1^text ^2^text"]);
    });

    test("multiple versions", () => {
        expect(
            versesToParagraphsMD([
                [
                    { book_name: "book name", book: 43, chapter: 3, verse: 16, text: "text1" },
                    { book_name: "book name", book: 43, chapter: 3, verse: 16, text: "text2" },
                ],
                [
                    { book_name: "book name", book: 43, chapter: 3, verse: 17, text: "text1" },
                    { book_name: "book name", book: 43, chapter: 3, verse: 17, text: "text2" },
                ],
                [{ book_name: "book name", book: 43, chapter: 3, verse: 18, text: "text1" }, null],
                [
                    { book_name: "book name", book: 43, chapter: 3, verse: 19, text: "text1" },
                    { book_name: "book name", book: 43, chapter: 3, verse: 19, text: "text2" },
                ],
            ])
        ).toStrictEqual(["^16^text1 ^17^text1 ^18^text1 ^19^text1", "^16^text2 ^17^text2 ^19^text2"]);
    });
});

describe("Test getChapterEndVerse, getChapterVerses", () => {
    const version1 = {
        verses: [
            { book: 1, chapter: 1, verse: 1, text: "version1" },
            { book: 1, chapter: 1, verse: 2, text: "version1" },
            { book: 1, chapter: 1, verse: 3, text: "version1" },
            { book: 1, chapter: 1, verse: 4, text: "version1" },
            { book: 1, chapter: 1, verse: 5, text: "version1" },
            { book: 1, chapter: 1, verse: 6, text: "version1" },
            { book: 1, chapter: 2, verse: 1, text: "version1" },
            { book: 1, chapter: 2, verse: 2, text: "version1" },
            { book: 1, chapter: 2, verse: 3, text: "version1" },
            { book: 1, chapter: 2, verse: 4, text: "version1" },
            { book: 2, chapter: 1, verse: 1, text: "version1" },
            { book: 2, chapter: 1, verse: 2, text: "version1" },
            { book: 2, chapter: 1, verse: 3, text: "version1" },
            { book: 2, chapter: 1, verse: 4, text: "version1" },
            { book: 2, chapter: 1, verse: 5, text: "version1" },
            { book: 2, chapter: 1, verse: 6, text: "version1" },
            { book: 2, chapter: 2, verse: 1, text: "version1" },
            { book: 2, chapter: 2, verse: 2, text: "version1" },
            { book: 2, chapter: 2, verse: 3, text: "version1" },
            { book: 2, chapter: 2, verse: 4, text: "version1" },
        ],
    };
    const version2 = {
        verses: [
            { book: 1, chapter: 1, verse: 1, text: "version2" },
            { book: 1, chapter: 1, verse: 2, text: "version2" },
            { book: 1, chapter: 1, verse: 3, text: "version2" },
            { book: 1, chapter: 1, verse: 4, text: "version2" },
            { book: 1, chapter: 1, verse: 5, text: "version2" },
            { book: 1, chapter: 2, verse: 1, text: "version2" },
            { book: 1, chapter: 2, verse: 2, text: "version2" },
            { book: 1, chapter: 2, verse: 4, text: "version2" },
            { book: 2, chapter: 1, verse: 1, text: "version2" },
            { book: 2, chapter: 1, verse: 2, text: "version2" },
            { book: 2, chapter: 1, verse: 3, text: "version2" },
            { book: 2, chapter: 1, verse: 4, text: "version2" },
            { book: 2, chapter: 1, verse: 5, text: "version2" },
            { book: 2, chapter: 1, verse: 6, text: "version2" },
            { book: 2, chapter: 2, verse: 1, text: "version2" },
            { book: 2, chapter: 2, verse: 2, text: "version2" },
            { book: 2, chapter: 2, verse: 3, text: "version2" },
            { book: 2, chapter: 2, verse: 4, text: "version2" },
        ],
    };

    test("single version, find end", () => {
        expect(_getChapterEndVerse([version1], 1, 1)).toBe(6);
        expect(_getChapterEndVerse([version1], 1, 2)).toBe(4);
    });

    test("multiple version, find end", () => {
        expect(_getChapterEndVerse([version1, version2], 1, 1)).toBe(6);
        expect(_getChapterEndVerse([version1, version2], 1, 2)).toBe(4);
    });

    test("real version, find end", () => {
        expect(_getChapterEndVerse([Bible.cuvs, Bible.asv], 43, 3)).toBe(36);
    });

    test("single version, get chapter verses", () => {
        expect(getChapterVerses([version1], 1, 1)).toStrictEqual([
            [{ book: 1, chapter: 1, verse: 1, text: "version1" }],
            [{ book: 1, chapter: 1, verse: 2, text: "version1" }],
            [{ book: 1, chapter: 1, verse: 3, text: "version1" }],
            [{ book: 1, chapter: 1, verse: 4, text: "version1" }],
            [{ book: 1, chapter: 1, verse: 5, text: "version1" }],
            [{ book: 1, chapter: 1, verse: 6, text: "version1" }],
        ]);
        expect(getChapterVerses([version1], 1, 2)).toStrictEqual([
            [{ book: 1, chapter: 2, verse: 1, text: "version1" }],
            [{ book: 1, chapter: 2, verse: 2, text: "version1" }],
            [{ book: 1, chapter: 2, verse: 3, text: "version1" }],
            [{ book: 1, chapter: 2, verse: 4, text: "version1" }],
        ]);
    });

    test("multiple version, get chapter verses", () => {
        expect(getChapterVerses([version1, version2], 1, 1)).toStrictEqual([
            [
                { book: 1, chapter: 1, verse: 1, text: "version1" },
                { book: 1, chapter: 1, verse: 1, text: "version2" },
            ],
            [
                { book: 1, chapter: 1, verse: 2, text: "version1" },
                { book: 1, chapter: 1, verse: 2, text: "version2" },
            ],
            [
                { book: 1, chapter: 1, verse: 3, text: "version1" },
                { book: 1, chapter: 1, verse: 3, text: "version2" },
            ],
            [
                { book: 1, chapter: 1, verse: 4, text: "version1" },
                { book: 1, chapter: 1, verse: 4, text: "version2" },
            ],
            [
                { book: 1, chapter: 1, verse: 5, text: "version1" },
                { book: 1, chapter: 1, verse: 5, text: "version2" },
            ],
            [{ book: 1, chapter: 1, verse: 6, text: "version1" }, null],
        ]);
        expect(getChapterVerses([version1, version2], 1, 2)).toStrictEqual([
            [
                { book: 1, chapter: 2, verse: 1, text: "version1" },
                { book: 1, chapter: 2, verse: 1, text: "version2" },
            ],
            [
                { book: 1, chapter: 2, verse: 2, text: "version1" },
                { book: 1, chapter: 2, verse: 2, text: "version2" },
            ],
            [{ book: 1, chapter: 2, verse: 3, text: "version1" }, null],
            [
                { book: 1, chapter: 2, verse: 4, text: "version1" },
                { book: 1, chapter: 2, verse: 4, text: "version2" },
            ],
        ]);
    });
});
