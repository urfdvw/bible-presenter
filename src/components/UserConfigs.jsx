import { Suspense, lazy, useContext } from "react";
import AppContext from "../AppContext";
import schemas from "../configs";

const ConfigForms = lazy(() => import("../utilComponents/react-user-config/ConfigForms"));

export default function UserConfigs() {
    const { appConfig, configTabSelection } = useContext(AppContext);
    return (
        <Suspense fallback={null}>
            <ConfigForms
                schemas={schemas}
                config={appConfig.config}
                setConfig={appConfig.setConfig}
                tabValue={configTabSelection.tabValue}
                setTabValue={configTabSelection.setTabValue}
            />
        </Suspense>
    );
}
