import { useCallback, useEffect, useRef, useState } from "react";
import * as FlexLayout from "flexlayout-react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/AddOutlined";
import VerseRef from "../models/VerseRef";
import { enNames, siNames, trNames } from "../bible";

const PREVIEW_COMPONENT = "preview";
const DEFAULT_PREVIEW_TAB_ID = "preview_tab_1";
const DEFAULT_PREVIEW_VERSE = new VerseRef({ book: 43, chapter: 3, verse: 16 });

const STRUCTURE_ACTIONS = new Set([
    FlexLayout.Actions.ADD_NODE,
    FlexLayout.Actions.DELETE_TAB,
    FlexLayout.Actions.MOVE_NODE,
]);

function isPreviewTabNode(node) {
    return (
        node &&
        node.getType() === "tab" &&
        typeof node.getComponent === "function" &&
        node.getComponent() === PREVIEW_COMPONENT
    );
}

function getPreviewTabsets(model) {
    const tabsets = [];
    model.visitNodes((node) => {
        if (node.getType() !== "tabset") {
            return;
        }
        const previewTabs = node.getChildren().filter((child) => isPreviewTabNode(child));
        if (previewTabs.length > 0) {
            tabsets.push({ tabset: node, previewTabs });
        }
    });
    return tabsets;
}

function getAllPreviewTabs(model) {
    return getPreviewTabsets(model).flatMap((entry) => entry.previewTabs);
}

function getBookNames(bibleDisplayConfig) {
    if (bibleDisplayConfig?.language === "English") {
        return enNames;
    }
    if (bibleDisplayConfig?.chinese === "繁體") {
        return trNames;
    }
    return siNames;
}

function isSameVerseRef(a, b) {
    if (!a || !b) {
        return false;
    }
    return (
        a.book === b.book &&
        a.chapter === b.chapter &&
        a.verse === b.verse &&
        a.endChapter === b.endChapter &&
        a.endVerse === b.endVerse &&
        a.note === b.note
    );
}

function findPreferredPreviewTabId(model, preferredTabId) {
    const selectedPreviewTab = getAllPreviewTabs(model).find((tabNode) => tabNode.isSelected());
    if (selectedPreviewTab) {
        return selectedPreviewTab.getId();
    }

    const preferredNode = preferredTabId ? model.getNodeById(preferredTabId) : undefined;
    if (isPreviewTabNode(preferredNode)) {
        return preferredTabId;
    }

    const firstPreviewTab = getAllPreviewTabs(model)[0];
    return firstPreviewTab ? firstPreviewTab.getId() : undefined;
}

