import PopUp from "../utilComponents/PopUp";
import Button from "@mui/material/Button";
import { useContext } from "react";
import AppContext from "../AppContext";
import MarkdownExtended from "../utilComponents/MarkdownExtended";

export default function Projector() {
    const { appConfig, projectorWindowPopped, setProjectorWindowPopped, getVerseText } = useContext(AppContext);
    // const { rangeList, textList } = getVerseText(43, 3, 16);
    const { rangeList, textList } = getVerseText(43, 3, 16, 3, 18);
    // const { rangeList, textList } = getVerseText(43, 3, 16, 4, 3);

    const paragraphs = rangeList.map((range, versionIndex) => {
        // return `(${range}) ${textList[versionIndex]}`;
        return `${textList[versionIndex]}\n\n——${range}`;
    });

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
            <div style={{ zoom: appConfig.config.bible_display.zoom / 100 }}>
                <MarkdownExtended>{paragraphs.join("\n\n")}</MarkdownExtended>
            </div>
        </PopUp>
    );
}
