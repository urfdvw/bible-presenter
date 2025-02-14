import PopUp from "../utilComponents/PopUp";
import Button from "@mui/material/Button";
import { useContext } from "react";
import AppContext from "../AppContext";
import MarkdownExtended from "../utilComponents/MarkdownExtended";
import { versesToRangeText, versesToParagraphsMD } from "../bible/utils";

export default function Projector() {
    const { appConfig, projectorWindowPopped, setProjectorWindowPopped, getMultipleVerses } = useContext(AppContext);
    // const verses = getMultipleVerses(43, 3, 16)
    const verses = getMultipleVerses(43, 3, 16, 3, 18);
    // const verses = getMultipleVerses(43, 3, 16, 4, 3)
    const rangeList = versesToRangeText(verses);
    const textList = versesToParagraphsMD(verses);

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
            <div style={{ height: "100%", zoom: appConfig.config.bible_display.zoom / 100, overflowY: "scroll" }}>
                <MarkdownExtended>{paragraphs.join("\n\n")}</MarkdownExtended>
            </div>
        </PopUp>
    );
}
