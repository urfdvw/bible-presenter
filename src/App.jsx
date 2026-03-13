import { useCallback, useState } from "react";
// App
import "./App.css";
import AppContext from "./AppContext";
// layout
import * as FlexLayout from "flexlayout-react";
import Factory from "./layout/Factory";
import "flexlayout-react/style/light.css";
import { isMobile } from "react-device-detect";
// menu bar
import AppMenu from "./components/AppMenu";
// notification
import useNotification from "./utilHooks/useNotification";
import Typography from "@mui/material/Typography";
// config
import useConfig from "./utilComponents/react-user-config/useConfig";
import schemas from "./configs";
// help
import { useTabValueName } from "./utilHooks/useTabValueName";
import docs from "./docs";
// hot keys
import useLayoutHotKeys from "./hotKeys/useLayoutHotKeys";
import useDisplayHotKeys from "./hotKeys/useDisplayHotKeys";
// theme
import DarkTheme from "react-lazy-dark-theme";
// Bible data
import bible from "./bible";
import useBibleData from "./bible/useBibleData";
import VerseRef from "./models/VerseRef";
import usePreviewTabs from "./utilHooks/usePreviewTabs";
import TipsModal from "./components/TipsModal";
import { tips } from "./tips";
import { collapseLeftBorder } from "./layout/layoutUtils";
import useAppViewportHeight from "./utilHooks/useAppViewportHeight";
import useMobileSidebarWidthSync from "./utilHooks/useMobileSidebarWidthSync";
import { createLayoutJsonForMode } from "./utilFunctions/mobileLayout";

/** @typedef {import("./models/VerseRef").VerseRefLike} VerseRefLike */

function App() {
    useAppViewportHeight();

    // testing state
    const [testCount, setTestCount] = useState(0);
    const isMobileReadingMode = isMobile;
    // layout
    const [flexModel] = useState(() => FlexLayout.Model.fromJson(createLayoutJsonForMode(isMobileReadingMode)));
    useMobileSidebarWidthSync(flexModel, isMobileReadingMode);
    const collapseLeftSidebar = useCallback(() => collapseLeftBorder(flexModel), [flexModel]);
    // notification
    const { notify, clearNotification, notificationText, notificationHeight } = useNotification();
    // config
    const appConfig = useConfig(schemas);
    // help
    const helpTabSelection = useTabValueName(docs);
    const configTabSelection = useTabValueName(schemas);

    // projector control
    const [projectorWindowPopped, setProjectorWindowPopped] = useState(false);
    const [projectorDisplay, setProjectorDisplay] = useState(true);
    const [pageTurnTrigger, setPageTurnTrigger] = useState(0);
    const [verseTurnTrigger, setVerseTurnTrigger] = useState(0);
    const [showHints, setShowHints] = useState(false);
    // hot keys
    useLayoutHotKeys(flexModel, setShowHints);
    useDisplayHotKeys(
        appConfig,
        setPageTurnTrigger,
        setVerseTurnTrigger,
        setProjectorWindowPopped,
        setProjectorDisplay
    );
    // Bible Data
    const {
        getMultipleVerses,
        getChapterVerses,
        getSelectedVersions,
        getNextVerse,
        getPreviousVerse,
        verseExists,
        getBookMeta,
    } =
        useBibleData(bible, appConfig.config.bible_display);
    // Bible control
    /** @type {[VerseRef, import("react").Dispatch<import("react").SetStateAction<VerseRef>>]} */
    const [displayVerse, setDisplayVerse] = useState(new VerseRef({ book: 43, chapter: 3, verse: 16 }));
    // history
    /** @type {[VerseRefLike[], import("react").Dispatch<import("react").SetStateAction<VerseRefLike[]>>]} */
    const [history, setHistory] = useState([]);
    // notes
    /** @type {[VerseRefLike[], import("react").Dispatch<import("react").SetStateAction<VerseRefLike[]>>]} */
    const [noteList, setNoteList] = useState([]);

    const {
        previewVerse,
        setPreviewVerse,
        getPreviewVerseForTab,
        setPreviewVerseForTab,
        handleRenderTabSet,
        handleLayoutModelChange,
    } = usePreviewTabs(flexModel, appConfig.config.bible_display, isMobileReadingMode);

    if (!appConfig.ready) {
        return;
    }
    const showTipsOnStartup = appConfig.config.general.show_tips_on_startup !== "否";

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
                configTabSelection,
                projectorWindowPopped,
                setProjectorWindowPopped,
                projectorDisplay,
                setProjectorDisplay,
                showHints,
                isMobileReadingMode,
                getSelectedVersions,
                getMultipleVerses,
                getChapterVerses,
                getNextVerse,
                getPreviousVerse,
                verseExists,
                getBookMeta,
                displayVerse,
                setDisplayVerse,
                previewVerse,
                setPreviewVerse,
                getPreviewVerseForTab,
                setPreviewVerseForTab,
                history,
                setHistory,
                noteList,
                setNoteList,
                collapseLeftSidebar,
                pageTurnTrigger,
                setPageTurnTrigger,
                verseTurnTrigger,
                setVerseTurnTrigger,
            }}
        >
            <DarkTheme dark={dark} highContrast={highContrast} />
            <div className="app">
                <TipsModal tips={tips} showOnStartup={showTipsOnStartup} />
                <div
                    className="app-header"
                    style={{
                        maxHeight: isMobile ? "0px" : "30px",
                        transition: "max-height 1s ease",
                    }}
                >
                    <AppMenu />
                </div>
                <div className="app-body">
                    <FlexLayout.Layout
                        model={flexModel}
                        factory={Factory}
                        onRenderTabSet={handleRenderTabSet}
                        onModelChange={handleLayoutModelChange}
                    />
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
