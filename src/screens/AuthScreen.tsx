import React, { useCallback, useContext, useState } from "react";
import { Image, View } from "react-native";

import * as AuthSession from "expo-auth-session";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
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
            await setTwitterAuth(await signIn(twitter));
            navigation.replace("Main");
        } catch (e) {
            onError(e);
        } finally {
            setLoading(false);
        }
    }, [twitter]);
    return (
        <Button
            title={"Sign in with Twitter"}
            icon={{ type: "material-community", name: "twitter", color: "white", size: 24 }}
            iconRight={true}
            color={"#1da1f2"}
            loading={loading}
            onPress={onPress}
        />
    );
};

const signIn = async twitter => {
    const redirectUrl = AuthSession.makeRedirectUri() + "/redirect";
    const requestTokens = await twitter.getRequestToken(redirectUrl);
    if (requestTokens.oauth_callback_confirmed === "true") {
        const authResponse = await AuthSession.startAsync({
            authUrl: "https://api.twitter.com/oauth/authenticate" + toQueryString(requestTokens),
            returnUrl: redirectUrl
        });
        if (authResponse.type === "success") {
            return await twitter.getAccessToken({
                oauth_token: requestTokens.oauth_token,
                oauth_verifier: authResponse.params.oauth_verifier
            });
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
