import React, { FC } from "react";
import { Button as NativeButton, ButtonProps as NativeButtonProps } from "react-native-elements";

import { Spacing } from "../constants/dimension";
import useColors from "../hooks/useColors";

export interface ButtonProps extends NativeButtonProps {
    color?: string;
    size?: "small" | "normal" | "large";
}

// tslint:disable-next-line:max-func-body-length
const Button: FC<ButtonProps> = props => {
    const { primary, shadow, border } = useColors();
    const type = props.type || "solid";
    const height = props.size === "small" ? 48 : 64;
    const fontSize = props.size === "small" ? 16 : 20;
    return (
        <NativeButton
            {...props}
            type={type}
            buttonStyle={[
                {
                    height,
                    paddingHorizontal: Spacing.small,
                    backgroundColor: type === "solid" ? props.color || primary : "white",
                    borderColor: border
                },
                props.buttonStyle
            ]}
            titleStyle={[{ fontSize }, props.titleStyle]}
            containerStyle={[
                props.type === "clear"
                    ? {}
                    : {
                          borderRadius: Spacing.tiny,
                          elevation: Spacing.small,
                          shadowColor: shadow,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.5,
                          shadowRadius: 4,
                          overflow: "visible"
                      },
                props.containerStyle
            ]}
        />
    );
};
export default Button;
