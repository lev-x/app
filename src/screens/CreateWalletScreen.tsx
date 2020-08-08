import React, { useCallback, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import Content from "../components/Content";
import FlexView from "../components/FlexView";
import Header from "../components/Header";
import Input from "../components/Input";
import Lead from "../components/Lead";
import Text from "../components/Text";
import { SCREEN_HEIGHT, Spacing } from "../constants/dimension";

const CreateWalletScreen = () => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const { navigate } = useNavigation();
    const onNext = useCallback(() => {
        navigate("EnterEmail");
    }, []);
    return (
        <View style={{ flex: 1, minHeight: SCREEN_HEIGHT }}>
            <StatusBar translucent={true} />
            <Header type={"clear"} hideTitle={true} hideOverflowButton={true} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Content style={{ flex: 1, justifyContent: "space-between" }}>
                    <View>
                        <Lead title={"Create"} subtitle={"Your Wallet"}>
                            Choose a username to be used as your address.
                        </Lead>
                        <UsernameInput onChangeText={setUsername} onError={setError} onNext={onNext} />
                        <Text style={{ color: "red" }}>{error}</Text>
                    </View>
                    {username !== "" && error === "" && <NextButton onPress={onNext} />}
                </Content>
            </TouchableWithoutFeedback>
        </View>
    );
};

const UsernameInput = ({ onChangeText, onError, onNext }) => {
    return (
        <FlexView style={{ marginTop: Spacing.normal, alignItems: "center" }}>
            <Input
                size={"large"}
                containerStyle={{ flex: 1, paddingHorizontal: 0, paddingTop: 8 }}
                autoCapitalize={"none"}
                autoCorrect={false}
                autoFocus={true}
                placeholder={"username"}
                returnKeyType={"done"}
                forbidden={forbidden}
                onChangeText={onChangeText}
                onError={onError}
                onSubmitEditing={onNext}
            />
            <Text h3={true} fontWeight={"thin"} style={{ flex: 0 }}>
                .levx.eth
            </Text>
        </FlexView>
    );
};

const forbidden = [
    {
        regexp: /[^a-z0-9\-]/,
        error: "Lowercase alphabets, numbers and '-' are allowed."
    },
    {
        regexp: /^[0-9]/,
        error: "First character cannot be a number."
    },
    {
        regexp: /^-/,
        error: "'-' cannot be placed at first"
    },
    {
        regexp: /-$/,
        error: "'-' cannot be placed at last"
    }
];

const NextButton = ({ onPress }) => {
    return <Button title={"I'd like to use this name"} onPress={onPress} />;
};

export default CreateWalletScreen;
