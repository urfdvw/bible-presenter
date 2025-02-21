import { useContext, useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import AppContext from "../AppContext";
import { scroller, Element } from "react-scroll";
import { ReaderVerseBox } from "./VerseBox";

// Utility function to compare two arrays for equality.
const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};
export default function Reader({ book, chapter, verse, popupWindow }) {
    const { appConfig, getChapterVerses, pageTurnTrigger, setDisplayVerse } = useContext(AppContext);
    const [firstIndexes, setFirstIndexes] = useState([]);

    useEffect(() => {
        console.log(firstIndexes);
    }, [firstIndexes]);

    useEffect(() => {
        if (firstIndexes.length <= 1) {
            console.log("no page to turn");
            return;
        }
        if (pageTurnTrigger > 0) {
            console.log("page down");
            if (verse >= firstIndexes.at(-1)) {
                console.log("already at last page");
                return;
            }
            const nextPage = firstIndexes.filter((i) => i > verse)[0];
            setDisplayVerse((verseObj) => {
                return { ...verseObj, verse: nextPage, endVerse: nextPage };
            });
        } else if (pageTurnTrigger < 0) {
            console.log("page Up");
            if (verse < firstIndexes[1]) {
                console.log("already at first page");
                return;
            }
            const lastPage = firstIndexes.filter((i) => i <= verse).at(-2);
            setDisplayVerse((verseObj) => {
                return { ...verseObj, verse: lastPage, endVerse: lastPage };
            });
        }
    }, [pageTurnTrigger]);

    const verses = getChapterVerses(book, chapter);

    return (
        <ReaderList
            verses={verses}
            currentPosition={verse}
            setFirstIndexes={setFirstIndexes}
            popupWindow={popupWindow}
        />
    );
}

function ReaderList({ verses, currentPosition, setFirstIndexes, popupWindow }) {
    const containerRef = useRef(null);
    // Store the previously computed indexes to avoid redundant state updates.
    const prevFirstIndexesRef = useRef([]);

    // Helper function to compute the first index in each column.
    const computeFirstIndexes = () => {
        if (containerRef.current) {
            const children = containerRef.current.children;
            const newIndexes = [];
            const seenOffsets = new Set();
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const offsetLeft = child.offsetLeft;
                // If this offsetLeft is not yet seen, it's the first in its column.
                if (!seenOffsets.has(offsetLeft)) {
                    seenOffsets.add(offsetLeft);
                    newIndexes.push(i + 1);
                }
            }
            // Only update external state if the computed indexes have changed.
            if (!arraysEqual(prevFirstIndexesRef.current, newIndexes)) {
                prevFirstIndexesRef.current = newIndexes;
                setFirstIndexes(newIndexes);
            }
        }
    };

    // Run computeFirstIndexes on mount and whenever 'verses' changes.
    useEffect(() => {
        computeFirstIndexes();
    }, [verses]);

    // Setup a ResizeObserver on the container to listen for size changes.
    useEffect(() => {
        const containerElement = containerRef.current;
        if (!containerElement) return;

        const resizeObserver = new ResizeObserver(() => {
            computeFirstIndexes();
        });
        resizeObserver.observe(containerElement);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // scroll
    useEffect(() => {
        if (!currentPosition || verses.length == 0) {
            return;
        }
        const targetName = `reader-verse-${currentPosition}`;
        if (popupWindow) {
            const container = popupWindow.document.getElementById("readerContainer");
            scroller.scrollTo(targetName, {
                duration: 800,
                delay: 0,
                smooth: "easeInOutQuart",
                container: container,
                horizontal: true, // enables horizontal scrolling
            });
        } else {
            scroller.scrollTo(targetName, {
                duration: 800,
                delay: 0,
                smooth: "easeInOutQuart",
                containerId: "readerContainer",
                horizontal: true, // enables horizontal scrolling
            });
        }
    }, [currentPosition, verses, popupWindow]);

    return (
        <Box
            ref={containerRef}
            sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                height: "100%",
                overflowX: "auto",
            }}
            id="readerContainer"
        >
            {verses.map((verseVersionObjs, index) => (
                <Element key={index} name={`reader-verse-${index + 1}`}>
                    <ReaderVerseBox verseObjs={verseVersionObjs} selected={index + 1 === currentPosition} />
                </Element>
            ))}
        </Box>
    );
}
