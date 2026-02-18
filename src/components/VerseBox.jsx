import { Box, Typography, IconButton, Tooltip } from "@mui/material";
// Import any icons you want to use from Material-UI icons
import PreviewIcon from "@mui/icons-material/PreviewOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownwardOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import NoteAddIcon from "@mui/icons-material/NoteAddOutlined";
import ChecklistIcon from "@mui/icons-material/ChecklistOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";

import { versesToParagraphsMD, versesToRangeText } from "../bible/utils";

import MarkdownExtended from "../utilComponents/MarkdownExtended";

import AppContext from "../AppContext";
import { useContext, useEffect, useState } from "react";

import { compareLists, removeAllDuplicatesKeepLast } from "../utilFunctions/jsHelper";
import HighlightedSpan from "../utilComponents/HighlightedSpan";
import VerseParagraph from "./VerseParagraph";
import VerseRef from "../models/VerseRef";

/** @typedef {import("../models/VerseRef").VerseRefLike} VerseRefLike */

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

export function PreviewVerseBox({ verseObj, highlighted, selected, setSelected }) {
    const { getMultipleVerses, setDisplayVerse, setHistory, setNoteList } = useContext(AppContext);
    const baseVerse = VerseRef.from(verseObj);
    /** @type {[VerseRef | null, import("react").Dispatch<import("react").SetStateAction<VerseRef | null>>]} */
    const [multipleVerses, setMultipleVerses] = useState(null);
    useEffect(() => {
        let verseObjToProject = VerseRef.from(baseVerse);

        if (selected) {
            if (selected.book === baseVerse.book) {
                if (compareLists([selected.chapter, selected.verse], [baseVerse.chapter, baseVerse.verse]) > 0) {
                    verseObjToProject.endChapter = selected.chapter;
                    verseObjToProject.endVerse = selected.verse;
                } else {
                    verseObjToProject = new VerseRef({
                        book: baseVerse.book,
                        chapter: selected.chapter,
                        verse: selected.verse,
                        endChapter: baseVerse.chapter,
                        endVerse: baseVerse.verse,
                    });
                }
            }
        }
        setMultipleVerses(verseObjToProject);
    }, [baseVerse, selected]);

    const verses = getMultipleVerses(baseVerse);
    const mdText = versesToParagraphsMD(verses).join("\n\n");

    const handleShow = () => {
        if (!multipleVerses) {
            return;
        }
        setDisplayVerse(multipleVerses);
        setHistory((history) => removeAllDuplicatesKeepLast([...history, multipleVerses]));

        if (selected) {
            setSelected(null);
        }
    };

    const handleAddToNote = () => {
        if (!multipleVerses) {
            return;
        }
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
            setSelected(baseVerse);
        }
    };

    return (
        <Box onClick={handleShow} sx={highlighted ? highlightedVerseBoxStyle : verseBoxStyle}>
            <Typography sx={{ paddingRight: 1, flexShrink: 0 }}>{baseVerse.verse}</Typography>
            <div style={{ flexGrow: 1 }}>
                <MarkdownExtended>{mdText}</MarkdownExtended>
            </div>

            <Box sx={{ flexShrink: 0 }}>
                <Icon tooltip={"加入笔记"} onClick={handleAddToNote}>
                    <NoteAddIcon />
                </Icon>
                <Icon tooltip={"选中多节"} onClick={handleSelect}>
                    <ChecklistIcon />
                </Icon>
            </Box>
        </Box>
    );
}

export function HistoryVerseBox({ verseObj, highlighted }) {
    const { getMultipleVerses, setDisplayVerse, setPreviewVerse, setHistory, setNoteList } = useContext(AppContext);
    const normalizedVerse = VerseRef.from(verseObj);
    const verses = getMultipleVerses(normalizedVerse);
    const range = versesToRangeText(verses);

    const handleShow = () => {
        setDisplayVerse(normalizedVerse);
        // setHistory((history) => removeAllDuplicatesKeepLast([...history, verseObj]));
    };

    const handlePreview = () => {
        setPreviewVerse(normalizedVerse);
    };

    const handleAddToNote = () => {
        setNoteList((notes) => [...notes, normalizedVerse]);
    };

    const handleRemove = () => {
        console.log("verse moved up in notes"); // will be imported form context

        setHistory((history) =>
            history.filter(
                (item) =>
                        !(
                        item.book === normalizedVerse.book &&
                        item.chapter === normalizedVerse.chapter &&
                        item.verse === normalizedVerse.verse &&
                        item.endChapter === normalizedVerse.endChapter &&
                        item.endVerse === normalizedVerse.endVerse
                    )
            )
        );
    };

    return (
        <Box onClick={handleShow} sx={highlighted ? highlightedVerseBoxStyle : verseBoxStyle}>
            <Typography sx={{ flexGrow: 1 }}>{range[0]}</Typography>

            <Box sx={{ flexShrink: 0 }}>
                <Icon tooltip={"预览"} onClick={handlePreview}>
                    <PreviewIcon />
                </Icon>
                <Icon tooltip={"加入笔记"} onClick={handleAddToNote}>
                    <NoteAddIcon />
                </Icon>
                <Icon tooltip={"删除"} onClick={handleRemove}>
                    <CloseIcon />
                </Icon>
            </Box>
        </Box>
    );
}

/**
 * @param {{verseObj: VerseRefLike, boxIndex: number, highlighted?: boolean}} props
 */
