import { abbreviations } from "../bible";
import { Grid, Box, Typography } from "@mui/material";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { sortAndUnique } from "../utilFunctions/jsHelper";

const FourFixedColumns = ({ stringPairs, setBook }) => {
    return (
        <Grid
            container
            columns={4} // We explicitly define 4 total columns
            sx={{ width: "100%" }}
        >
            {stringPairs.map((pair, index) => (
                // Each item occupies 1 out of the 4 columns
                <Grid item xs={1} key={index}>
                    <Box
                        onClick={() => setBook(pair[2])}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: 0,
                            textAlign: "center",
                            cursor: "pointer",
                            // Same width & height for each box (adjust as you like)
                            // height: 100,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        {/* First of pair: larger text */}
                        <Typography variant="h6" component="div">
                            {pair[0]}
                        </Typography>
                        {/* Second of pair: smaller text */}
                        <Typography variant="body2" component="div">
                            {pair[1]}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};
const FiveFixedColumns = ({ strings, onClick }) => {
    return (
        <Grid
            container
            columns={5} // We explicitly define 5 total columns
            sx={{ width: "100%" }}
        >
            {strings.map((string, index) => (
                // Each item occupies 1 out of the 5 columns
                <Grid item xs={1} key={index}>
                    <Box
                        onClick={onClick}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: 0,
                            textAlign: "center",
                            cursor: "pointer",
                            // Same width & height for each box (adjust as you like)
                            // height: 100,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="body2" component="div">
                            {string}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default function TableOfContents() {
    const { appConfig, getSelectedVersions } = useContext(AppContext);
    const [book, setBook] = useState(1);

    const chinese = appConfig.config.bible_display.chinese === "简体" ? "si" : "tr";
    const bookNameAbbreviations = [];
    for (var i = 1; i <= 66; i++) {
        bookNameAbbreviations.push([abbreviations[i][chinese], abbreviations[i]["en"], i]);
    }
    const versions = getSelectedVersions();
    const chapters = sortAndUnique(
        versions[0].verses.filter((verseObj) => verseObj.book === book).map((verseObj) => verseObj.chapter)
    );

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    overflow: "auto",
                    p: 2,
                }}
            >
                <FourFixedColumns stringPairs={bookNameAbbreviations.slice(0, 38)} setBook={setBook} />
                <br></br>
                <FourFixedColumns stringPairs={bookNameAbbreviations.slice(39)} setBook={setBook} />
            </Box>
            <Box
                sx={{
                    maxHeight: "50%",
                    overflow: "auto", // Allows scrolling if content exceeds 50% height
                    backgroundColor: "grey.300", // Demo styling
                    p: 2,
                }}
            >
                <FiveFixedColumns strings={chapters} />
            </Box>
        </Box>
    );
}
