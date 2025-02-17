import { useState, useEffect } from "react";
// App
import "./App.css";
import AppContext from "./AppContext";
// layout
import * as FlexLayout from "flexlayout-react";
import layout from "./layout/layout.json";
import Factory from "./layout/Factory";
import "flexlayout-react/style/light.css";
// menu bar
import AppMenu from "./appComponents/AppMenu";
// notification
import useNotification from "./utilHooks/useNotification";
import Typography from "@mui/material/Typography";
// config
import { useConfig } from "react-user-config";
import schemas from "./configs";
// help
import { useTabValueName } from "./utilComponents/TabedPages";
import docs from "./docs";
// hot keys
import useLayoutHotKeys from "./hotKeys/useLayoutHotKeys";
// theme
import DarkTheme from "react-lazy-dark-theme";
// channel
import useChannel from "./utilHooks/useChannel";
// device support
import { isMobile } from "react-device-detect";
import MobileSupportInfo from "./supportInfo/MobileSupportInfo";
// Bible data
import Bible from "./bible";
import useBibleData from "./bible/useBibleData";

function App() {
    // testing state
    const [testCount, setTestCount] = useState(0);
    // layout
    const [flexModel, setFlexModel] = useState(FlexLayout.Model.fromJson(layout));
    // notification
    const { notify, clearNotification, notificationText, notificationHeight } = useNotification();
    // config
    const appConfig = useConfig(schemas);
    useEffect(() => {
        console.log("config", appConfig);
    }, [appConfig]);
    // help
    const helpTabSelection = useTabValueName(docs);
    useEffect(() => {
        console.log("helpTabSelection", helpTabSelection);
    }, [helpTabSelection]);
    // hot keys
    useLayoutHotKeys(flexModel);
    // channel
    const { showDevFeatures, showBetaFeatures } = useChannel();
    useEffect(() => {
        console.log("[showDevFeatures, showBetaFeatures]", [showDevFeatures, showBetaFeatures]);
    }, [showDevFeatures, showBetaFeatures]);
    // projector control
    const [projectorWindowPopped, setProjectorWindowPopped] = useState(false);
    const [projectorDisplay, setProjectorDisplay] = useState(true);
    // Bible Data
    const { getMultipleVerses, getChapterVerses, getSelectedVersions } = useBibleData(
        Bible.cuvs,
        Bible.cuvt,
        Bible.asv,
        appConfig.config.bible_display
    );
    // Bible control
    const [displayVerse, setDisplayVerse] = useState({
        book: 43,
        chapter: 3,
        verse: 16,
        endChapter: null,
        endVerse: null,
    });
    const [previewVerse, setPreviewVerse] = useState({
        book: 43,
        chapter: 3,
        verse: 16,
        endChapter: null,
        endVerse: null,
    });

    if (isMobile) {
        return <MobileSupportInfo />;
    }

    if (!appConfig.ready) {
        return;
    }

    // theme config
    let dark = null;
    let highContrast = false;
    if (appConfig.config.general.theme === "白天") {
        dark = false;
    } else if (appConfig.config.general.theme === "夜间") {
        dark = true;
    } else if (appConfig.config.general.theme === "夜间投影") {
        dark = true;
        highContrast = true;
    }

    return (
        <AppContext.Provider
            value={{
                testCount,
                setTestCount,
                flexModel,
                notify,
                clearNotification,
                appConfig,
                helpTabSelection,
                projectorWindowPopped,
                setProjectorWindowPopped,
                projectorDisplay,
                setProjectorDisplay,
                getSelectedVersions,
                getMultipleVerses,
                getChapterVerses,
                displayVerse,
                setDisplayVerse,
                previewVerse,
                setPreviewVerse,
            }}
        >
            <DarkTheme dark={dark} highContrast={highContrast} />
            <div className="app">
                <div
                    className="app-header"
                    style={{
                        maxHeight: appConfig.config.general.show_menu_bar ? "30px" : "0px",
                        transition: "max-height 1s ease",
                    }}
                >
                    <AppMenu />
                </div>
                <div className="app-body">
                    <FlexLayout.Layout model={flexModel} factory={Factory} />
                </div>
                <Typography
                    component="div"
                    className="app-tail"
                    style={{ paddingLeft: "5pt", maxHeight: notificationHeight, transition: "max-height 1s ease" }}
                >
                    {notificationText}
                </Typography>
            </div>
        </AppContext.Provider>
    );
}

export default App;
