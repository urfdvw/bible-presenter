import AppContext from "../AppContext";
import { useContext, useEffect } from "react";
import { PreviewVerseBox } from "./VerseBox";
import { scroller, Element } from "react-scroll";
import { Typography } from "@mui/material";

export default function PreviewList() {
    const { getChapterVerses, previewVerse } = useContext(AppContext);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);

    useEffect(() => {
        if (!previewVerse.verse) {
            return;
        }
        const targetName = previewVerse.verse === 1 ? "title" : `preview-verse-${previewVerse.verse}`;
        scroller.scrollTo(targetName, {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
            containerId: "previewContainer",
        });
    }, [previewVerse]);
    return (
        <div id="previewContainer" style={{ height: "100%", overflowY: "auto" }}>
            <Element name={"title"}>
                <Typography variant="h6" component="div">
                    {`${verses[0][0].book_name} ${verses[0][0].chapter}`}
                </Typography>
            </Element>
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
