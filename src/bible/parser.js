import siNames from "./si_names.json";
import trNames from "./tr_names.json";
import enNames from "./en_names.json";

const nameLists = [siNames, trNames, enNames];

export function getBook(string) {
    for (const names of nameLists) {
        for (const key in names) {
            if (string.includes(names[key])) {
                const book = parseInt(key);
                return {
                    book: book,
                    remnant: string.split(names[key]).join("").trim(),
                };
            }
        }
    }
    return {
        book: undefined,
        remnant: string.trim(),
    };
}
/**
 * Parses the "start" portion of a range (or a single reference).
 * Single number => chapter (and verse = 1).
 * ":nn" => verse only.
 */
function parseStartRef(input) {
    const trimmed = input.trim();
    if (!trimmed) {
        // Empty string => no chapter or verse
        return { c: undefined, v: undefined };
    }

    // Case: ":16" => verse only
    let m = trimmed.match(/^:(\d+)$/);
    if (m) {
        return { c: undefined, v: parseInt(m[1], 10) };
    }

    // Case: "3", "3 16", "3:16", "10 1", etc.
    // We allow either space or colon as separator for chapter & verse.
    m = trimmed.match(/^(\d+)(?:[\s:]+(\d+))?$/);
    if (m) {
        const chapterNum = m[1] ? parseInt(m[1], 10) : undefined;
        const verseNum = m[2] ? parseInt(m[2], 10) : undefined;

        if (chapterNum !== undefined && verseNum === undefined) {
            // E.g. "3" => chapter=3, verse=1
            return { c: chapterNum, v: 1 };
        } else {
            return { c: chapterNum, v: verseNum };
        }
    }

    // Otherwise => doesn't match
    return { c: undefined, v: undefined };
}

/**
 * Parses the "end" portion of a range.
 * Single number => verse (no chapter).
 * ":nn" => verse only as well.
 */
function parseEndRef(input) {
    const trimmed = input.trim();
    if (!trimmed) {
        return { c: undefined, v: undefined };
    }

    // Case: ":16" => verse only
    let m = trimmed.match(/^:(\d+)$/);
    if (m) {
        return { c: undefined, v: parseInt(m[1], 10) };
    }

    // Case: "18", "4:1", "4 1", etc.
    // Single number => verse only
    m = trimmed.match(/^(\d+)(?:[\s:]+(\d+))?$/);
    if (m) {
        const g1 = m[1] ? parseInt(m[1], 10) : undefined;
        const g2 = m[2] ? parseInt(m[2], 10) : undefined;

        if (g1 !== undefined && g2 === undefined) {
            // Single number in "end" => interpret as verse
            return { c: undefined, v: g1 };
        } else {
            // "4:1" => endChapter=4, endVerse=1
            return { c: g1, v: g2 };
        }
    }

    return { c: undefined, v: undefined };
}

/**
 * Main function to parse a Bible verse string of the form:
 * - "3:16"
 * - "3 16"
 * - ":16"
 * - "3"
 * - "3:16-18"
 * - "3:16-4:1"
 * - "-18"
 * - "-4:1"
 * etc.
 */
export function getChapterVerse(refString) {
    const input = (refString || "").trim();
    if (!input) {
        return {
            chapter: undefined,
            verse: undefined,
            endChapter: undefined,
            endVerse: undefined,
        };
    }

    // Split on a single dash
    const parts = input.split("-");
    if (parts.length > 2) {
        // More than one dash => treat as invalid
        return {
            chapter: undefined,
            verse: undefined,
            endChapter: undefined,
            endVerse: undefined,
        };
    }

    // Parse start part
    const startPart = parts[0] || ""; // If it starts with "-", that left side is empty
    const startRef = parseStartRef(startPart);

    // Parse end part (if any)
    let endRef = { c: undefined, v: undefined };
    if (parts.length === 2) {
        const endPart = parts[1] || "";
        endRef = parseEndRef(endPart);
    }

    return {
        chapter: startRef.c,
        verse: startRef.v,
        endChapter: endRef.c,
        endVerse: endRef.v,
    };
}
