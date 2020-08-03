import { useEffect } from "react";
import { Alert, AppState } from "react-native";

import * as Updates from "expo-updates";

const useUpdateChecker = () => {
    useEffect(() => {
        const onAppStateChange = async appState => {
            if (appState === "active") {
                await checkForUpdate();
            }
        };
        AppState.addEventListener("change", onAppStateChange);
        return () => AppState.removeEventListener("change", onAppStateChange);
    }, []);
};

const checkForUpdate = async () => {
    try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
            Updates.fetchUpdateAsync().then(() => {
                Alert.alert(
                    "New version available :)",
                    "You can update to the new version now. Do you want to continue?",
                    [
                        {
                            text: "No",
                            style: "cancel"
                        },
                        {
                            text: "Yes",
                            style: "default",
                            onPress: () => {
                                Updates.reloadAsync();
                            }
                        }
                    ]
                );
            });
        }
    } catch (e) {}
};

export default useUpdateChecker;
