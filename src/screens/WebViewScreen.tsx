import React, { useCallback, useState } from "react";
import { Platform, View } from "react-native";
import WebView from "react-native-webview";
import { WebViewNavigation } from "react-native-webview/lib/WebViewTypes";

import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import Header from "../components/Header";
import { WEBSITE_URL } from "../constants/web";

const WebViewScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const onLoad = useCallback(() => setLoading(false), [setLoading]);
    const onNavigationStateChange = useCallback((event: WebViewNavigation) => {
        if (!event.url.startsWith(WEBSITE_URL)) {
            Linking.openURL(event.url);
        }
    }, []);
    return (
        <View style={{ height: "100%" }}>
            <StatusBar
                translucent={false}
                style={Platform.OS === "ios" ? "light" : "dark"}
                backgroundColor={Platform.OS === "ios" ? "black" : "white"}
            />
            <Header navigation={navigation} modal={true} />
            <WebView
                source={{ uri: route.params.url }}
                style={{ height: "100%" }}
                onLoad={onLoad}
                onNavigationStateChange={onNavigationStateChange}
            />
            {loading && <LoadingView />}
        </View>
    );
};

const LoadingView = () => (
    <View
        style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "center"
        }}>
        <LottieView
            style={{ width: 120, height: 120, alignSelf: "center" }}
            source={require("../../assets/loading.json")}
            autoPlay={true}
        />
    </View>
);

export default WebViewScreen;
