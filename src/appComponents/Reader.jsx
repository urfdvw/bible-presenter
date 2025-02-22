import { useContext, useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import AppContext from "../AppContext";
import { scroller, Element } from "react-scroll";
import { ReaderVerseBox } from "./VerseBox";
import { compareLists } from "../utilFunctions/jsHelper";
import TabToolBar from "../utilComponents/TabToolBar";

export function ReaderTitle() {
    const { displayVerse, getMultipleVerses } = useContext(AppContext);
    const verseObj = getMultipleVerses(displayVerse.book, displayVerse.chapter, displayVerse.verse);
    const title = `${verseObj[0][0].book_name} ${displayVerse.chapter}`;
    return <Typography>{title}</Typography>;
}

export function ReaderMenu() {
    const { setPageTurnTrigger, setVerseTurnTrigger, displayVerse, getMultipleVerses } = useContext(AppContext);
    const verseObj = getMultipleVerses(displayVerse.book, displayVerse.chapter, displayVerse.verse);
    const title = `${verseObj[0][0].book_name} ${displayVerse.chapter}`;
    const tools = [
        {
            text: "上一页",
            handler: () => {
                setPageTurnTrigger((x) => -(Math.abs(x) + 1));
            },
        },
        {
            text: "上一节",
            handler: () => {
                setVerseTurnTrigger((x) => -(Math.abs(x) + 1));
            },
        },
        {
            text: "下一节",
            handler: () => {
                setVerseTurnTrigger((x) => Math.abs(x) + 1);
            },
        },
        {
            text: "下一页",
            handler: () => {
                setPageTurnTrigger((x) => Math.abs(x) + 1);
            },
        },
    ];
    return <TabToolBar title={title} tools={tools} />;
}

export default function Reader({ book, chapter, verse, popupWindow }) {
    const { getChapterVerses, pageTurnTrigger, verseTurnTrigger, setDisplayVerse, getNextVerse, getPreviousVerse } =
        useContext(AppContext);

    const verses = getChapterVerses(book, chapter);

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
                console.log("to next chapter");
                setDisplayVerse((verseObj) => {
                    const nextVerse = getNextVerse(verseObj.book, verseObj.chapter, verses.at(-1)[0].verse);
                    return nextVerse;
                });
                return;
            }
            const nextPage = firstIndexes.filter((i) => i > verse)[0];
            setDisplayVerse((verseObj) => {
                return { ...verseObj, verse: nextPage, endChapter: null, endVerse: null };
            });
        } else if (pageTurnTrigger < 0) {
            console.log("page Up");
            if (verse < firstIndexes[1]) {
                console.log("to previous chapter");
                setDisplayVerse((verseObj) => {
                    const previousVerse = getPreviousVerse(verseObj.book, verseObj.chapter, 1);
                    return previousVerse;
                });
                return;
            }
            const lastPage = firstIndexes.filter((i) => i <= verse).at(-2);
            setDisplayVerse((verseObj) => {
                return { ...verseObj, verse: lastPage, endChapter: null, endVerse: null };
            });
        }
    }, [pageTurnTrigger]);

    useEffect(() => {
        if (verseTurnTrigger > 0) {
            console.log("next verse");
            setDisplayVerse((verseObj) => {
                const nextVerse = getNextVerse(verseObj.book, verseObj.chapter, verseObj.verse);
                return nextVerse;
            });
        } else if (verseTurnTrigger < 0) {
            console.log("previous verse");
            setDisplayVerse((verseObj) => {
                const previousVerse = getPreviousVerse(verseObj.book, verseObj.chapter, verseObj.verse);
                return previousVerse;
            });
        }
    }, [verseTurnTrigger]);

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
            if (compareLists(prevFirstIndexesRef.current, newIndexes) !== 0) {
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
