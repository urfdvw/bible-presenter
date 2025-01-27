import PopUp from "../utilComponents/PopUp";
import Button from "@mui/material/Button";
import BibleDisplay from "../appComponents/BibleDisplay";
import { useContext } from "react";
import AppContext from "../AppContext";

export default function Projector() {
    const { projectorWindowPopped, setProjectorWindowPopped } = useContext(AppContext);
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
            <BibleDisplay />
        </PopUp>
    );
}
