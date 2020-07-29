import React, { FC } from "react";
import { Button as NativeButton, ButtonProps as NativeButtonProps } from "react-native-elements";

import { Spacing } from "../constants/dimension";
import useColors from "../hooks/useColors";

export interface ButtonProps extends NativeButtonProps {
    size?: "small" | "normal" | "large";
}

const Button: FC<ButtonProps> = props => {
    const { primary } = useColors();
    const type = props.type || "solid";
    const height = props.size === "small" ? 56 : 64;
    const fontSize = props.size === "small" ? 18 : 20;
    return (
        <NativeButton
            {...props}
            type={type}
            buttonStyle={[{ height, paddingHorizontal: Spacing.small }, props.buttonStyle]}
            titleStyle={[{ fontSize }, props.titleStyle]}
            containerStyle={[
                {
                    backgroundColor: type === "solid" ? primary : "white",
                    borderRadius: Spacing.tiny,
                    elevation: Spacing.small
                },
                props.containerStyle
            ]}
        />
    );
};
export default Button;
