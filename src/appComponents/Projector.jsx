import PopUp from "../utilComponents/PopUp";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import VerseParagraph from "./VerseParagraph";
import { NoTheme } from "react-lazy-dark-theme";

import Reader from "./Reader";

export default function Projector() {
    const { appConfig, projectorWindowPopped, setProjectorWindowPopped, projectorDisplay, displayVerse } =
        useContext(AppContext);

    const [firstIndexes, setFirstIndexes] = useState([]);
    const data = [
        "sdf gsd fgerg  se rfvdg sg sfdgs dgsr eg sd fg s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg  se rfvdg sr eg sd fg s g re fg ddf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg fvdg sg sfdgs dgsr s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg  se rfvdg sg sfdgs eg sd fg s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgervdg sg sfdgs dgsr g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg  se rfvdg sg sfdgs dgsr eg sd fg s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg  se rfvdg sr eg sd fg s g re fg ddf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg fvdg sg sfdgs dgsr s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg  se rfvdg sg sfdgs eg sd fg s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg  se rfvdg sg sfdgs dgsr eg sd fg s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg  se rfvdg sr eg sd fg s g re fg ddf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg fvdg sg sfdgs dgsr s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg  se rfvdg sg sfdgs eg sd fg s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgervdg sg sfdgs dgsr g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
        "sdf gsd fgerg  se rfvdg sg  sd fg s g re fg dg  er gsdf g sdf g ser g df g sdfg serge g df",
    ];

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
            parentStyle={{ height: "100%" }}
        >
            {projectorDisplay ? (
                <Box style={{ height: "100%", zoom: appConfig.config.bible_display.zoom / 100, overflowY: "scroll" }}>
                    {/* <VerseParagraph
                        book={displayVerse.book}
                        chapter={displayVerse.chapter}
                        verse={displayVerse.verse}
                        endChapter={displayVerse.endChapter}
                        endVerse={displayVerse.endVerse}
                    /> */}
                    <Reader
                        data={data}
                        currentPosition={6}
                        setFirstIndexes={setFirstIndexes}
                        pageUp={() => {
                            console.log("reader page up");
                        }}
                        pageDown={() => {
                            console.log("reader page down");
                        }}
                    />
                </Box>
            ) : (
                <NoTheme>
                    <div style={{ backgroundColor: "black", height: "100000px" }}></div>
                </NoTheme>
            )}
        </PopUp>
    );
}
