import bible from "../bible";
import Typography from "@mui/material/Typography";

export default function BibleDisplay({
    book = 43,
    chapter = 3,
    verse = 16,
    context = true,
    chapter_end = null,
    verse_end = null,
}) {
    if (context) {
        return (
            <Typography component="div">
                {bible.chinese_simplified.verses
                    .filter((verse) => verse.book === book && verse.chapter === chapter)
                    .map((verse) => {
                        if (verse.verse === 1) {
                            return (
                                <>
                                    <h3>{verse.book_name + " " + verse.chapter}</h3>
                                    <p>{verse.verse + " " + verse.text}</p>
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <p>{verse.verse + " " + verse.text}</p>
                                </>
                            );
                        }
                    })}
                {/* {bible.chinese_traditional.verses[0].text}
                {bible.english.verses[0].text} */}
            </Typography>
        );
    }
}
