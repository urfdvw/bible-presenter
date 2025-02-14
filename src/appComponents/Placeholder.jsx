import { useContext } from "react";
import AppContext from "../AppContext";
import { NoteVerseBox, HistoryVerseBox, PreviewVerseBox } from "./VerseBox";

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

            <NoteVerseBox book={43} chapter={3} verse={16} endVerse={18}></NoteVerseBox>
            <NoteVerseBox book={43} chapter={3} verse={16} endVerse={18} selected={true}></NoteVerseBox>
            <HistoryVerseBox book={43} chapter={3} verse={16} endVerse={18}></HistoryVerseBox>
            <HistoryVerseBox book={43} chapter={3} verse={16} endVerse={18} selected={true}></HistoryVerseBox>
            <PreviewVerseBox book={43} chapter={3} verse={16}></PreviewVerseBox>
            <PreviewVerseBox book={43} chapter={3} verse={16} selected={true}></PreviewVerseBox>
        </div>
    );
}
