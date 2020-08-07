import React, { useCallback, useState } from "react";
import { Image, View } from "react-native";

import { StatusBar } from "expo-status-bar";
import Content from "../components/Content";
import Footer from "../components/Footer";
import SignInWithAppleButton from "../components/SignInWithAppleButton";
import SignInWithFacebookButton from "../components/SignInWithFacebookButton";
import SignInWithGoogleButton from "../components/SignInWithGoogleButton";
import SignInWithTwitterButton from "../components/SignInWithTwitterButton";
import Text from "../components/Text";
import { Spacing } from "../constants/dimension";

const AuthScreen = ({ navigation }) => {
    return (
        <Content contentPadding={"large"} style={{ flex: 1 }}>
            <StatusBar translucent={true} />
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Image source={require("../../assets/logo-horizontal.png")} style={{ width: 213, height: 93 }} />
                <Text h2={true} fontWeight={"medium"} style={{ marginTop: Spacing.large }}>
                    Glad to{"\n"}meet you.
                </Text>
                <Buttons navigation={navigation} />
                <Footer />
            </View>
        </Content>
    );
};

const Buttons = ({ navigation }) => {
    const [error, setError] = useState("");
    const onSuccess = useCallback(() => navigation.push("CreateWallet"), []);
    return (
        <View style={{ marginVertical: Spacing.normal }}>
            <SignInWithGoogleButton onSuccess={onSuccess} onError={setError} />
            <Margin />
            <SignInWithAppleButton onSuccess={onSuccess} onError={setError} />
            <Margin />
            <SignInWithFacebookButton onSuccess={onSuccess} onError={setError} />
            <Margin />
            <SignInWithTwitterButton onSuccess={onSuccess} onError={setError} />
            <Text
                note={true}
                style={{
                    color: "red",
                    marginTop: Spacing.small
                }}>
                {error.toString()}
            </Text>
        </View>
    );
};

const Margin = () => <View style={{ height: Spacing.small }} />;

export default AuthScreen;
