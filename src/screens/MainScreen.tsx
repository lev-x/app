import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import Container from "../components/Container";
import Content from "../components/Content";
import FlexView from "../components/FlexView";
import Header from "../components/Header";
import Text from "../components/Text";
import { SCREEN_WIDTH, Spacing } from "../constants/dimension";
import { Context } from "../context";
import useColors from "../hooks/useColors";

const MainScreen = ({ navigation }) => {
    const { twitterAuth } = useContext(Context);
    const { count } = useIncrementer();
    return (
        <View>
            <StatusBar translucent={true} />
            <Header navigation={navigation} />
            <Container>
                <Content>
                    <AnimatedView slideUp={true} started={count === 0}>
                        <HelloText twitterAuth={twitterAuth} />
                    </AnimatedView>
                    <AnimatedView slideUp={true} started={count === 1} style={{ marginTop: Spacing.normal }}>
                        <TitleText>We have a DAI giveaway campaign that you can enter right away.</TitleText>
                    </AnimatedView>
                    <AnimatedView slideUp={true} started={count === 2} style={{ marginTop: Spacing.normal }}>
                        <TitleText>Do you want to learn more about it?</TitleText>
                    </AnimatedView>
                    <AnimatedView slideLeft={true} started={count === 3} style={{ marginTop: Spacing.huge }}>
                        <NextButton navigation={navigation} />
                    </AnimatedView>
                </Content>
            </Container>
        </View>
    );
};

const AnimatedView = props => {
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (props.started) {
            Animated.timing(anim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true
            }).start();
        }
    }, [props.started, anim]);
    return (
        <Animated.View
            {...props}
            style={[
                {
                    opacity: anim,
                    transform: props.slideLeft ? slideLeft(anim) : props.slideUp ? slideUp(anim) : undefined
                },
                props.style
            ]}
        />
    );
};

const HelloText = ({ twitterAuth }) => (
    <FlexView style={{ marginTop: Spacing.huge }}>
        <TitleText>Hello, </TitleText>
        <View>
            <TitleText bold={true}>{twitterAuth.screen_name}</TitleText>
            <Highlighter />
        </View>
    </FlexView>
);

const TitleText = props => {
    return <Text {...props} h4={true} fontWeight={props.bold ? "bold" : "light"} style={{ zIndex: 100 }} />;
};

const Highlighter = () => {
    const { secondary } = useColors();
    return (
        <View
            style={{
                backgroundColor: secondary,
                position: "absolute",
                width: "100%",
                top: 20,
                bottom: 8,
                zIndex: 0
            }}
        />
    );
};

const NextButton = ({ navigation }) => {
    const onPress = useCallback(() => {
        navigation.navigate("Giveaway");
    }, [navigation]);
    return <Button title={"Yes. I'd like that."} onPress={onPress} />;
};

const useIncrementer = (delay = 700, maxCount = 5) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const handle = setInterval(() => {
            if (count < maxCount) {
                setCount(count + 1);
            } else {
                clearInterval(handle);
            }
        }, delay);
        return () => clearInterval(handle);
    }, [count]);
    return { count };
};

const slideLeft = anim => [
    {
        translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [SCREEN_WIDTH, 0]
        })
    }
];

const slideUp = anim => [
    {
        translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
        })
    }
];

export default MainScreen;
