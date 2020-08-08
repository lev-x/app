import React, { FC, useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";

import { StackActions, useNavigation } from "@react-navigation/native";
import useColors from "../hooks/useColors";

export interface CloseButtonProps {
    style?: StyleProp<ViewStyle>;
}

const CloseButton: FC<CloseButtonProps> = props => {
    const { disabled } = useColors();
    const { dispatch } = useNavigation();
    const onPress = useCallback(() => dispatch(StackActions.pop()), []);
    return (
        <Icon
            type={"ionicon"}
            name={"md-close"}
            color={"transparent"}
            size={28}
            reverse={true}
            raised={true}
            reverseColor={disabled}
            onPress={onPress}
            containerStyle={[{ elevation: 0, shadowOpacity: 0 }, props.style]}
        />
    );
};

export default CloseButton;
