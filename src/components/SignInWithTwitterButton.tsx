import React, { useCallback, useContext, useState } from "react";

import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import { Context } from "../context";
import useColors from "../hooks/useColors";
import useTwitter from "../hooks/useTwitter";
import Button from "./Button";

const SignInWithTwitterButton = ({ onSuccess, onError }) => {
    const { twitter: twitterColor } = useColors();
    const [loading, setLoading] = useState(false);
    const { twitter } = useTwitter();
    const { setTwitterAuth } = useContext(Context);
    const onPress = useCallback(async () => {
        onError("");
        setLoading(true);
        try {
            await setTwitterAuth(await signIn(twitter));
            onSuccess();
        } catch (e) {
            onError(e);
        } finally {
            setLoading(false);
        }
    }, []);
    return (
        <Button
            title={"Sign in with Twitter"}
            icon={{ type: "material-community", name: "twitter", color: "white", size: 24 }}
            buttonStyle={{ justifyContent: "space-between" }}
            iconRight={true}
            size={"small"}
            color={twitterColor}
            loading={loading}
            onPress={onPress}
        />
    );
};

const signIn = async twitter => {
    const redirectUrl = AuthSession.makeRedirectUri() + (Constants.appOwnership === "standalone" ? "/redirect" : "");
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

export default SignInWithTwitterButton;
