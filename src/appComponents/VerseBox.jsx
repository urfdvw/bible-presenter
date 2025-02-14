import { Box, Typography, IconButton, Tooltip } from "@mui/material";
// Import any icons you want to use from Material-UI icons
import { Preview, ArrowUpward, ArrowDownward, Close, NoteAdd, Checklist } from "@mui/icons-material";

import { versesToParagraphsMD, versesToRangeText } from "../bible/utils";

import MarkdownExtended from "../utilComponents/MarkdownExtended";

import AppContext from "../AppContext";
import { useContext } from "react";

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
    border: "1px solid #ccc",
    borderRadius: 2,
    padding: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
};

export function PreviewVerseBox({ book, chapter, verse }) {
    const { getMultipleVerses } = useContext(AppContext);
    function showVerse(book, chapter, verse, endChapter, endVerse) {
        console.log("showing", book, chapter, verse, endChapter, endVerse);
    } // will be imported form context

    function addToNote(book, chapter, verse, endChapter, endVerse) {
        console.log("adding to note", book, chapter, verse, endChapter, endVerse);
    } // will be imported form context

    const verses = getMultipleVerses(book, chapter, verse);
    const mdText = versesToParagraphsMD(verses).join("\n\n");

    const handleShow = () => {
        showVerse(book, chapter, verse, null, null); // need to implement select multiple
    };

    const handleAddToNote = () => {
        addToNote(book, chapter, verse, null, null); // need to implement select multiple
    };

    const handleSelect = () => {
        console.log("selecting multiple");
    };

    return (
        <Box onClick={handleShow} sx={verseBoxStyle}>
            <Typography sx={{ paddingRight: 1 }}>{verse}</Typography>
            <MarkdownExtended>{mdText}</MarkdownExtended>

            <Box>
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

export function HistoryVerseBox({ book, chapter, verse, endChapter, endVerse }) {
    const { getMultipleVerses } = useContext(AppContext);
    function showVerse(book, chapter, verse, endChapter, endVerse) {
        console.log("showing", book, chapter, verse, endChapter, endVerse);
    } // will be imported form context

    function addToNote(book, chapter, verse) {
        console.log("adding to note", book, chapter, verse);
    } // will be imported form context

    function previewVerse(book, chapter, verse, endChapter, endVerse) {
        console.log("previewing", book, chapter, verse, endChapter, endVerse);
    } // will be imported form context

    const verses = getMultipleVerses(book, chapter, verse, endChapter, endVerse);
    const range = versesToRangeText(verses);

    const handleShow = () => {
        showVerse(book, chapter, verse, endChapter, endVerse);
    };

    const handlePreview = () => {
        previewVerse(book, chapter, verse, endChapter, endVerse);
    };

    const handleAddToNote = () => {
        addToNote(book, chapter, verse);
    };

    const handleRemove = () => {
        console.log("verse moved up in notes"); // will be imported form context
    };

    return (
        <Box onClick={handleShow} sx={verseBoxStyle}>
            <Typography>{range[0]}</Typography>

            <Box>
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

export function NoteVerseBox({ book, chapter, verse, endChapter, endVerse }) {
    const { getMultipleVerses } = useContext(AppContext);
    function showVerse(book, chapter, verse, endChapter, endVerse) {
        console.log("showing", book, chapter, verse, endChapter, endVerse);
    } // will be imported form context

    function previewVerse(book, chapter, verse, endChapter, endVerse) {
        console.log("previewing", book, chapter, verse, endChapter, endVerse);
    } // will be imported form context

    const verses = getMultipleVerses(book, chapter, verse, endChapter, endVerse);
    const range = versesToRangeText(verses);

    const handleShow = () => {
        showVerse(book, chapter, verse, endChapter, endVerse);
    };

    const handlePreview = () => {
        previewVerse(book, chapter, verse, endChapter, endVerse);
    };

    const handleMoveUp = () => {
        console.log("verse moved up in notes"); // will be imported form context
    };

    const handleMoveDown = () => {
        console.log("verse moved up in notes"); // will be imported form context
    };

    const handleRemove = () => {
        console.log("verse moved up in notes"); // will be imported form context
    };

    return (
        <Box onClick={handleShow} sx={verseBoxStyle}>
            <Typography>{range[0]}</Typography>

            <Box>
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
