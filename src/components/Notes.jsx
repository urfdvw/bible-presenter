import { NoteVerseBox } from "./VerseBox";
import AppContext from "../AppContext";
import { useContext, useEffect } from "react";
import TabToolBar from "../utilComponents/TabToolBar";
import { useSingleFileSystemAccess } from "../utilHooks/useSingleFileSystemAccess";
import { downloadFile } from "../utilFunctions/jsHelper";
import { selectTabById } from "../layout/layoutUtils";
import VerseRef from "../models/VerseRef";

function NoteListBody() {
    const { noteList } = useContext(AppContext);
    return noteList.map((verseObj, objIndex) => {
        return <NoteVerseBox verseObj={verseObj} boxIndex={objIndex} key={objIndex} />;
    });
}

export default function Notes() {
    const { noteList, setNoteList, flexModel, helpTabSelection } = useContext(AppContext);
    const { content, fileName, openFile, saveToFile } = useSingleFileSystemAccess();
    useEffect(() => {
        if (content) {
            try {
                const parsed = JSON.parse(content);
                setNoteList(Array.isArray(parsed) ? parsed.map((item) => VerseRef.from(item)) : []);
            } catch (error) {
                console.error(error);
            }
        }
    }, [content, setNoteList]);
    const tools = [
        {
            text: "打开",
            handler: () => {
                openFile([".json"]);
            },
        },
        {
            text: "保存",
            handler: () => {
                saveToFile(JSON.stringify(noteList, null, 2));
            },
        },
        {
            text: "下载",
            handler: () => {
                downloadFile(JSON.stringify(noteList, null, 2), "投影圣经笔记.json");
            },
        },
        {
            text: "帮助",
            handler: () => {
                selectTabById(flexModel, "help_tab");
                helpTabSelection.setTabName("notes");
            },
        },
    ];
    return (
        <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
            <div style={{ flexGrow: 0 }}>
                <TabToolBar title={fileName} tools={tools} />
            </div>
            <div style={{ flexGrow: 1, overflowY: "auto" }}>
                <NoteListBody />
            </div>
        </div>
    );
}
