import { abbreviations } from "../bible";
import { Grid, Box, Typography } from "@mui/material";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { sortAndUnique } from "../utilFunctions/jsHelper";

const FourFixedColumns = ({ books, onClick }) => {
    return (
        <Grid
            container
            columns={4} // We explicitly define 4 total columns
            sx={{ width: "100%" }}
        >
            {books.map((book, index) => (
                // Each item occupies 1 out of the 4 columns
                <Grid item xs={1} key={index}>
                    <Box
                        onClick={() => onClick(book.index)}
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
                            {book.cn}
                        </Typography>
                        {/* Second of pair: smaller text */}
                        <Typography variant="body2" component="div">
                            {book.en}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};
const FiveFixedColumns = ({ chapters, onClick }) => {
    return (
        <Grid
            container
            columns={5} // We explicitly define 5 total columns
            sx={{ width: "100%" }}
        >
            {chapters.map((chapter, index) => (
                // Each item occupies 1 out of the 5 columns
                <Grid item xs={1} key={index}>
                    <Box
                        onClick={() => {
                            onClick(chapter);
                        }}
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
                            {chapter}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default function TableOfContents() {
    const { appConfig, getSelectedVersions, setPreviewVerse, setDisplayVerse } = useContext(AppContext);
    const [book, setBook] = useState(1);

    const chinese = appConfig.config.bible_display.chinese === "简体" ? "si" : "tr";
    const bookNameAbbreviations = [];
    for (var i = 1; i <= 66; i++) {
        bookNameAbbreviations.push({
            cn: abbreviations[i][chinese],
            en: abbreviations[i]["en"],
            index: i,
        });
    }
    const versions = getSelectedVersions();
    const chapters = sortAndUnique(
        versions[0].verses.filter((verseObj) => verseObj.book === book).map((verseObj) => verseObj.chapter)
    );
    const bookName = versions[0].verses.filter((verseObj) => verseObj.book === book)[0].book_name;

    function setChapter(chapter) {
        setPreviewVerse({
            book: book,
            chapter: chapter,
            verse: 1,
        });
        if (appConfig.config.bible_display.menu_to_projector) {
            setDisplayVerse({
                book: book,
                chapter: chapter,
                verse: 1,
            });
        }
    }

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
                <FourFixedColumns books={bookNameAbbreviations.slice(0, 38)} onClick={setBook} />
                <br></br>
                <FourFixedColumns books={bookNameAbbreviations.slice(39)} onClick={setBook} />
            </Box>
            <Box
                sx={{
                    maxHeight: "50%",
                    overflow: "auto", // Allows scrolling if content exceeds 50% height
                    backgroundColor: "grey.100", // Demo styling
                    borderTop: "solid 1px",
                    p: 2,
                }}
            >
                <Typography variant="h6" component="div">
                    {bookName}
                </Typography>
                <FiveFixedColumns chapters={chapters} onClick={setChapter} />
            </Box>
        </Box>
    );
}
