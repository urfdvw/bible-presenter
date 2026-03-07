import { NoteVerseBox } from "./VerseBox";
import AppContext from "../AppContext";
import { useContext, useEffect, useRef } from "react";
import TabToolBar from "../utilComponents/TabToolBar";
import Menu from "../utilComponents/Menu";
import { useSingleFileSystemAccess } from "../utilHooks/useSingleFileSystemAccess";
import { downloadFile } from "../utilFunctions/jsHelper";
import { selectTabById } from "../layout/layoutUtils";
import VerseRef from "../models/VerseRef";

function NoteListBody({ printMode }) {
    const { noteList } = useContext(AppContext);
    return noteList.map((verseObj, objIndex) => {
        return (
            <NoteVerseBox
                verseObj={verseObj}
                boxIndex={objIndex}
                key={objIndex}
                printMode={printMode}
            />
        );
    });
}

export default function Notes() {
    const { noteList, setNoteList, flexModel, helpTabSelection, appConfig, isMobileReadingMode } = useContext(AppContext);
    const { content, fileName, openFile, saveToFile } = useSingleFileSystemAccess();
    const notePrintAreaRef = useRef(null);
    useEffect(() => {
        if (content) {
            try {
                const parsed = JSON.parse(content);
                setNoteList(Array.isArray(parsed) ? parsed.map((item) => VerseRef.from(item)) : []);
            } catch (error) {
                console.error(error);
            }
        }
    }, [content, setNoteList]);
    const noteDisplay = appConfig.config.bible_display.note_display || "范围和笔记";
    const isPrintMode = noteDisplay === "打印";
    const handlePrint = () => {
        const element = notePrintAreaRef.current;
        if (!element) {
            return;
        }

        const printWindow = window.open("", "_blank", "width=900,height=1200");
        if (!printWindow || !printWindow.document) {
            return;
        }

        printWindow.document.open();
        printWindow.document.write("<!doctype html><html><head><meta charset='utf-8' /><title>笔记打印</title></head><body></body></html>");
        printWindow.document.close();

        const targetDoc = printWindow.document;
        Array.from(document.querySelectorAll("style, link[rel='stylesheet']")).forEach((node) => {
            targetDoc.head.appendChild(node.cloneNode(true));
        });

        const extraStyle = targetDoc.createElement("style");
        extraStyle.textContent = `
            @page { size: auto; margin: 12mm; }
            html, body { margin: 0; padding: 0; background: #fff; }
            body { font-family: sans-serif; }
            .print-toolbar {
                position: sticky;
                top: 0;
                z-index: 1;
                background: #fff;
                padding: 12px;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }
            .print-toolbar button {
                padding: 6px 12px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: #f8f8f8;
                cursor: pointer;
                font-size: 14px;
            }
            .print-content {
                padding: 12px;
                overflow: visible;
            }
            @media print {
                .print-toolbar { display: none !important; }
                .print-content { padding: 0; }
            }
        `;
        targetDoc.head.appendChild(extraStyle);

        const toolbar = targetDoc.createElement("div");
        toolbar.className = "print-toolbar";

        const printBtn = targetDoc.createElement("button");
        printBtn.textContent = "打印";
        printBtn.addEventListener("click", () => printWindow.print());

        const closeBtn = targetDoc.createElement("button");
        closeBtn.textContent = "关闭";
        closeBtn.addEventListener("click", () => printWindow.close());

        toolbar.appendChild(printBtn);
        toolbar.appendChild(closeBtn);
        targetDoc.body.appendChild(toolbar);

        const content = targetDoc.createElement("div");
        content.className = "print-content";
        content.appendChild(element.cloneNode(true));
        targetDoc.body.appendChild(content);

        if (!content.innerText || content.innerText.trim().length === 0) {
            const fallback = targetDoc.createElement("pre");
            fallback.style.whiteSpace = "pre-wrap";
            fallback.style.wordBreak = "break-word";
            fallback.style.margin = "0";
            fallback.style.fontSize = "16px";
            fallback.style.lineHeight = "1.6";
            fallback.textContent = element.innerText || "";
            content.appendChild(fallback);
        }

        const autoPrintScript = targetDoc.createElement("script");
        autoPrintScript.textContent = `
            (function () {
                function triggerPrint() {
                    setTimeout(function () { window.print(); }, 300);
                }
                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(triggerPrint).catch(triggerPrint);
                } else if (document.readyState === "complete") {
                    triggerPrint();
                } else {
                    window.addEventListener("load", triggerPrint, { once: true });
                }
            })();
        `;
        targetDoc.body.appendChild(autoPrintScript);

        printWindow.focus();
    };
    const tools = [
        {
            text: "打开",
            handler: () => {
                openFile([".json"]);
            },
        },
        {
            text: "保存",
            handler: () => {
                saveToFile(JSON.stringify(noteList, null, 2));
            },
        },
        {
            text: "下载",
            handler: () => {
                downloadFile(JSON.stringify(noteList, null, 2), "投影圣经笔记.json");
            },
        },
        {
            text: "帮助",
            handler: () => {
                selectTabById(flexModel, "help_tab");
                helpTabSelection.setTabName("notes");
            },
        },
        ...(isPrintMode
            ? [
                  {
                      text: "打印",
                      handler: handlePrint,
                  },
              ]
            : []),
    ];
    const noteDisplayOptions = [
        {
            text: "范围",
            handler: () => appConfig.setConfigField("bible_display", "note_display", "范围"),
        },
        {
            text: "范围和笔记",
            handler: () => appConfig.setConfigField("bible_display", "note_display", "范围和笔记"),
        },
        {
            text: "经文和笔记",
            handler: () => appConfig.setConfigField("bible_display", "note_display", "经文和笔记"),
        },
        {
            text: "打印",
            handler: () => appConfig.setConfigField("bible_display", "note_display", "打印"),
        },
    ];

    const mobileMenuOptions = [
        ...tools,
        ...noteDisplayOptions.map((option) => ({
            text: `显示模式：${option.text}`,
            handler: option.handler,
        })),
    ];
    return (
        <div
            className={isPrintMode ? "notes-tab notes-tab-print" : "notes-tab"}
            style={{ display: "flex", height: "100%", flexDirection: "column" }}
        >
            <div className="notes-toolbar" style={{ flexGrow: 0 }}>
                {isMobileReadingMode ? (
                    <TabToolBar title={fileName}>
                        <Menu label="选项" options={mobileMenuOptions} />
                    </TabToolBar>
                ) : (
                    <TabToolBar title={fileName} tools={tools}>
                        <Menu label="笔记显示模式" options={noteDisplayOptions} />
                    </TabToolBar>
                )}
            </div>
            <div className="notes-print-area" style={{ flexGrow: 1, overflowY: "auto" }} ref={notePrintAreaRef}>
                <NoteListBody printMode={isPrintMode} />
            </div>
        </div>
    );
}
