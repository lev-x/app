import React, { FC } from "react";
import { Text as NativeText, TextProps as NativeTextProps } from "react-native-elements";

import useColors from "../hooks/useColors";

export interface TextProps extends NativeTextProps {
    note?: boolean;
    caption?: boolean;
    dark?: boolean;
    medium?: boolean;
    light?: boolean;
    fontWeight?: "thin" | "light" | "regular" | "medium" | "bold";
}

const Text: FC<TextProps> = props => {
    const { textDark, textMedium, textLight } = useColors();
    const heading = props.h1 || props.h2 || props.h3 || props.h4;
    const fontFamily = {
        thin: "Roboto_100Thin",
        light: "Roboto_300Light",
        regular: "Roboto_400Regular",
        medium: "Roboto_500Medium",
        bold: "Roboto_700Bold"
    }[props.fontWeight === undefined ? (heading ? "bold" : "regular") : props.fontWeight];
    return (
        <NativeText
            {...props}
            h1Style={[{ fontFamily, fontWeight: "normal" }, props.h1Style]}
            h2Style={[{ fontFamily, fontWeight: "normal" }, props.h2Style]}
            h3Style={[{ fontFamily, fontWeight: "normal" }, props.h3Style]}
            h4Style={[{ fontFamily, fontWeight: "normal" }, props.h4Style]}
            style={[
                {
                    fontSize: props.note ? 15 : props.caption ? 22 : 18,
                    color: props.note || props.light ? textLight : props.medium ? textMedium : textDark,
                    fontFamily,
                    fontWeight: "normal"
                },
                props.style
            ]}
        />
    );
};
export default Text;
