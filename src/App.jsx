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
    // projector popup
    const [projectorWindowPopped, setProjectorWindowPopped] = useState(false);
    // Bible Data
    const { getVerseText } = useBibleData(Bible.cuvs, Bible.cuvt, Bible.asv, appConfig.config.bible_version);
    // Bible control
    const [displayVerse, setDisplayVerse] = useState({
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
                appConfig,
                helpTabSelection,
                projectorWindowPopped,
                setProjectorWindowPopped,
                displayVerse,
                setDisplayVerse,
                getVerseText,
            }}
        >
            <DarkTheme dark={dark} highContrast={highContrast} />
            <div className="app">
                {appConfig.config.general.show_menu_bar ? (
                    <div className="app-header">
                        <AppMenu />
                    </div>
                ) : (
                    <></>
                )}
                <div className="app-body">
                    <FlexLayout.Layout model={flexModel} factory={Factory} />
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default App;