export default function usePreviewTabs(flexModel, bibleDisplayConfig, isMobileReadingMode = false) {
    const [previewVersesByTabId, setPreviewVersesByTabId] = useState({
        [DEFAULT_PREVIEW_TAB_ID]: DEFAULT_PREVIEW_VERSE,
    });
    const [latestActivePreviewTabId, setLatestActivePreviewTabId] = useState(DEFAULT_PREVIEW_TAB_ID);
    const previewTabCounterRef = useRef(2);
    const internalActionDepthRef = useRef(0);
    const currentBookNames = getBookNames(bibleDisplayConfig);

    const doInternalAction = useCallback(
        (action) => {
            internalActionDepthRef.current += 1;
            try {
                flexModel.doAction(action);
            } finally {
                internalActionDepthRef.current -= 1;
            }
        },
        [flexModel]
    );

    const getLatestPreviewTabId = useCallback(() => {
        return findPreferredPreviewTabId(flexModel, latestActivePreviewTabId);
    }, [flexModel, latestActivePreviewTabId]);

    const setPreviewVerseForTab = useCallback((tabId, verseObj) => {
        if (!tabId) {
            return;
        }
        const normalized = VerseRef.from(verseObj);
        setPreviewVersesByTabId((map) => {
            const existing = map[tabId];
            if (existing && isSameVerseRef(existing, normalized)) {
                return map;
            }
            return { ...map, [tabId]: normalized };
        });
    }, []);

    const getPreviewVerseForTab = useCallback(
        (tabId) => {
            if (tabId && previewVersesByTabId[tabId]) {
                return previewVersesByTabId[tabId];
            }
            return DEFAULT_PREVIEW_VERSE;
        },
        [previewVersesByTabId]
    );

    const setPreviewVerse = useCallback(
        (verseObj) => {
            const tabId = getLatestPreviewTabId();
            if (!tabId) {
                return;
            }
            setPreviewVerseForTab(tabId, verseObj);
        },
        [getLatestPreviewTabId, setPreviewVerseForTab]
    );

    const syncPreviewStructureRules = useCallback(
        (model) => {
            const previewTabsets = getPreviewTabsets(model);
            const allPreviewTabs = previewTabsets.flatMap((entry) => entry.previewTabs);

            previewTabsets.forEach(({ previewTabs }) => {
                previewTabs.forEach((tabNode, index) => {
                    const shouldEnableClose = index > 0;
                    if (tabNode.isEnableClose() !== shouldEnableClose) {
                        doInternalAction(
                            FlexLayout.Actions.updateNodeAttributes(tabNode.getId(), { enableClose: shouldEnableClose })
                        );
                    }
                });
            });

            const previewTabIds = new Set(allPreviewTabs.map((tabNode) => tabNode.getId()));
            setPreviewVersesByTabId((map) => {
                const entries = Object.entries(map).filter(([tabId]) => previewTabIds.has(tabId));
                const filtered = Object.fromEntries(entries);
                const isUnchanged =
                    entries.length === Object.keys(map).length &&
                    entries.every(([tabId, verse]) => map[tabId] === verse);

                if (isUnchanged) {
                    return map;
                }

                if (Object.keys(filtered).length === 0) {
                    const fallbackTabId = allPreviewTabs[0]?.getId();
                    if (fallbackTabId) {
                        filtered[fallbackTabId] = VerseRef.from(DEFAULT_PREVIEW_VERSE);
                    }
                }
                return filtered;
            });

            setLatestActivePreviewTabId((prev) => {
                const next = findPreferredPreviewTabId(model, prev);
                return next || prev;
            });
        },
        [doInternalAction]
    );

    const syncPreviewTabNames = useCallback(
        (model) => {
            const allPreviewTabs = getAllPreviewTabs(model);
            const showRangeInName = isMobileReadingMode || allPreviewTabs.length > 1;

            allPreviewTabs.forEach((tabNode) => {
                const tabVerse = previewVersesByTabId[tabNode.getId()] || DEFAULT_PREVIEW_VERSE;
                const bookName = tabVerse?.book ? currentBookNames[tabVerse.book] : null;
                const chapter = tabVerse?.chapter;
                const defaultBookName = currentBookNames[DEFAULT_PREVIEW_VERSE.book];
                const expectedName =
                    showRangeInName
                        ? `${bookName || defaultBookName} ${chapter || DEFAULT_PREVIEW_VERSE.chapter}`
                        : "预览";
                if (tabNode.getName() !== expectedName) {
                    doInternalAction(FlexLayout.Actions.updateNodeAttributes(tabNode.getId(), { name: expectedName }));
                }
            });
        },
        [currentBookNames, doInternalAction, isMobileReadingMode, previewVersesByTabId]
    );

    const addPreviewTabToTabset = useCallback(
        (tabsetId) => {
            const sourceTabId = getLatestPreviewTabId();
            const sourceVerse = sourceTabId ? getPreviewVerseForTab(sourceTabId) : DEFAULT_PREVIEW_VERSE;
            const newPreviewTabId = `preview_tab_${previewTabCounterRef.current++}`;

            flexModel.doAction(
                FlexLayout.Actions.addNode(
                    {
                        type: "tab",
                        id: newPreviewTabId,
                        name: "预览",
                        component: PREVIEW_COMPONENT,
                        enableClose: true,
                    },
                    tabsetId,
                    FlexLayout.DockLocation.CENTER,
                    -1,
                    true
                )
            );

            setPreviewVersesByTabId((map) => ({ ...map, [newPreviewTabId]: VerseRef.from(sourceVerse) }));
            setLatestActivePreviewTabId(newPreviewTabId);
        },
        [flexModel, getLatestPreviewTabId, getPreviewVerseForTab]
    );

    const handleRenderTabSet = useCallback(
        (tabSetNode, renderValues) => {
            if (tabSetNode.getType() !== "tabset") {
                return;
            }
            const hasPreviewTab = tabSetNode.getChildren().some((child) => isPreviewTabNode(child));
            if (!hasPreviewTab) {
                return;
            }
            renderValues.stickyButtons.push(
                <IconButton
                    key={`preview-add-${tabSetNode.getId()}`}
                    title="新增预览"
                    aria-label="新增预览"
                    size="small"
                    onClick={(event) => {
                        event.stopPropagation();
                        addPreviewTabToTabset(tabSetNode.getId());
                    }}
                >
                    <AddIcon fontSize="inherit" />
                </IconButton>
            );
        },
        [addPreviewTabToTabset]
    );

    const handleLayoutModelChange = useCallback(
        (model, action) => {
            if (internalActionDepthRef.current > 0) {
                return;
            }

            if (action.type === FlexLayout.Actions.SELECT_TAB) {
                const selectedTabId = action.data.tabNode;
                const selectedNode = model.getNodeById(selectedTabId);
                if (isPreviewTabNode(selectedNode)) {
                    setLatestActivePreviewTabId(selectedTabId);
                }
                return;
            }

            if (STRUCTURE_ACTIONS.has(action.type)) {
                syncPreviewStructureRules(model);
            }
        },
        [syncPreviewStructureRules]
    );

    useEffect(() => {
        const previewTabIds = getAllPreviewTabs(flexModel).map((tabNode) => tabNode.getId());
        const maxIndex = previewTabIds.reduce((max, tabId) => {
            const match = /^preview_tab_(\d+)$/.exec(tabId);
            if (!match) {
                return max;
            }
            return Math.max(max, Number(match[1]));
        }, 1);
        previewTabCounterRef.current = maxIndex + 1;
        syncPreviewStructureRules(flexModel);
    }, [flexModel, syncPreviewStructureRules]);

    useEffect(() => {
        syncPreviewTabNames(flexModel);
    }, [flexModel, syncPreviewTabNames]);

    const previewVerse = getPreviewVerseForTab(getLatestPreviewTabId());

    return {
        previewVerse,
        setPreviewVerse,
        getPreviewVerseForTab,
        setPreviewVerseForTab,
        handleRenderTabSet,
        handleLayoutModelChange,
    };
}
