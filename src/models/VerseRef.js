/**
 * @typedef {object} VerseRefLike
 * @property {number | undefined | null} book
 * @property {number | undefined | null} chapter
 * @property {number | undefined | null} verse
 * @property {number | undefined | null} [endChapter]
 * @property {number | undefined | null} [endVerse]
 * @property {string | null | undefined} [note]
 */

export class VerseRef {
    /**
     * @param {Partial<VerseRefLike>} [value]
     */
    constructor(value = {}) {
        this.book = value.book;
        this.chapter = value.chapter;
        this.verse = value.verse;
        this.endChapter = Object.prototype.hasOwnProperty.call(value, "endChapter") ? value.endChapter : null;
        this.endVerse = Object.prototype.hasOwnProperty.call(value, "endVerse") ? value.endVerse : null;
        this.note = Object.prototype.hasOwnProperty.call(value, "note") ? value.note : "";
    }

    /**
     * @param {VerseRefLike | Partial<VerseRefLike> | null | undefined} value
     * @returns {VerseRef}
     */
    static from(value) {
        if (value instanceof VerseRef) {
            return value;
        }
        return new VerseRef(value ?? {});
    }

    /**
     * @param {Partial<VerseRefLike>} patch
     * @returns {VerseRef}
     */
    with(patch) {
        return new VerseRef({ ...this, ...patch });
    }

    toJSON() {
        return {
            book: this.book,
            chapter: this.chapter,
            verse: this.verse,
            endChapter: this.endChapter,
            endVerse: this.endVerse,
            note: this.note,
        };
    }
}

export default VerseRef;
