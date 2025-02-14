import PopUp from "../utilComponents/PopUp";
import Button from "@mui/material/Button";
import { useContext } from "react";
import AppContext from "../AppContext";
import VerseParagraph from "./VerseParagraph";

export default function Projector() {
    const { appConfig, projectorWindowPopped, setProjectorWindowPopped } = useContext(AppContext);
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
                <VerseParagraph book={43} chapter={3} verse={16} endVerse={18} />
            </div>
        </PopUp>
    );
}
