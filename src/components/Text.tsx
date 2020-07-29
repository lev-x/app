import React, { FC } from "react";
import { Text as NativeText, TextProps as NativeTextProps } from "react-native-elements";

import useColors from "../hooks/useColors";

export interface TextProps extends NativeTextProps {
    note?: boolean;
    caption?: boolean;
    dark?: boolean;
    medium?: boolean;
    light?: boolean;
    fontWeight?: "light" | "normal" | "bold";
}

const Text: FC<TextProps> = props => {
    const { textDark, textMedium, textLight } = useColors();
    const bold = props.h1 || props.h2 || props.h3 || props.h4;
    const fontFamily = {
        light: "Roboto_300Light",
        normal: "Roboto_400Regular",
        bold: "Roboto_500Medium"
    }[props.fontWeight === undefined ? (bold ? "bold" : "normal") : props.fontWeight];
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
