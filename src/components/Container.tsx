import React, { FC, useCallback, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View, ViewProps } from "react-native";
import { Icon } from "react-native-elements";

import { SCREEN_HEIGHT, Spacing } from "../constants/dimension";
import useColors from "../hooks/useColors";

export interface ContainerProps extends ViewProps {
    scrollToBottomLength?: number;
    showScrollToBottomButton?: boolean;
}

const Container: FC<ContainerProps> = props => {
    const { background } = useColors();
    const [showBottomButton, setShowButtonButton] = useState(true);
    const ref = useRef<ScrollView | null>(null);
    const onScroll = useCallback((scrollEvent: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPercent = scrollEvent.nativeEvent.contentOffset.y / scrollEvent.nativeEvent.contentSize.height;
        setShowButtonButton(scrollPercent < 0.1);
    }, []);
    const scrollToBottom = useCallback(() => {
        if (ref.current) {
            ref.current.scrollTo({
                y: props.scrollToBottomLength || SCREEN_HEIGHT * 0.5,
                animated: true
            });
        }
    }, [ref, props]);
    return (
        <View>
            <ScrollView
                ref={ref}
                nestedScrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }}
                onScroll={onScroll}
                style={[{ backgroundColor: background }, props.style]}
                {...props}
            />
            {props.showScrollToBottomButton && showBottomButton && <BottomButton onPress={scrollToBottom} />}
        </View>
    );
};

const BottomButton = ({ onPress }) => {
    const { secondary } = useColors();
    return (
        <View style={{ position: "absolute", bottom: Spacing.small, width: "100%", alignItems: "center" }}>
            <Icon
                type={"material-community"}
                name={"chevron-triple-down"}
                color={secondary}
                raised={true}
                onPress={onPress}
            />
        </View>
    );
};
export default Container;
