import { Actions } from "flexlayout-react";

export function selectTabById(model, tabNodeId) {
    const tabNode = model.getNodeById(tabNodeId);
    if (!tabNode) return;

    const parent = tabNode.getParent();
    if (!parent) return;

    // Works for both TabSetNode (middle area) and BorderNode (edges)
    const selectedNode = parent.getSelectedNode();

    // Only issue the action if it's not already selected
    if (!selectedNode || selectedNode.getId() !== tabNodeId) {
        model.doAction(Actions.selectTab(tabNodeId));
    }
}

export function toggleSelectTabById(model, tabNodeId) {
    const tabNode = model.getNodeById(tabNodeId);
    if (!tabNode) return;
    model.doAction(Actions.selectTab(tabNodeId));
}

export function collapseLeftBorder(model) {
    const leftBorderTabIds = ["quick_locate_tab", "bible_toc_tab", "search_tab", "history_tab"];
    for (const tabId of leftBorderTabIds) {
        const tabNode = model.getNodeById(tabId);
        if (!tabNode) {
            continue;
        }
        const parent = tabNode.getParent();
        if (!parent || parent.getType() !== "border") {
            continue;
        }
        model.doAction(Actions.updateNodeAttributes(parent.getId(), { selected: -1 }));
        return;
    }
}
