import React, { useCallback, useState } from "react";
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import Content from "../components/Content";
import Header from "../components/Header";
import Lead from "../components/Lead";
import Text from "../components/Text";
import { Spacing } from "../constants/dimension";
import useColors from "../hooks/useColors";

const CELL_COUNT = 6;

const VerifyEmailScreen = ({ route }) => {
    const [value, setValue] = useState("");
    const email = route.params.email;
    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent={true} />
            <Header type={"clear"} hideTitle={true} hideOverflowButton={true} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Content style={{ flex: 1, justifyContent: "space-between" }}>
                        <View>
                            <Lead title={"Verify"} subtitle={"Your Email"}>
                                We've sent a verification code to <Text fontWeight={"bold"}>{email}</Text>. Check your
                                inbox.
                            </Lead>
                            <CodeInput value={value} setValue={setValue} />
                        </View>
                        {value.length >= CELL_COUNT && <NextButton />}
                    </Content>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
};

const CodeInput = ({ value, setValue }) => {
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue
    });
    const renderCell = useCallback(p => <Cell kye={p.index} {...p} onLayout={getCellOnLayoutHandler(p.index)} />, []);
    return (
        <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={{ marginTop: Spacing.large }}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCell}
        />
    );
};

const Cell = ({ symbol, isFocused, onLayout }) => {
    const { primary, textLight } = useColors();
    return (
        <View style={{ width: 48, height: 48 }}>
            <Text style={{ lineHeight: 44, fontSize: 36, textAlign: "center", color: primary }} onLayout={onLayout}>
                {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
            <View
                style={{
                    backgroundColor: isFocused ? primary : textLight,
                    position: "absolute",
                    width: "100%",
                    height: 1,
                    bottom: 0
                }}
            />
        </View>
    );
};

const NextButton = () => {
    const onPress = useCallback(() => {}, []);
    return <Button title={"Verify Now"} onPress={onPress} />;
};

export default VerifyEmailScreen;
