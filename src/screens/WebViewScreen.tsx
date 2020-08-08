import React, { useCallback, useState } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { WebViewNavigation } from "react-native-webview/lib/WebViewTypes";

import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { WEBSITE_URL } from "../constants/web";

const WebViewScreen = ({ route }) => {
    const [loading, setLoading] = useState(true);
    const onLoad = useCallback(() => setLoading(false), [setLoading]);
    const onShouldStartLoadWithRequest = useCallback((event: WebViewNavigation) => {
        if (event.url.startsWith(WEBSITE_URL)) {
            return true;
        } else {
            Linking.openURL(event.url);
            return false;
        }
    }, []);
    return (
        <View style={{ height: "100%" }}>
            <StatusBar translucent={true} />
            <WebView
                source={{ uri: route.params.url }}
                style={{ height: "100%" }}
                onLoad={onLoad}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
