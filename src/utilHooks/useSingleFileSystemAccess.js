import { useState } from "react";
import { isChrome, isChromium, isEdge } from "react-device-detect";
import { downloadFile } from "../utilFunctions/jsHelper";

export function useSingleFileSystemAccess() {
    const [content, setContent] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [fileHandle, setFileHandle] = useState(null);

    // We'll consider it "capable" if it's Chrome/Chromium/Edge + showOpenFilePicker is available
    const canUseFileSystemAPI = (isChrome || isChromium || isEdge) && !!window.showOpenFilePicker;

    // "Close" simply clears out our references
    const closeFile = () => {
        setFileHandle(null);
        setContent(null);
        setFileName(null);
    };

    /**
     * openFile:
     * 1) Closes any currently open file (if present).
     * 2) Checks if we can use the File System Access API.
     *    - If yes, uses it to open a file (with read/write permission).
     *    - If no, falls back to an ephemeral <input type="file" /> approach.
     */
    const openFile = async () => {
        // If a file is already open, close it first
        if (fileHandle || content || fileName) {
            closeFile();
        }

        // If browser doesn't support the File System Access API, fallback:
        if (!canUseFileSystemAPI) {
            // Fallback: use a programmatically created <input> for file selection
            try {
                await new Promise((resolve, reject) => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".json"; // or any other text-based extension

                    input.onchange = (e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                            console.warn("No file selected.");
                            reject(new Error("No file selected"));
                            return;
                        }

                        setFileName(file.name);

                        const reader = new FileReader();
                        reader.onload = (evt) => {
                            setContent(evt.target.result);
                            resolve(evt.target.result);
                        };
                        reader.onerror = (err) => {
                            console.error("Error reading file:", err);
                            reject(err);
                        };
                        reader.readAsText(file);
                    };

                    // Trigger the file selection dialog
                    input.click();
                });
            } catch (error) {
                console.error("Error selecting fallback file:", error);
            }
            return;
        }

        // Otherwise, we can try the File System Access API
        try {
            const [handle] = await window.showOpenFilePicker({
                multiple: false,
                types: [
                    {
                        description: "Text Files",
                        accept: {
                            "text/plain": [".json"],
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
            // User might cancel the picker, etc.
            console.error("Error opening file:", error);
        }
    };

    /**
     * saveToFile:
     * - If we have a real file handle, overwrite the file in place.
     * - If we don't have one (fallback mode), just download a new file.
     */
    const saveToFile = async (newContent) => {
        // If we have an actual handle, use the File System Access API to write:
        if (fileHandle) {
            try {
                const writable = await fileHandle.createWritable();
                await writable.write(newContent);
                await writable.close();
                setContent(newContent);
            } catch (error) {
                console.error("Error saving file:", error);
            }
            return;
        }

        // Fallback: download a new file instead of overwriting
        downloadFile(newContent, fileName);

        // Update content in state (though we haven't truly overwritten the original file)
        setContent(newContent);
    };

    return {
        content,
        fileName,
        openFile,
        saveToFile,
        closeFile,
    };
}
