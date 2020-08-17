import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, View } from "react-native";
import { Overlay } from "react-native-elements";

import { StatusBar } from "expo-status-bar";
import useAsyncEffect from "use-async-effect";
import Button from "../components/Button";
import Container from "../components/Container";
import Content from "../components/Content";
import FlexView from "../components/FlexView";
import Header from "../components/Header";
import Text from "../components/Text";
import { SCREEN_WIDTH, Spacing } from "../constants/dimension";
import { WEBSITE_URL } from "../constants/web";
import { Context } from "../context";
import useColors from "../hooks/useColors";
import usePushNotifications from "../hooks/usePushNotifications";
import useTwitter from "../hooks/useTwitter";
import useUpdateChecker from "../hooks/useUpdateChecker";
import LoadingScreen from "./LoadingScreen";

const MainScreen = ({ navigation }) => {
    const { twitterAuth } = useContext(Context);
    const { getGiveawayTweetId } = useTwitter();
    const [tweetId, setTweetId] = useState("");
    useAsyncEffect(async () => {
        if (twitterAuth) {
            setTweetId(await getGiveawayTweetId());
        }
    }, [twitterAuth]);
    useUpdateChecker();
    return twitterAuth && tweetId ? (
        <SafeAreaView>
            <StatusBar translucent={false} style={"dark"} backgroundColor={"white"} />
            <Header navigation={navigation} />
            <Container>
                <Content>
                    <GiveawayResult navigation={navigation} twitterAuth={twitterAuth} url={WEBSITE_URL + tweetId} />
                </Content>
            </Container>
        </SafeAreaView>
    ) : (
        <LoadingScreen />
    );
};

const GiveawayResult = ({ navigation, twitterAuth, url }) => {
    const { count } = useIncrementer();
    return (
        <>
            <AnimatedView slideUp={true} started={count === 0}>
                <HelloText twitterAuth={twitterAuth} />
            </AnimatedView>
            <AnimatedView slideUp={true} started={count === 1} style={{ marginTop: Spacing.normal }}>
                <TitleText>$333 DAI GIVEAWAY has finished. Check if you are on the winners list.</TitleText>
            </AnimatedView>
            <AnimatedView slideUp={true} started={count === 2} style={{ marginTop: Spacing.normal }}>
                <TitleText>Also, next giveaway is coming in 2 WEEKS.</TitleText>
            </AnimatedView>
            <AnimatedView slideLeft={true} started={count === 3} style={{ marginTop: Spacing.large }}>
                <CheckButton navigation={navigation} url={url} />
            </AnimatedView>
            <AnimatedView slideLeft={true} started={count === 4} style={{ marginTop: Spacing.normal }}>
                <NextGiveawayButton />
            </AnimatedView>
        </>
    );
};

const CheckButton = ({ navigation, url }) => {
    const onPress = useCallback(() => {
        navigation.navigate("WebView", { url });
    }, [url]);
    return <Button title={"Check The Winners"} onPress={onPress} />;
};

const NextGiveawayButton = () => {
    const [visible, setVisible] = useState(false);
    const toggleOverlay = useCallback(() => {
        setVisible(!visible);
    }, [visible]);
    return (
        <>
            <Button
                type={"clear"}
                size={"small"}
                title={"GET NOTIFIED OF GIVEAWAYS"}
                onPress={toggleOverlay}
                titleStyle={{ textDecorationLine: "underline" }}
            />
            <TurnOnOverlay visible={visible} toggleOverlay={toggleOverlay} />
        </>
    );
};

const TurnOnOverlay = ({ visible, toggleOverlay }) => {
    const { pushToken } = usePushNotifications();
    return (
        <Overlay
            overlayStyle={{ width: SCREEN_WIDTH * 0.9, padding: 0 }}
            isVisible={visible}
            statusBarTranslucent={true}
            onBackdropPress={toggleOverlay}>
            <Content contentPadding={"small"}>
                <Text style={{ fontSize: 22 }} fontWeight={"bold"}>
                    Next Giveaways
                </Text>
                <Text style={{ marginTop: Spacing.small }}>
                    The next giveaway is on 1st September and we'll send you notifications as soon as it opens.
                </Text>
                {pushToken ? (
                    <View style={{ marginTop: Spacing.small, alignItems: "flex-end" }}>
                        <Text fontWeight={"bold"}>You've already turned on push notifications.</Text>
                        <Button type={"clear"} size={"small"} title={"OK"} onPress={toggleOverlay} />
                    </View>
                ) : (
                    <TurnOnView onClose={toggleOverlay} />
                )}
            </Content>
        </Overlay>
    );
};

const TurnOnView = ({ onClose }) => {
    const { turnOn } = usePushNotifications();
    return (
        <View>
            <Text style={{ marginTop: Spacing.small }}>Do you want to turn on push notifications?</Text>
            <FlexView style={{ marginTop: Spacing.small }}>
                <Button
                    type={"clear"}
                    size={"small"}
                    title={"No, thanks"}
                    containerStyle={{ flex: 1 }}
                    onPress={onClose}
                />
                <Button size={"small"} title={"Turn On Now"} containerStyle={{ flex: 1 }} onPress={turnOn} />
            </FlexView>
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
                height: 12,
                bottom: 8,
                zIndex: 0
            }}
        />
    );
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
