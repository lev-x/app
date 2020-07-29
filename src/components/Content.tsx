import React from "react";
import { View, ViewProps } from "react-native";

import { Spacing } from "../constants/dimension";
import useColors from "../hooks/useColors";

interface ContentProps extends ViewProps {
    contentPadding?: "small" | "normal" | "large";
}

const Content: React.FunctionComponent<ContentProps> = props => {
    const { background } = useColors();
    return (
        <View
            {...props}
            style={[
                {
                    paddingHorizontal: Spacing.content,
                    paddingVertical: Spacing.normal,
                    backgroundColor: background
                },
                props.style
            ]}
        />
    );
};
export default Content;
