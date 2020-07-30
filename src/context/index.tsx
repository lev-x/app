import React, { useState } from "react";
import { useColorScheme } from "react-native-appearance";

import AsyncStorage from "@react-native-community/async-storage";
import { ExpoPushToken } from "expo-notifications";
import { AccessTokenResponse } from "twitter-lite/dist";

export const Context = React.createContext({
    load: async () => {},
    clear: async () => {},
    darkMode: false,
    setDarkMode: async darkMode => {},
    twitterAuth: null as AccessTokenResponse | null,
    setTwitterAuth: async auth => {},
    pushToken: null as ExpoPushToken | null,
    setPushToken: async token => {}
});

// tslint:disable-next-line:max-func-body-length
export const ContextProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [darkMode, setDarkMode] = useState(colorScheme === "dark");
    const [twitterAuth, setTwitterAuth] = useState<AccessTokenResponse | null>(null);
    const [pushToken, setPushToken] = useState<ExpoPushToken | null>(null);
    return (
        <Context.Provider
            value={{
                load: async () => {
                    const mode = await AsyncStorage.getItem("dark_mode");
                    setDarkMode(mode ? Boolean(mode) : false);
                    const auth = await AsyncStorage.getItem("twitter_auth");
                    setTwitterAuth(auth ? JSON.parse(auth) : null);
                    const token = await AsyncStorage.getItem("push_token");
                    setPushToken(token ? JSON.parse(token) : null);
                },
                clear: async () => {
                    setDarkMode(false);
                    await AsyncStorage.removeItem("dark_mode");
                    setTwitterAuth(null);
                    await AsyncStorage.removeItem("twitter_auth");
                    setPushToken(null);
                    await AsyncStorage.removeItem("push_token");
                },
                darkMode,
                setDarkMode: async (mode: boolean) => {
                    await AsyncStorage.setItem("dark_mode", String(mode));
                    setDarkMode(mode);
                },
                twitterAuth,
                setTwitterAuth: async (auth: AccessTokenResponse | null) => {
                    if (auth) {
                        await AsyncStorage.setItem("twitter_auth", JSON.stringify(auth));
                    } else {
                        await AsyncStorage.removeItem("twitter_auth");
                    }
                    setTwitterAuth(auth);
                },
                pushToken,
                setPushToken: async (token: ExpoPushToken | null) => {
                    if (token) {
                        await AsyncStorage.setItem("push_token", JSON.stringify(token));
                    } else {
                        await AsyncStorage.removeItem("push_token");
                    }
                    setPushToken(token);
                }
            }}>
            {children}
        </Context.Provider>
    );
};

export const ContextConsumer = Context.Consumer;
