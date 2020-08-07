import React, { useCallback, useState } from "react";
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import Content from "../components/Content";
import FlexView from "../components/FlexView";
import Header from "../components/Header";
import Input from "../components/Input";
import Lead from "../components/Lead";
import Text from "../components/Text";
import { Spacing } from "../constants/dimension";

const CreateWalletScreen = () => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent={true} />
            <Header type={"clear"} hideTitle={true} hideOverflowButton={true} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Content style={{ flex: 1, justifyContent: "space-between" }}>
                        <View>
                            <Lead
                                title={"Create"}
                                subtitle={"Your Wallet"}
                                description={"Choose a username to be used as your address."}
                            />
                            <UsernameInput onChangeText={setUsername} onError={setError} />
                            <Text style={{ color: "red" }}>{error}</Text>
                        </View>
                        {username !== "" && error === "" && <NextButton />}
                    </Content>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
};

const UsernameInput = ({ onChangeText, onError }) => {
    return (
        <FlexView style={{ marginTop: Spacing.large, alignItems: "center" }}>
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

const NextButton = () => {
    const { navigate } = useNavigation();
    const onPress = useCallback(() => {
        navigate("EnterEmail");
    }, []);
    return <Button title={"I'd like to use this name"} onPress={onPress} />;
};

export default CreateWalletScreen;
