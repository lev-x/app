import React, { useCallback, useContext, useState } from "react";
import { Image, View } from "react-native";
import { Button } from "react-native-elements";

import AsyncStorage from "@react-native-community/async-storage";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Text from "../components/Text";
import { Spacing } from "../constants/dimension";
import { Context } from "../context";
import useTwitter from "../hooks/useTwitter";

const AuthScreen = ({ navigation }) => {
    const [error, setError] = useState("");
    return (
        <Content contentPadding={"large"} style={{ flex: 1 }}>
            <StatusBar translucent={true} />
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Image source={require("../../assets/logo-horizontal.png")} style={{ width: 213, height: 93 }} />
                <Text h2={true} style={{ marginTop: Spacing.large }}>
                    Glad to{"\n"}meet you.
                </Text>
                <Text
                    medium={true}
                    fontWeight={"light"}
                    style={{ marginTop: Spacing.small, marginBottom: Spacing.large }}>
                    Sign in and enter the DAI giveaway!
                </Text>
                <SignInButton navigation={navigation} onError={setError} />
                <Text note={true} style={{ color: "red", height: Spacing.huge, marginTop: Spacing.small }}>
                    {error.toString()}
                </Text>
                <Footer />
            </View>
        </Content>
    );
};

const SignInButton = ({ navigation, onError }) => {
    const [loading, setLoading] = useState(false);
    const { twitter } = useTwitter();
    const { setTwitterAuth } = useContext(Context);
    const onPress = useCallback(async () => {
        onError("");
        setLoading(true);
        try {
            setTwitterAuth(await signIn(twitter));
            navigation.replace("Main");
        } catch (e) {
            onError(e);
        } finally {
            setLoading(false);
        }
    }, [twitter]);
    const justifyContent = loading ? "center" : "space-between";
    return (
        <Button
            buttonStyle={{ justifyContent, paddingHorizontal: Spacing.small, height: 64 }}
            type={"clear"}
            icon={{ type: "material-community", name: "twitter", color: "white", size: 24 }}
            iconRight={true}
            title={"Sign in with Twitter"}
            containerStyle={{ backgroundColor: "#1da1f2", elevation: Spacing.small }}
            titleStyle={{ color: "white", fontSize: 20 }}
            loading={loading}
            loadingProps={{ size: "large", color: "white" }}
            onPress={onPress}
        />
    );
};

const signIn = async twitter => {
    const redirectUrl = AuthSession.makeRedirectUri({ useProxy: Constants.appOwnership === "standalone" });
    const requestTokens = await twitter.getRequestToken(redirectUrl);
    if (requestTokens.oauth_callback_confirmed === "true") {
        const authResponse = await AuthSession.startAsync({
            authUrl: "https://api.twitter.com/oauth/authenticate" + toQueryString(requestTokens),
            returnUrl: redirectUrl
        });
        if (authResponse.type === "success") {
            const auth = await twitter.getAccessToken({
                oauth_token: requestTokens.oauth_token,
                oauth_verifier: authResponse.params.oauth_verifier
            });
            await AsyncStorage.setItem("twitter_auth", JSON.stringify(auth));
            return auth;
        } else {
            throw new Error("AuthSession.type is " + authResponse.type);
        }
    } else {
        throw new Error("OAuth callback not confirmed");
    }
};

function toQueryString(params) {
    return (
        "?" +
        Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join("&")
    );
}

export default AuthScreen;
