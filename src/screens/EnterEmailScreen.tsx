import React, { useCallback, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import Content from "../components/Content";
import Header from "../components/Header";
import Input from "../components/Input";
import Lead from "../components/Lead";
import Text from "../components/Text";
import { SCREEN_HEIGHT, Spacing } from "../constants/dimension";

const REGEXP_EMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;

const EnterEmailScreen = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { navigate } = useNavigation();
    const onNext = useCallback(() => {
        navigate("VerifyEmail", { email });
    }, [email]);
    return (
        <View style={{ flex: 1, minHeight: SCREEN_HEIGHT }}>
            <StatusBar translucent={true} />
            <Header type={"clear"} hideTitle={true} hideOverflowButton={true} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Content style={{ flex: 1, justifyContent: "space-between" }}>
                    <View>
                        <Lead title={"Enter"} subtitle={"Your Email"}>
                            Enter your email address to receive security alerts.
                        </Lead>
                        <EmailInput onChangeText={setEmail} onError={setError} onNext={onNext} />
                        {email.match(/@.+/) && <Text style={{ color: "red" }}>{error}</Text>}
                    </View>
                    {email !== "" && error === "" && <NextButton onPress={onNext} />}
                </Content>
            </TouchableWithoutFeedback>
        </View>
    );
};

const EmailInput = ({ onChangeText, onError, onNext }) => {
    return (
        <Input
            size={"small"}
            containerStyle={{ marginTop: Spacing.normal, paddingHorizontal: 0 }}
            autoCapitalize={"none"}
            autoCorrect={false}
            autoFocus={true}
            keyboardType={"email-address"}
            placeholder={"email"}
            returnKeyType={"done"}
            allowed={[
                {
                    regexp: REGEXP_EMAIL,
                    error: "Invalid email address."
                }
            ]}
            onChangeText={onChangeText}
            onError={onError}
            onSubmitEditing={onNext}
        />
    );
};

const NextButton = ({ onPress }) => {
    return <Button title={"Send Verification"} onPress={onPress} />;
};

export default EnterEmailScreen;
