import React, { FC, useCallback } from "react";
import { Input as NativeInput, InputProps as NativeInputProps } from "react-native-elements";

import useColors from "../hooks/useColors";

export interface Validation {
    regexp: RegExp;
    error: string;
}

export interface InputProps extends NativeInputProps {
    color?: string;
    size?: "small" | "normal" | "large";
    allowed?: Validation[];
    forbidden?: Validation[];
    onError?: (error: string) => void;
}

// tslint:disable-next-line:max-func-body-length
const Input: FC<InputProps> = props => {
    const { primary } = useColors();
    const size = props.size || "normal";
    const fontSize = size === "small" ? 24 : size === "large" ? 36 : 30;
    const onChangeText = useCallback((text: string) => {
        props.onChangeText?.(text);
        props.onError?.("");
        const errors = [] as string[];
        if (text !== "" && props.forbidden) {
            props.forbidden.forEach(validation => {
                if (text.match(validation.regexp)) {
                    errors.push(validation.error);
                }
            });
        }
        if (text !== "" && props.allowed) {
            props.allowed.forEach(validation => {
                if (!text.match(validation.regexp)) {
                    errors.push(validation.error);
                }
            });
        }
        if (errors.length > 0) {
            props.onError?.(errors.join("\n"));
        }
    }, []);
    return (
        <NativeInput
            {...props}
            inputStyle={[{ fontSize, paddingBottom: 4, color: props.color || primary }, props.inputStyle]}
            errorStyle={props.onError ? { height: 0 } : props.errorStyle}
            onChangeText={onChangeText}
        />
    );
};

export default Input;
