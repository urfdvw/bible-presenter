import { useCallback, useEffect, useRef, useState } from "react";
import * as FlexLayout from "flexlayout-react";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/AddOutlined";
import VerseRef from "../models/VerseRef";
import { enNames, siNames, trNames } from "../bible";

const PREVIEW_COMPONENT = "preview";
const DEFAULT_PREVIEW_TAB_ID = "preview_tab_1";
const DEFAULT_PREVIEW_VERSE = new VerseRef({ book: 43, chapter: 3, verse: 16 });

const ACTIONS_NEED_SYNC = new Set([
    FlexLayout.Actions.ADD_NODE,
    FlexLayout.Actions.DELETE_TAB,
    FlexLayout.Actions.MOVE_NODE,
    FlexLayout.Actions.UPDATE_NODE_ATTRIBUTES,
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

export default function usePreviewTabs(flexModel, bibleDisplayConfig) {
    const [previewVersesByTabId, setPreviewVersesByTabId] = useState({
        [DEFAULT_PREVIEW_TAB_ID]: DEFAULT_PREVIEW_VERSE,
    });
    const [latestActivePreviewTabId, setLatestActivePreviewTabId] = useState(DEFAULT_PREVIEW_TAB_ID);
    const previewTabCounterRef = useRef(2);
    const currentBookNames = getBookNames(bibleDisplayConfig);

    const getLatestPreviewTabId = useCallback(() => {
        const latestNode = flexModel.getNodeById(latestActivePreviewTabId);
        if (isPreviewTabNode(latestNode)) {
            return latestActivePreviewTabId;
        }

        const selectedPreviewTab = getAllPreviewTabs(flexModel).find((tabNode) => tabNode.isSelected());
        if (selectedPreviewTab) {
            return selectedPreviewTab.getId();
        }

        const firstPreviewTab = getAllPreviewTabs(flexModel)[0];
        return firstPreviewTab ? firstPreviewTab.getId() : undefined;
    }, [flexModel, latestActivePreviewTabId]);

    const setPreviewVerseForTab = useCallback((tabId, verseObj) => {
        if (!tabId) {
            return;
        }
        const normalized = VerseRef.from(verseObj);
        setPreviewVersesByTabId((map) => ({ ...map, [tabId]: normalized }));
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

    const syncPreviewTabRules = useCallback(
        (model) => {
            const previewTabsets = getPreviewTabsets(model);
            const allPreviewTabs = previewTabsets.flatMap((entry) => entry.previewTabs);
            const showRangeInName = allPreviewTabs.length > 1;

            previewTabsets.forEach(({ previewTabs }) => {
                previewTabs.forEach((tabNode, index) => {
                    const shouldEnableClose = index > 0;
                    if (tabNode.isEnableClose() !== shouldEnableClose) {
                        model.doAction(
                            FlexLayout.Actions.updateNodeAttributes(tabNode.getId(), { enableClose: shouldEnableClose })
                        );
                    }

                    const tabVerse = previewVersesByTabId[tabNode.getId()];
                    const bookName = tabVerse?.book ? currentBookNames[tabVerse.book] : null;
                    const chapter = tabVerse?.chapter;
                    const expectedName =
                        showRangeInName && bookName && chapter ? `预览 ${bookName} ${chapter}` : "预览";
                    if (tabNode.getName() !== expectedName) {
                        model.doAction(FlexLayout.Actions.updateNodeAttributes(tabNode.getId(), { name: expectedName }));
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

            const latestTabId = getLatestPreviewTabId();
            if (latestTabId && latestTabId !== latestActivePreviewTabId) {
                setLatestActivePreviewTabId(latestTabId);
            }
        },
        [currentBookNames, getLatestPreviewTabId, latestActivePreviewTabId, previewVersesByTabId]
    );

    const addPreviewTabToTabset = useCallback(
        (tabsetId) => {
            const sourceTabId = getLatestPreviewTabId();
            const sourceVerse = sourceTabId ? getPreviewVerseForTab(sourceTabId) : VerseRef.from(DEFAULT_PREVIEW_VERSE);
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
                <Tooltip key={`preview-add-${tabSetNode.getId()}`} title="新增预览">
                    <IconButton
                        size="small"
                        onClick={(event) => {
                            event.stopPropagation();
                            addPreviewTabToTabset(tabSetNode.getId());
                        }}
                    >
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            );
        },
        [addPreviewTabToTabset]
    );

    const handleLayoutModelChange = useCallback(
        (model, action) => {
            if (action.type === FlexLayout.Actions.SELECT_TAB) {
                const selectedTabId = action.data.tabNode;
                const selectedNode = model.getNodeById(selectedTabId);
                if (isPreviewTabNode(selectedNode)) {
                    setLatestActivePreviewTabId(selectedTabId);
                }
                return;
            }

            if (ACTIONS_NEED_SYNC.has(action.type)) {
                syncPreviewTabRules(model);
            }
        },
        [syncPreviewTabRules]
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
        syncPreviewTabRules(flexModel);
    }, [flexModel, syncPreviewTabRules]);

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
