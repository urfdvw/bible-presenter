import AppContext from "../AppContext";
import { useContext } from "react";
import { HistoryVerseBox } from "./VerseBox";

export default function History() {
    const { history, setHistory } = useContext(AppContext);
    return history.map((verseObj, index) => (
        <HistoryVerseBox
            key={index}
            book={verseObj.book}
            chapter={verseObj.chapter}
            verse={verseObj.verse}
            endChapter={verseObj.endChapter}
            endVerse={verseObj.endVerse}
        />
    ));
}
