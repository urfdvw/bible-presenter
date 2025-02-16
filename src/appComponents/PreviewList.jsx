import AppContext from "../AppContext";
import { useContext, useEffect } from "react";
import { PreviewVerseBox } from "./VerseBox";
import { scroller, Element } from "react-scroll";

export default function PreviewList() {
    const { getChapterVerses, previewVerse } = useContext(AppContext);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);

    useEffect(() => {
        const targetName = `preview-verse-${previewVerse.verse}`;
        scroller.scrollTo(targetName, {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
            containerId: "previewContainer",
        });
    }, [previewVerse]);
    return (
        <div id="previewContainer" style={{ height: "100%", overflowY: "auto" }}>
            {verses.map((verseVersions) => {
                return (
                    <Element key={verseVersions[0].verse} name={`preview-verse-${verseVersions[0].verse}`}>
                        <PreviewVerseBox
                            book={verseVersions[0].book}
                            chapter={verseVersions[0].chapter}
                            verse={verseVersions[0].verse}
                        />
                    </Element>
                );
            })}
        </div>
    );
}
