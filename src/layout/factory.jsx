import * as FlexLayout from "flexlayout-react";
import Placeholder from "../appComponents/placeholder";
import UserConfigs from "../appComponents/UserConfigs";
import Help from "../appComponents/Help";
import QuickLocate from "../appComponents/QuickLocate";
import Projector from "../appComponents/Projector";
import Preview from "../appComponents/Preview";
import TableOfContents from "../appComponents/TableOfContents";
import History from "../appComponents/History";
import Notes from "../appComponents/Notes";
import TextSearch from "../appComponents/TextSearch";

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
                <Preview />
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
