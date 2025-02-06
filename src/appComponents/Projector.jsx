import PopUp from "../utilComponents/PopUp";
import Button from "@mui/material/Button";
import { useContext } from "react";
import AppContext from "../AppContext";
import MarkdownExtended from "../utilComponents/MarkdownExtended";

export default function Projector() {
    const { projectorWindowPopped, setProjectorWindowPopped, getVerseText, displayVerse } = useContext(AppContext);
    const { range, text } = getVerseText(displayVerse.book, displayVerse.chapter, displayVerse.verse);
    console.log("here ++++++", range, text.join("\n\n"));
    return (
        <PopUp
            popped={projectorWindowPopped}
            setPopped={setProjectorWindowPopped}
            altChildren={
                <>
                    <p>This tab is opened in a popup window.</p>
                    <Button
                        onClick={() => {
                            setProjectorWindowPopped(false);
                        }}
                        style={{
                            textTransform: "none",
                        }}
                        variant="contained"
                    >
                        Dock the window
                    </Button>
                </>
            }
        >
            <MarkdownExtended>{`(${range}) ${text.join("\n\n")}`}</MarkdownExtended>
        </PopUp>
    );
}
