import bible from "../bible";
import Typography from "@mui/material/Typography";

export default function BibleDisplay() {
    return (
        <Typography component="div">
            {bible.chinese_simplified.verses[0].text}
            {bible.chinese_traditional.verses[0].text}
            {bible.english.verses[0].text}
        </Typography>
    );
}
