import AppContext from "../AppContext";
import { useContext, useEffect, useState } from "react";
import { PreviewVerseBox } from "./VerseBox";
import { scroller, Element } from "react-scroll";
import { Typography } from "@mui/material";
import TabToolBar from "../utilComponents/TabToolBar";

function PreviewList() {
    const { getChapterVerses, previewVerse } = useContext(AppContext);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!previewVerse.verse) {
            return;
        }
        const targetName = `preview-verse-${previewVerse.verse}`;
        scroller.scrollTo(targetName, {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
            containerId: "previewContainer",
        });
    }, [previewVerse]);

    useEffect(() => {
        if (selected && selected.book !== verses[0][0].book) {
            setSelected(null);
        }
    }, [selected, verses]);

    return (
        <div id="previewContainer" style={{ height: "100%", overflowY: "auto" }}>
            {verses.map((verseVersions) => {
                return (
                    <Element key={verseVersions[0].verse} name={`preview-verse-${verseVersions[0].verse}`}>
                        <PreviewVerseBox
                            setSelected={setSelected}
                            selected={selected}
                            book={verseVersions[0].book}
                            chapter={verseVersions[0].chapter}
                            verse={verseVersions[0].verse}
                            highlighted={
                                selected &&
                                verseVersions[0].book === selected.book &&
                                verseVersions[0].chapter === selected.chapter &&
                                verseVersions[0].verse === selected.verse
                            }
                        />
                    </Element>
                );
            })}
        </div>
    );
}

export default function Preview() {
    const { getChapterVerses, previewVerse } = useContext(AppContext);
    const verses = getChapterVerses(previewVerse.book, previewVerse.chapter);
    return (
        <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
            <div style={{ flexGrow: 0 }}>
                <TabToolBar title={`${verses[0][0].book_name} ${verses[0][0].chapter}`} tools={[]} />
            </div>
            <PreviewList />
        </div>
    );
}
