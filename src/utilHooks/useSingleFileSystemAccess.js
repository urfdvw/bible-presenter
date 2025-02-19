import { useState } from "react";
import { downloadFile } from "../utilFunctions/jsHelper";

/**
 * useSingleFileSystemAccess:
 *  1. Tries to use the File System Access API (if available).
 *  2. Otherwise, falls back to a hidden <input type="file" /> for open
 *     and "download" approach for save.
 */
export function useSingleFileSystemAccess() {
    const [content, setContent] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [fileHandle, setFileHandle] = useState(null);

    // "Close" simply clears out our references
    const closeFile = () => {
        setFileHandle(null);
        setContent(null);
        setFileName(null);
    };

    /**
     * openFile:
     * 1) Closes any currently open file (if present).
     * 2) Checks if window.showOpenFilePicker is available.
     *    - If yes, uses it to open a file (with read/write permission).
     *    - If no, falls back to an ephemeral <input type="file" /> approach.
     */
    const openFile = async (extensions) => {
        // If a file is already open, close it first
        if (fileHandle || content || fileName) {
            closeFile();
        }

        // Check for File System Access API
        if (!window.showOpenFilePicker) {
            // Fallback: ephemeral <input type="file" />
            try {
                await new Promise((resolve, reject) => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = extensions.join(",");

                    input.onchange = (e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                            console.warn("No file selected (fallback).");
                            reject(new Error("No file selected"));
                            return;
                        }
                        setFileName(file.name);

                        const reader = new FileReader();
                        reader.onload = (evt) => {
                            const result = evt.target.result;
                            setContent(typeof result === "string" ? result : null);
                            resolve(result);
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

        // Otherwise, we can use the File System Access API
        try {
            const [handle] = await window.showOpenFilePicker({
                multiple: false,
                types: [
                    {
                        description: "Text Files",
                        accept: {
                            "text/plain": extensions,
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
     * - If we have a valid fileHandle (File System Access), overwrite that file.
     * - Otherwise, we "download" a new file (fallback).
     */
    const saveToFile = async (newContent) => {
        // If we have an actual handle, overwrite the file using File System Access
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

        // Otherwise, fallback: download the new file
        downloadFile(newContent, fileName);

        // Update our content in state
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
