import * as FlexLayout from "flexlayout-react";
import Placeholder from "../components/Placeholder";
import UserConfigs from "../components/UserConfigs";
import Help from "../components/Help";
import QuickLocate from "../components/QuickLocate";
import Projector from "../components/Projector";
import Preview from "../components/Preview";
import TableOfContents from "../components/TableOfContents";
import History from "../components/History";
import Notes from "../components/Notes";
import TextSearch from "../components/TextSearch";

const fullSize = { height: "100%", width: "100%" };

const Factory = (node) => {
    var component = node.getComponent();
    if (component === "placeholder") {
        return (
            <div className="tab_content" style={fullSize}>
                <Placeholder node={node} />
            </div>
        );
    } else if (component === "config") {
        return (
            <div className="tab_content" style={fullSize}>
                <UserConfigs />
            </div>
        );
    } else if (component === "help") {
        return (
            <div className="tab_content" style={fullSize}>
                <Help />
            </div>
        );
    } else if (component === "quick_locate") {
        return (
            <div className="tab_content" style={fullSize}>
                <QuickLocate />
            </div>
        );
    } else if (component === "projector") {
        return (
            <div className="tab_content" style={fullSize}>
                <Projector />
            </div>
        );
    } else if (component === "preview") {
        return (
            <div className="tab_content" style={fullSize}>
                <Preview tabId={node.getId()} />
            </div>
        );
    } else if (component === "table_of_contents") {
        return (
            <div className="tab_content" style={fullSize}>
                <TableOfContents />
            </div>
        );
    } else if (component === "history") {
        return (
            <div className="tab_content" style={fullSize}>
                <History />
            </div>
        );
    } else if (component === "notes") {
        return (
            <div className="tab_content" style={fullSize}>
                <Notes />
            </div>
        );
    } else if (component === "search") {
        return (
            <div className="tab_content" style={fullSize}>
                <TextSearch />
            </div>
        );
    }
    return <FlexLayout.Layout model={model} factory={Factory} />;
};

export default Factory;
