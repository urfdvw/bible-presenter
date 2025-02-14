import AppContext from "../AppContext";
import { useContext } from "react";
import { PreviewVerseBox } from "./VerseBox";

export default function PreviewList() {
    const { getChapterVerses, previewVerse } = useContext(AppContext);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);
    return (
        <>
            {verses.map((verseVersions) => {
                return (
                    <PreviewVerseBox
                        book={verseVersions[0].book}
                        chapter={verseVersions[0].chapter}
                        verse={verseVersions[0].verse}
                        key={verseVersions[0].text}
                    />
                );
            })}
        </>
    );
}
