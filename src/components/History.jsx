import AppContext from "../AppContext";
import { useContext } from "react";
import { HistoryVerseBox } from "./VerseBox";

export default function History() {
    const { history } = useContext(AppContext);
    return history.map((verseObj, index) => (
        <HistoryVerseBox key={index} verseObj={verseObj} />
    ));
}
