import { Box, Typography, IconButton } from "@mui/material";
// Import any icons you want to use from Material-UI icons
import { Preview, ArrowUpward, ArrowDownward, Close } from "@mui/icons-material";

import { versesToParagraphsMD, versesToRangeText } from "../bible/utils";

import MarkdownExtended from "../utilComponents/MarkdownExtended";

export default function NoteVerseBox({ verses }) {
    const range = versesToRangeText(verses);

    const handleBoxClick = () => {
        console.log("Box clicked");
    };

    const handleIconClick = (event, iconName) => {
        // Prevent the box click event from firing
        event.stopPropagation();
        console.log(`${iconName} icon clicked`);
    };

    return (
        <Box
            onClick={handleBoxClick}
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
                <IconButton onClick={(e) => handleIconClick(e, "Home")} size="small">
                    <Preview />
                </IconButton>
                <IconButton onClick={(e) => handleIconClick(e, "Settings")} size="small">
                    <ArrowUpward />
                </IconButton>
                <IconButton onClick={(e) => handleIconClick(e, "Settings")} size="small">
                    <ArrowDownward />
                </IconButton>
                <IconButton onClick={(e) => handleIconClick(e, "Settings")} size="small">
                    <Close />
                </IconButton>
            </Box>
        </Box>
    );
}
