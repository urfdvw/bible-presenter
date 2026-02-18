import { useContext } from "react";
import AppContext from "../AppContext";
import { NoteVerseBox, HistoryVerseBox, PreviewVerseBox } from "./VerseBox";
import VerseRef from "../models/VerseRef";

export default function Placeholder({ node }) {
    const { testCount, setTestCount, notify, clearNotification } = useContext(AppContext);

    return (
        <div className="tab_content">
            <p>{node.getName()}</p>
            <button onClick={() => setTestCount((count) => count + 1)}>count is {testCount}</button>

            <br />

            <button onClick={() => notify("This is a notification")}>Test Notification</button>
            <button onClick={() => clearNotification()}>Hide Notification</button>

            <br />

            <NoteVerseBox verseObj={new VerseRef({ book: 43, chapter: 3, verse: 16, endVerse: 18 })} boxIndex={0}></NoteVerseBox>
            <NoteVerseBox
                verseObj={new VerseRef({ book: 43, chapter: 3, verse: 16, endVerse: 18 })}
                boxIndex={1}
                highlighted={true}
            ></NoteVerseBox>
            <HistoryVerseBox verseObj={new VerseRef({ book: 43, chapter: 3, verse: 16, endVerse: 18 })}></HistoryVerseBox>
            <HistoryVerseBox
                verseObj={new VerseRef({ book: 43, chapter: 3, verse: 16, endVerse: 18 })}
                highlighted={true}
            ></HistoryVerseBox>
            <PreviewVerseBox verseObj={new VerseRef({ book: 43, chapter: 3, verse: 16 })}></PreviewVerseBox>
            <PreviewVerseBox verseObj={new VerseRef({ book: 43, chapter: 3, verse: 17 })} highlighted={true}></PreviewVerseBox>
        </div>
    );
}
