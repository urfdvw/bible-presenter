import { useEffect, useState } from "react";
// schema default
import jsonSchemaDefaults from "json-schema-defaults";
// utils
import { isDefined, isObject } from "./utils";
// local storage hook
import { useLocalStorage } from "./useLocalStorage";

function getConfigWithDefaults(current_config, schema) {
    var config = jsonSchemaDefaults(schema);
    if (isDefined(current_config) && isObject(current_config)) {
        for (const field_name in config) {
            if (field_name in current_config) {
                config[field_name] = current_config[field_name];
            }
        }
    }
    return config;
}

export default function useConfig(schemas) {
    const { localStorageState, setLocalStorageState, initLocalStorageState } = useLocalStorage("config");
    const [initStep, setInitStep] = useState(0);

    function get_config(schema_name) {
        const config = localStorageState[schema_name];
        return isDefined(config) ? config : null;
    }

    function set_config(schema_name, config_values) {
        setLocalStorageState(schema_name, config_values);
    }

    useEffect(() => {
        if (initStep === 0) {
            initLocalStorageState();
            setInitStep(1);
        }
        if (initStep === 1) {
            for (const schema of schemas) {
                const schema_name = schema.name;
                const currentConfig = isDefined(localStorageState[schema_name]) ? localStorageState[schema_name] : null;
                const configValues = getConfigWithDefaults(currentConfig, schema);
                setLocalStorageState(schema_name, configValues);
            }
            setInitStep(-1); // mark as done
        }
    }, [initLocalStorageState, initStep, localStorageState, schemas, setLocalStorageState]);

    function set_config_field(schema_name, field_name, field_value) {
        const config = get_config(schema_name);
        if (field_name in config) {
            if (typeof field_value !== typeof config[field_name]) {
                console.error(
                    "given value " +
                        field_value +
                        " has a different type from config schema. Given: " +
                        typeof field_value +
                        ", required: " +
                        typeof config[field_name]
                );
            } else {
                set_config(schema_name, { ...config, [field_name]: field_value });
            }
        } else {
            console.error("no field called " + field_name + " in config schema " + schema_name);
        }
    }

    return {
        config: localStorageState,
        setConfig: set_config,
        setConfigField: set_config_field,
        ready: initStep < 0,
    };
}
