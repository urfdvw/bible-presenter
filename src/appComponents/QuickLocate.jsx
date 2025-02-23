import TabToolBar from "../utilComponents/TabToolBar";
import { selectTabById } from "../layout/layoutUtils";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { Box } from "@mui/material";
import VerseParagraph from "./VerseParagraph";
import IMETextArea from "./IMETextArea";
import { siDict, trDict, enDict } from "../bible";

export default function QuickLocate() {
    const { helpTabSelection, flexModel, displayVerse, verseExists } = useContext(AppContext);
    const [stagedVerse, setStagedVerse] = useState({ verse: 99 });
    const [displayTarget, setDisplayTarget] = useState(displayVerse);
    const [previewTarget, setPreviewTarget] = useState({});

    useEffect(() => {
        if (!displayVerse) {
            return;
        }
        console.log(displayVerse, stagedVerse, { ...displayVerse, ...stagedVerse });
        setDisplayTarget({ ...displayVerse, ...stagedVerse });
    }, [stagedVerse, displayVerse]);

    const tools = [
        {
            text: "Help",
            handler: () => {
                selectTabById(flexModel, "help_tab");
                helpTabSelection.setTabName("quick_locate");
            },
        },
    ];

    const [text, setText] = useState("");

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ flexGrow: 0 }}>
                <TabToolBar title="快速投影" tools={tools} />
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                <Box>
                    <IMETextArea text={text} setText={setText} DICTIONARY={siDict} />
                    {verseExists(displayTarget.book, displayTarget.chapter, displayTarget.verse) ? (
                        <VerseParagraph verseObj={displayTarget} />
                    ) : (
                        "欲访问的经节不存在"
                    )}
                </Box>
            </Box>
        </Box>
    );
}
