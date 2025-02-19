import { Box, Typography, IconButton, Tooltip } from "@mui/material";
// Import any icons you want to use from Material-UI icons
import { Preview, ArrowUpward, ArrowDownward, Close, NoteAdd, Checklist } from "@mui/icons-material";

import { versesToParagraphsMD, versesToRangeText } from "../bible/utils";

import MarkdownExtended from "../utilComponents/MarkdownExtended";

import AppContext from "../AppContext";
import { useContext, useEffect, useState } from "react";

import { compareLists, removeAllDuplicatesKeepLast } from "../utilFunctions/jsHelper";

function Icon({ tooltip, children, onClick }) {
    return (
        <Tooltip title={tooltip}>
            <IconButton
                onClick={(event) => {
                    // Prevent the box click event from firing
                    event.stopPropagation();
                    onClick(event);
                }}
                size="small"
            >
                {children}
            </IconButton>
        </Tooltip>
    );
}

const verseBoxStyle = {
    border: "2px solid #ccc",
    borderRadius: 2,
    padding: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
};

const highlightedVerseBoxStyle = { ...verseBoxStyle, border: "2px solid #700000", background: "#FFF0F0" };

export function PreviewVerseBox({ book, chapter, verse, highlighted, selected, setSelected }) {
    const { getMultipleVerses, setDisplayVerse, setHistory, setNoteList } = useContext(AppContext);
    const [multipleVerses, setMultipleVerses] = useState(null);
    useEffect(() => {
        var verseObj = {
            book: book,
            chapter: chapter,
            verse: verse,
            endChapter: null,
            endVerse: null,
        };

        if (selected) {
            if (selected.book === book) {
                if (compareLists([selected.chapter, selected.verse], [chapter, verse]) > 0) {
                    verseObj.endChapter = selected.chapter;
                    verseObj.endVerse = selected.verse;
                } else {
                    verseObj = {
                        book: book,
                        chapter: selected.chapter,
                        verse: selected.verse,
                        endChapter: chapter,
                        endVerse: verse,
                    };
                }
            }
        }
        setMultipleVerses(verseObj);
    }, [book, chapter, verse, selected]);

    const verses = getMultipleVerses(book, chapter, verse);
    const mdText = versesToParagraphsMD(verses).join("\n\n");

    const handleShow = () => {
        setDisplayVerse(multipleVerses);
        setHistory((history) => removeAllDuplicatesKeepLast([...history, multipleVerses]));

        if (selected) {
            setSelected(null);
        }
    };

    const handleAddToNote = () => {
        setNoteList((notes) => [...notes, multipleVerses]);
        if (selected) {
            setSelected(null);
        }
        console.log("adding to note");
    };

    const handleSelect = () => {
        console.log("selecting multiple");
        if (selected) {
            setSelected(null);
        } else {
            setSelected({
                book: book,
                chapter: chapter,
                verse: verse,
            });
        }
    };

    return (
        <Box onClick={handleShow} sx={highlighted ? highlightedVerseBoxStyle : verseBoxStyle}>
            <Typography sx={{ paddingRight: 1, flexShrink: 0 }}>{verse}</Typography>
            <div style={{ flexGrow: 1 }}>
                <MarkdownExtended>{mdText}</MarkdownExtended>
            </div>

            <Box sx={{ flexShrink: 0 }}>
                <Icon tooltip={"加入笔记"} onClick={handleAddToNote}>
                    <NoteAdd />
                </Icon>
                <Icon tooltip={"选中多节"} onClick={handleSelect}>
                    <Checklist />
                </Icon>
            </Box>
        </Box>
    );
}

