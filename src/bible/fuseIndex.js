import Fuse from "fuse.js";

const versionFuseIndexCache = new WeakMap();

function toExactContainsQuery(value) {
    const escaped = String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    return `'${escaped}`;
}

function buildVersionFuseIndex(version) {
    const docs = version.verses.map((verse, index) => ({
        text: verse.text,
        _verse: verse,
        _index: index,
        _refKey: `${verse.book}:${verse.chapter}:${verse.verse}`,
        _chapterKey: `${verse.book}:${verse.chapter}`,
        _bookKey: `${verse.book}`,
    }));

    const refMap = new Map();
    const chapterMap = new Map();
    const bookMap = new Map();
    for (const doc of docs) {
        refMap.set(doc._refKey, doc);
        if (!chapterMap.has(doc._chapterKey)) {
            chapterMap.set(doc._chapterKey, []);
        }
        chapterMap.get(doc._chapterKey).push(doc._verse);
        if (!bookMap.has(doc._bookKey)) {
            bookMap.set(doc._bookKey, []);
        }
        bookMap.get(doc._bookKey).push(doc._verse);
    }

    const commonOptions = {
        useExtendedSearch: true,
        shouldSort: false,
        ignoreLocation: true,
    };

    return {
        docs,
        refMap,
        chapterMap,
        bookMap,
        byRef: new Fuse(docs, {
            ...commonOptions,
            keys: ["_refKey"],
            isCaseSensitive: true,
        }),
        byChapter: new Fuse(docs, {
            ...commonOptions,
            keys: ["_chapterKey"],
            isCaseSensitive: true,
        }),
        byBook: new Fuse(docs, {
            ...commonOptions,
            keys: ["_bookKey"],
            isCaseSensitive: true,
        }),
        byText: new Fuse(docs, {
            ...commonOptions,
            keys: ["text"],
            isCaseSensitive: false,
        }),
    };
}

export function ensureVersionFuseIndex(version) {
    const cached = versionFuseIndexCache.get(version);
    if (cached) {
        return cached;
    }
    const built = buildVersionFuseIndex(version);
    versionFuseIndexCache.set(version, built);
    return built;
}

export function preloadVersionFuseIndices(versions) {
    versions.forEach((version) => {
        ensureVersionFuseIndex(version);
    });
}

export function findVerseByRef(version, verseRef) {
    const index = ensureVersionFuseIndex(version);
    const key = `${verseRef.book}:${verseRef.chapter}:${verseRef.verse}`;
    const found = index.refMap.get(key);
    return found ? found._verse : null;
}

export function findVerseIndexByRef(version, verseRef) {
    const index = ensureVersionFuseIndex(version);
    const key = `${verseRef.book}:${verseRef.chapter}:${verseRef.verse}`;
    const found = index.refMap.get(key);
    return found ? found._index : null;
}

export function findVersesByChapter(version, book, chapter) {
    const index = ensureVersionFuseIndex(version);
    const chapterKey = `${book}:${chapter}`;
    return index.chapterMap.get(chapterKey) || [];
}

export function findVersesByBook(version, book) {
    const index = ensureVersionFuseIndex(version);
    const bookKey = `${book}`;
    return index.bookMap.get(bookKey) || [];
}

export function findVersesByText(version, text) {
    const index = ensureVersionFuseIndex(version);
    const query = toExactContainsQuery(text);
    return index.byText.search(query).map((result) => result.item._verse);
}
