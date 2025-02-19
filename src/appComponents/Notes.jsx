import { NoteVerseBox } from "./VerseBox";
import AppContext from "../AppContext";
import { useContext, useEffect, useState } from "react";
import TabToolBar from "../utilComponents/TabToolBar";
import { useSingleFileSystemAccess } from "../utilHooks/useSingleFileSystemAccess";
import { downloadFile } from "../utilFunctions/jsHelper";

function NoteListBody() {
    const { noteList } = useContext(AppContext);
    return noteList.map((verseObj, objIndex) => {
        return (
            <NoteVerseBox
                book={verseObj.book}
                chapter={verseObj.chapter}
                verse={verseObj.verse}
                endChapter={verseObj.endChapter}
                endVerse={verseObj.endVerse}
                boxIndex={objIndex}
                key={objIndex}
            />
        );
    });
}

export default function Notes() {
    const { noteList, setNoteList } = useContext(AppContext);
    const { content, fileName, openFile, saveToFile } = useSingleFileSystemAccess();
    useEffect(() => {
        console.log(content);
        if (content) {
            try {
                setNoteList(JSON.parse(content));
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
                saveToFile(JSON.stringify(noteList));
            },
        },
        {
            text: "下载",
            handler: () => {
                downloadFile(JSON.stringify(noteList), "BibleVerseNotes.json");
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