export function NoteVerseBox({ verseObj, boxIndex, highlighted }) {
    const { getMultipleVerses, setDisplayVerse, noteList, setNoteList, setPreviewVerse } = useContext(AppContext);
    const verses = getMultipleVerses(verseObj);
    const range = versesToRangeText(verses);

    const handleShow = () => {
        setDisplayVerse(VerseRef.from(verseObj));
        // setHistory((history) => removeAllDuplicatesKeepLast([...history, verseObj]));
    };
    const handleEdit = () => {
        const note = prompt("编辑笔记内容", verseObj.note || "");
        verseObj.note = note;
        setNoteList((notes) => {
            const out = [];
            for (var i = 0; i < noteList.length; i++) {
                if (i === boxIndex) {
                    out.push(verseObj);
                } else {
                    out.push(notes[i]);
                }
            }
            return out;
        });
    };

    const handlePreview = () => {
        setPreviewVerse(VerseRef.from(verseObj));
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

    const note = verseObj.note || "";

    return (
        <Box onClick={handleShow} sx={highlighted ? highlightedVerseBoxStyle : verseBoxStyle}>
            <MarkdownExtended sx={{ flexGrow: 1 }}>{note + "\n\n" + range[0]}</MarkdownExtended>

            <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Icon tooltip={"编辑"} onClick={handleEdit}>
                        <EditIcon />
                    </Icon>
                    <Icon tooltip={"预览"} onClick={handlePreview}>
                        <PreviewIcon />
                    </Icon>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Icon tooltip={"上移"} onClick={handleMoveUp}>
                        <ArrowUpwardIcon />
                    </Icon>
                    <Icon tooltip={"下移"} onClick={handleMoveDown}>
                        <ArrowDownwardIcon />
                    </Icon>
                    <Icon tooltip={"删除"} onClick={handleRemove}>
                        <CloseIcon />
                    </Icon>
                </Box>
            </Box>
        </Box>
    );
}

export function SearchVerseBox({ verseObj, keyWords }) {
    const { setDisplayVerse, setPreviewVerse, setHistory, setNoteList } = useContext(AppContext);

    const handleShow = () => {
        const verseObjToDisplay = new VerseRef({
            book: verseObj.book,
            chapter: verseObj.chapter,
            verse: verseObj.verse,
        });
        setDisplayVerse(verseObjToDisplay);
        setHistory((history) => removeAllDuplicatesKeepLast([...history, verseObjToDisplay]));
    };

    const handlePreview = () => {
        setPreviewVerse(
            new VerseRef({
                book: verseObj.book,
                chapter: verseObj.chapter,
                verse: verseObj.verse,
            })
        );
    };

    const handleAddToNote = () => {
        setNoteList((notes) => [
            ...notes,
            new VerseRef({
                book: verseObj.book,
                chapter: verseObj.chapter,
                verse: verseObj.verse,
            }),
        ]);
    };

    return (
        <Box onClick={handleShow} sx={verseBoxStyle}>
            <Typography sx={{ flexGrow: 1 }}>
                <b>{`${verseObj.book_name}${verseObj.chapter}:${verseObj.verse} `}</b>
                <HighlightedSpan longString={verseObj.text} shortString={keyWords} />
            </Typography>

            <Box sx={{ flexShrink: 0 }}>
                <Icon tooltip={"预览"} onClick={handlePreview}>
                    <PreviewIcon />
                </Icon>
                <Icon tooltip={"加入笔记"} onClick={handleAddToNote}>
                    <NoteAddIcon />
                </Icon>
            </Box>
        </Box>
    );
}

export function ReaderVerseBox({ verseObjs, selected }) {
    const red = "#E00000";
    const blue = "#0000E0";
    const red_background = "#fcd3d3";
    const blue_background = "#d0d2ff";
    const { appConfig } = useContext(AppContext);
    const red_blue = appConfig.config.bible_display.chapter_theme === "红蓝";
    const isRed = verseObjs[0].verse % 2 === 1;
    var sx = red_blue ? { color: isRed ? red : blue } : {};
    return (
        <Typography component="div" sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Box
                sx={{
                    flexGrow: 0,
                    marginRight: "0.5em",
                    color: selected ? (red_blue ? (isRed ? red : blue) : red) : "black",
                    border: 0,
                    borderRadius: 100,
                    backgroundColor: selected
                        ? red_blue
                            ? isRed
                                ? red_background
                                : blue_background
                            : null
                        : null,
                }}
            >
                {verseObjs[0].verse}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {verseObjs.map((obj) => (
                    <Typography key={obj.text} sx={sx}>
                        {obj.text}
                    </Typography>
                ))}
            </Box>
        </Typography>
    );
}

export function LocateVerseBox({ verseObj }) {
    const { setDisplayVerse, setPreviewVerse, setHistory, setNoteList, verseExists } = useContext(AppContext);

    const handleShow = () => {
        const verseObjToDisplay = VerseRef.from(verseObj);
        setDisplayVerse(verseObjToDisplay);
        setHistory((history) => removeAllDuplicatesKeepLast([...history, verseObjToDisplay]));
    };

    const handlePreview = () => {
        setPreviewVerse(VerseRef.from(verseObj));
    };

    const handleAddToNote = () => {
        setNoteList((notes) => [...notes, VerseRef.from(verseObj)]);
    };

    return (
        <Box onClick={handleShow} sx={verseBoxStyle}>
            {verseExists(verseObj) ? (
                <>
                    <Box sx={{ flexGrow: 1 }}>
                        <VerseParagraph verseObj={{ ...verseObj, note: null }} />
                    </Box>
                    <Box sx={{ flexShrink: 0 }}>
                        <Icon tooltip={"预览 Shift + Enter"} onClick={handlePreview}>
                            <PreviewIcon />
                        </Icon>
                        <Icon tooltip={"加入笔记\nCtrl/Cmd + Enter"} onClick={handleAddToNote}>
                            <NoteAddIcon />
                        </Icon>
                    </Box>
                </>
            ) : (
                "输入的经节不存在"
            )}
        </Box>
    );
}
