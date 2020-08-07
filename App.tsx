// tslint:disable-next-line:ordered-imports
import "./global";
// tslint:disable-next-line:ordered-imports
import React, { useContext, useState } from "react";
import { ThemeProvider } from "react-native-elements";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "react-native-screens/native-stack";

import {
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    useFonts
} from "@expo-google-fonts/roboto";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import useAsyncEffect from "use-async-effect";
import { Context, ContextProvider } from "./src/context";
import useColors from "./src/hooks/useColors";
import AuthScreen from "./src/screens/AuthScreen";
import CreateWalletScreen from "./src/screens/CreateWalletScreen";
import EnterEmailScreen from "./src/screens/EnterEmailScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import MainScreen from "./src/screens/MainScreen";
import VerifyEmailScreen from "./src/screens/VerifyEmailScreen";

enableScreens();

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const App = () => {
    return (
        <ContextProvider>
            <AppLoader />
        </ContextProvider>
    );
};

const AppLoader = () => {
    const [loading, setLoading] = useState(true);
    const [fontsLoaded] = useFonts({
        Roboto_100Thin,
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold
    });
    const { load, twitterAuth } = useContext(Context);
    useAsyncEffect(async () => {
        await load();
        setLoading(false);
    }, []);
    useAsyncEffect(() => {
        if (!loading && fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [loading, fontsLoaded]);
    return loading || !fontsLoaded ? <LoadingScreen /> : <AppContainer twitterAuth={twitterAuth} />;
};

const AppContainer = ({ twitterAuth }) => {
    const { darkMode } = useContext(Context);
    const { background, primary, secondary, textDark, border } = useColors();
    const colors = {
        primary,
        background,
        card: background,
        text: textDark,
        border,
        notification: secondary
    };
    return (
        <ThemeProvider theme={{ colors }}>
            <NavigationContainer
                theme={{
                    dark: darkMode,
                    colors
                }}>
                <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName={twitterAuth ? "Main" : "Auth"}>
                    <Stack.Screen name={"Auth"} component={AuthScreen} />
                    <Stack.Screen name={"CreateWallet"} component={CreateWalletScreen} />
                    <Stack.Screen name={"EnterEmail"} component={EnterEmailScreen} />
                    <Stack.Screen name={"VerifyEmail"} component={VerifyEmailScreen} />
                    <Stack.Screen name={"Main"} component={MainScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
};

export default App;
