import { useContext, useEffect, useState, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppContext from "../AppContext";
import { scroller, Element } from "react-scroll";
import { ReaderVerseBox } from "./VerseBox";
import { compareLists } from "../utilFunctions/jsHelper";
import TabToolBar from "../utilComponents/TabToolBar";
import VerseRef from "../models/VerseRef";

export function ReaderTitle() {
    const { displayVerse, getMultipleVerses } = useContext(AppContext);
    const verseObj = getMultipleVerses(displayVerse);
    const title = `${verseObj[0][0].book_name} ${displayVerse.chapter}`;
    return <Typography>{title}</Typography>;
}

export function ReaderMenu() {
    const { setPageTurnTrigger, setVerseTurnTrigger, displayVerse, getMultipleVerses } = useContext(AppContext);
    const verseObj = getMultipleVerses(displayVerse);
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

export default function Reader({ popupWindow }) {
    const {
        getChapterVerses,
        pageTurnTrigger,
        verseTurnTrigger,
        displayVerse,
        setDisplayVerse,
        getNextVerse,
        getPreviousVerse,
    } = useContext(AppContext);

    const verses = getChapterVerses(displayVerse.book, displayVerse.chapter);

    const [firstIndexes, setFirstIndexes] = useState([]);
    const prevPageTurnTriggerRef = useRef(0);
    const prevVerseTurnTriggerRef = useRef(0);

    // useEffect(() => {
    //     console.log(firstIndexes);
    // }, [firstIndexes]);

    useEffect(() => {
        if (pageTurnTrigger === prevPageTurnTriggerRef.current) {
            return;
        }
        prevPageTurnTriggerRef.current = pageTurnTrigger;

        if (firstIndexes.length <= 1) {
            console.log("no page to turn");
            return;
        }
        if (pageTurnTrigger > 0) {
            console.log("page down");
            if (displayVerse.verse >= firstIndexes.at(-1)) {
                console.log("to next chapter");
                setDisplayVerse((verseObj) => {
                    const nextVerse = getNextVerse(VerseRef.from(verseObj).with({ verse: verses.at(-1)[0].verse }));
                    return VerseRef.from(nextVerse);
                });
                return;
            }
            const nextPage = firstIndexes.filter((i) => i > displayVerse.verse)[0];
            setDisplayVerse((verseObj) => {
                return VerseRef.from(verseObj).with({ verse: nextPage, endChapter: null, endVerse: null });
            });
        } else if (pageTurnTrigger < 0) {
            console.log("page Up");
            if (displayVerse.verse < firstIndexes[1]) {
                console.log("to previous chapter");
                setDisplayVerse((verseObj) => {
                    const previousVerse = getPreviousVerse(VerseRef.from(verseObj).with({ verse: 1 }));
                    return VerseRef.from(previousVerse);
                });
                return;
            }
            const lastPage = firstIndexes.filter((i) => i <= displayVerse.verse).at(-2);
            setDisplayVerse((verseObj) => {
                return VerseRef.from(verseObj).with({ verse: lastPage, endChapter: null, endVerse: null });
            });
        }
    }, [
        pageTurnTrigger,
        firstIndexes,
        displayVerse.verse,
        verses,
        setDisplayVerse,
        getNextVerse,
        getPreviousVerse,
    ]);

    useEffect(() => {
        if (verseTurnTrigger === prevVerseTurnTriggerRef.current) {
            return;
        }
        prevVerseTurnTriggerRef.current = verseTurnTrigger;

        if (verseTurnTrigger > 0) {
            console.log("next verse");
            setDisplayVerse((verseObj) => {
                const nextVerse = getNextVerse(verseObj);
                return VerseRef.from(nextVerse);
            });
        } else if (verseTurnTrigger < 0) {
            console.log("previous verse");
            setDisplayVerse((verseObj) => {
                const previousVerse = getPreviousVerse(verseObj);
                return VerseRef.from(previousVerse);
            });
        }
    }, [verseTurnTrigger, setDisplayVerse, getNextVerse, getPreviousVerse]);

    return (
        <ReaderList
            verses={verses}
            currentPosition={displayVerse.verse}
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
    const computeFirstIndexes = useCallback(() => {
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
    }, [setFirstIndexes]);

    // Run computeFirstIndexes on mount and whenever 'verses' changes.
    useEffect(() => {
        computeFirstIndexes();
    }, [verses, computeFirstIndexes]);

    useEffect(() => {
        const containerElement = containerRef.current;
        if (!containerElement) return;

        // Setup a ResizeObserver on the container to listen for size changes.
        const resizeObserver = new ResizeObserver(() => {
            computeFirstIndexes();
        });
        resizeObserver.observe(containerElement);

        // prevent manual scrolling which is confusing
        const disable = (event) => {
            event.preventDefault();
        };
        containerElement.addEventListener("wheel", disable);

        return () => {
            resizeObserver.disconnect();
            containerElement.removeEventListener("wheel", disable);
        };
    }, [computeFirstIndexes]);

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
                overflowX: "hidden",
            }}
            id="readerContainer"
        >
            {verses.map((verseVersionObjs, index) => (
                <Element key={index} name={`reader-verse-${index + 1}`} style={{ width: "100%" }}>
                    <ReaderVerseBox verseObjs={verseVersionObjs} selected={index + 1 === currentPosition} />
                </Element>
            ))}
        </Box>
    );
}
