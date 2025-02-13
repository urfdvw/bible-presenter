import { useContext } from "react";
import AppContext from "../AppContext";
import NoteVerseBox from "./VerseBox";

export default function Placeholder({ node }) {
    const { testCount, setTestCount, notify, clearNotification, getChapterVerses } = useContext(AppContext);

    const verses = getChapterVerses(43, 3);

    return (
        <div className="tab_content">
            <p>{node.getName()}</p>
            <button onClick={() => setTestCount((count) => count + 1)}>count is {testCount}</button>

            <br />

            <button onClick={() => notify("This is a notification")}>Test Notification</button>
            <button onClick={() => clearNotification()}>Hide Notification</button>

            <br />

            <NoteVerseBox verses={verses}></NoteVerseBox>
        </div>
    );
}
