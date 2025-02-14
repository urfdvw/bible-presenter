import { Box, Typography, IconButton, Tooltip } from "@mui/material";
// Import any icons you want to use from Material-UI icons
import { Preview, ArrowUpward, ArrowDownward, Close } from "@mui/icons-material";

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

export default function NoteVerseBox({ book, chapter, verse, endChapter, endVerse }) {
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
        <Box
            onClick={handleShow}
            sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
            }}
        >
            <Typography>{range[0]}</Typography>

            <Box>
                <Icon tooltip={"Preview"} onClick={handlePreview}>
                    <Preview />
                </Icon>
                <Icon tooltip={"Move Up"} onClick={handleMoveUp}>
                    <ArrowUpward />
                </Icon>
                <Icon tooltip={"Move Down"} onClick={handleMoveDown}>
                    <ArrowDownward />
                </Icon>
                <Icon tooltip={"Remove"} onClick={handleRemove}>
                    <Close />
                </Icon>
            </Box>
        </Box>
    );
}
