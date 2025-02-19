import { useState } from "react";

export function useSingleFileSystemAccess() {
    const [content, setContent] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [fileHandle, setFileHandle] = useState(null);

    // Helper function to "close" the current file by clearing all related state
    const closeFile = () => {
        setFileHandle(null);
        setContent(null);
        setFileName(null);
    };

    const openFile = async () => {
        // If there's already an opened file, "close" it first
        if (fileHandle) {
            closeFile();
        }

        if (!window.showOpenFilePicker) {
            alert("File System Access API is not supported in this browser.");
            return;
        }

        try {
            // Prompt the user to select a file
            const [handle] = await window.showOpenFilePicker({
                multiple: false,
                types: [
                    {
                        description: "Text Files",
                        accept: {
                            "text/plain": [".txt", ".md", ".csv", ".json"],
                        },
                    },
                ],
            });

            // Request read/write permission
            const permission = await handle.requestPermission({ mode: "readwrite" });
            if (permission !== "granted") {
                console.warn("User did not grant read/write permission.");
                return;
            }

            // Read the file's current content
            const file = await handle.getFile();
            const text = await file.text();

            setFileHandle(handle);
            setContent(text);
            setFileName(file.name);
        } catch (error) {
            // This typically happens if the user cancels the dialog
            console.error("Error opening file:", error);
        }
    };

    const saveToFile = async (newContent) => {
        if (!fileHandle) {
            console.warn("No file is currently open. Cannot save.");
            return;
        }

        try {
            // Create a writable stream
            const writable = await fileHandle.createWritable();
            // Overwrite the file with the new content
            await writable.write(newContent);
            // Close the stream
            await writable.close();

            // Update local state
            setContent(newContent);
        } catch (error) {
            console.error("Error saving file:", error);
        }
    };

    return {
        content,
        fileName,
        openFile,
        saveToFile,
    };
}
