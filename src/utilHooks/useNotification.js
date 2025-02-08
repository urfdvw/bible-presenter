import { useState } from "react";

export default function useNotification() {
    const [notificationHeight, setNotificationHeight] = useState(false);
    const [notificationText, setNotificationText] = useState("");

    function notify(text) {
        setNotificationText(text);
        setNotificationHeight("2em");
    }
    function clearNotification() {
        setNotificationHeight("0em");
    }
    return { notify, clearNotification, notificationText, notificationHeight };
}