export function HistoryVerseBox({ book, chapter, verse, endChapter, endVerse, highlighted }) {
    const { getMultipleVerses, setDisplayVerse, setPreviewVerse, setHistory, setNoteList } = useContext(AppContext);
    const verses = getMultipleVerses(book, chapter, verse, endChapter, endVerse);
    const range = versesToRangeText(verses);

    const handleShow = () => {
        const verseObj = {
            book: book,
            chapter: chapter,
            verse: verse,
            endChapter: endChapter,
            endVerse: endVerse,
        };
        setDisplayVerse(verseObj);
        // setHistory((history) => removeAllDuplicatesKeepLast([...history, verseObj]));
    };

    const handlePreview = () => {
        setPreviewVerse({
            book: book,
            chapter: chapter,
            verse: verse,
            endChapter: endChapter,
            endVerse: endVerse,
        });
    };

    const handleAddToNote = () => {
        setNoteList((notes) => [
            ...notes,
            {
                book: book,
                chapter: chapter,
                verse: verse,
                endChapter: endChapter,
                endVerse: endVerse,
            },
        ]);
    };

    const handleRemove = () => {
        console.log("verse moved up in notes"); // will be imported form context

        setHistory((history) =>
            history.filter(
                (item) =>
                    !(
                        item.book === book &&
                        item.chapter === chapter &&
                        item.verse === verse &&
                        item.endChapter === endChapter &&
                        item.endVerse === endVerse
                    )
            )
        );
    };

    return (
        <Box onClick={handleShow} sx={highlighted ? highlightedVerseBoxStyle : verseBoxStyle}>
            <Typography sx={{ flexGrow: 1 }}>{range[0]}</Typography>

            <Box sx={{ flexShrink: 0 }}>
                <Icon tooltip={"预览"} onClick={handlePreview}>
                    <Preview />
                </Icon>
                <Icon tooltip={"加入笔记"} onClick={handleAddToNote}>
                    <NoteAdd />
                </Icon>
                <Icon tooltip={"删除"} onClick={handleRemove}>
                    <Close />
                </Icon>
            </Box>
        </Box>
    );
}

export function NoteVerseBox({ book, chapter, verse, endChapter, endVerse, boxIndex, highlighted }) {
    const { getMultipleVerses, setDisplayVerse, noteList, setNoteList, setPreviewVerse } = useContext(AppContext);
    const verses = getMultipleVerses(book, chapter, verse, endChapter, endVerse);
    const range = versesToRangeText(verses);

    const handleShow = () => {
        const verseObj = {
            book: book,
            chapter: chapter,
            verse: verse,
            endChapter: endChapter,
            endVerse: endVerse,
        };
        setDisplayVerse(verseObj);
        // setHistory((history) => removeAllDuplicatesKeepLast([...history, verseObj]));
    };

    const handlePreview = () => {
        setPreviewVerse({
            book: book,
            chapter: chapter,
            verse: verse,
            endChapter: endChapter,
            endVerse: endVerse,
        });
    };

    const handleMoveUp = () => {
        if (boxIndex === 0) {
            return;
        }
        setNoteList((notes) => {
            const out = [];
            for (var i = 0; i < noteList.length; i++) {
                if (i === boxIndex) {
                    out.push(notes[boxIndex - 1]);
                } else if (i === boxIndex - 1) {
                    out.push(notes[boxIndex]);
                } else {
                    out.push(notes[i]);
                }
            }
            return out;
        });
        console.log("verse moved up in notes"); // will be imported form context
    };

    const handleMoveDown = () => {
        if (boxIndex === noteList.length - 1) {
            return;
        }
        setNoteList((notes) => {
            const out = [];
            for (var i = 0; i < noteList.length; i++) {
                if (i === boxIndex) {
                    out.push(notes[boxIndex + 1]);
                } else if (i === boxIndex + 1) {
                    out.push(notes[boxIndex]);
                } else {
                    out.push(notes[i]);
                }
            }
            return out;
        });
        console.log("verse moved up in notes"); // will be imported form context
    };

    const handleRemove = () => {
        setNoteList((notes) =>
            notes
                .map((note, index) => {
                    return { note: note, index: index };
                })
                .filter((note) => note.index !== boxIndex)
                .map((note) => note.note)
        );
        console.log("verse moved up in notes"); // will be imported form context
    };

    return (
        <Box onClick={handleShow} sx={highlighted ? highlightedVerseBoxStyle : verseBoxStyle}>
            <Typography sx={{ flexGrow: 1 }}>{range[0]}</Typography>

            <Box sx={{ flexShrink: 0 }}>
                <Icon tooltip={"预览"} onClick={handlePreview}>
                    <Preview />
                </Icon>
                <Icon tooltip={"上移"} onClick={handleMoveUp}>
                    <ArrowUpward />
                </Icon>
                <Icon tooltip={"下移"} onClick={handleMoveDown}>
                    <ArrowDownward />
                </Icon>
                <Icon tooltip={"删除"} onClick={handleRemove}>
                    <Close />
                </Icon>
            </Box>
        </Box>
    );
}
