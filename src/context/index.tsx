import React, { useState } from "react";
import { useColorScheme } from "react-native-appearance";

import { AccessTokenResponse } from "twitter-lite/dist";

export const Context = React.createContext({
    darkMode: false,
    setDarkMode: darkMode => {},
    twitterAuth: null as AccessTokenResponse | null,
    setTwitterAuth: auth => {}
});

export const ContextProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [darkMode, setDarkMode] = useState(colorScheme === "dark");
    const [twitterAuth, setTwitterAuth] = useState<AccessTokenResponse | null>(null);
    return (
        <Context.Provider value={{ darkMode, setDarkMode, twitterAuth, setTwitterAuth }}>{children}</Context.Provider>
    );
};

export const ContextConsumer = Context.Consumer;
