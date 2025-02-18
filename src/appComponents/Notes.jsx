import { NoteVerseBox } from "./VerseBox";
import AppContext from "../AppContext";
import { useContext } from "react";

export default function Notes() {
    const { noteList, setNoteList } = useContext(AppContext);
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
