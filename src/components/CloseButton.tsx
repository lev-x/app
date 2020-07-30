import React, { FC } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";

import useColors from "../hooks/useColors";

export interface CloseButtonProps {
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

const CloseButton: FC<CloseButtonProps> = props => {
    const { disabled } = useColors();
    return (
        <Icon
            type={"ionicon"}
            name={"md-close"}
            color={"transparent"}
            size={28}
            reverse={true}
            raised={true}
            reverseColor={disabled}
            onPress={props.onPress}
            containerStyle={[{ elevation: 0, shadowOpacity: 0 }, props.style]}
        />
    );
};

export default CloseButton;
