import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Image, InteractionManager, Platform, StatusBar, View } from "react-native";
import { Card, Icon, SocialIcon } from "react-native-elements";

import AsyncStorage from "@react-native-community/async-storage";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { AndroidImportance } from "expo-notifications";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Button from "../components/Button";
import Container from "../components/Container";
import Content from "../components/Content";
import FlexView from "../components/FlexView";
import Footer from "../components/Footer";
import Text from "../components/Text";
import { Spacing } from "../constants/dimension";
import { Context } from "../context";
import useColors from "../hooks/useColors";
import useTwitter from "../hooks/useTwitter";

const LEVX_TWITTER_ID = "1187725084066103298";

const GiveawayScreen = ({ navigation }) => {
    return (
        <Container
            scrollToBottomLength={440}
            showScrollToBottomButton={true}
            style={{ backgroundColor: "transparent" }}>
            <StatusBar translucent={true} barStyle={"light-content"} backgroundColor={"transparent"} animated={true} />
            <View>
                <Cover navigation={navigation} />
                <Content>
                    <Prizes />
                    <Rules />
                    <FAQ />
                    <Social />
                    <Footer alignCenter={true} />
                </Content>
            </View>
        </Container>
    );
};

const Cover = ({ navigation }) => (
    <View style={{ width: "100%", height: 440 }}>
        <CoverImage />
        <Header navigation={navigation} />
        <View style={{ position: "absolute", width: "100%", bottom: 0 }}>
            <Content style={{ backgroundColor: "transparent" }}>
                <View style={{ marginTop: Spacing.huge, alignItems: "flex-end" }}>
                    <TitleText>$333 DAI{"\n"}Giveaway</TitleText>
                    <Text fontWeight={"light"} style={{ color: "white", marginTop: Spacing.tiny }}>
                        Picked at 6th August 00:00 UTC
                    </Text>
                </View>
            </Content>
        </View>
    </View>
);

const Header = ({ navigation }) => {
    const onPress = useCallback(() => navigation.goBack(), [navigation]);
    return (
        <FlexView
            style={{
                position: "absolute",
                top: StatusBar.currentHeight,
                height: 64,
                justifyContent: "flex-start",
                alignItems: "center"
            }}>
            <Icon
                type={"ionicon"}
                name={"md-close"}
                color={"transparent"}
                size={32}
                reverse={true}
                raised={true}
                onPress={onPress}
                containerStyle={{ elevation: 0 }}
            />
        </FlexView>
    );
};

const CoverImage = () => {
    const borderRadius = Spacing.normal;
    return (
        <Image
            source={require("../../assets/giveaway-cover.png")}
            resizeMode={"cover"}
            style={{
                width: "100%",
                height: "100%",
                borderBottomLeftRadius: borderRadius,
                borderBottomRightRadius: borderRadius
            }}
        />
    );
};

const TitleText = props => {
    return <Text {...props} h2={true} style={{ color: "white" }} />;
};

const Prizes = () => (
    <View>
        <CaptionText>PRIZES</CaptionText>
        <Prize color={"#FFD700"} rank={"1st"} amount={"$200 DAI"} />
        <Border />
        <Prize color={"#C0C0C0"} rank={"2nd"} amount={"$100 DAI"} />
        <Border />
        <Prize color={"#cd7f32"} rank={"3rd"} amount={"$33 DAI"} />
    </View>
);

const Prize = ({ color, rank, amount }) => (
    <FlexView style={{ alignItems: "center", marginVertical: Spacing.tiny }}>
        <Icon type={"ionicon"} name={"md-trophy"} color={color} size={22} reverse={true} />
        <View style={{ flex: 1, marginLeft: Spacing.small }}>
            <Text fontWeight={"bold"} medium={true}>
                {amount}
            </Text>
            <Text note={true}>1 winner</Text>
        </View>
        <Text style={{ color }}>{rank}</Text>
    </FlexView>
);

const Rules = () => {
    const { twitterAuth } = useContext(Context);
    const { twitter } = useTwitter();
    return (
        <View style={{ marginTop: Spacing.normal }}>
            <CaptionText>RULES</CaptionText>
            <Text light={true} style={{ marginBottom: Spacing.small }}>
                It's very easy to enter. Accomplish 3 tasks just by clicking them!
            </Text>
            <Rule title={"Follow @LevxApp twitter"} write={follow(twitter)} read={isFollowing(twitter, twitterAuth)} />
            <Rule title={"Retweet the giveaway tweet"} write={retweet(twitter)} read={hasRetweeted(twitter)} />
            <Rule
                title={"Turn on push notifications"}
                write={registerForPushNotifications}
                read={pushNotificationsRegistered}
            />
        </View>
    );
};

const Rule = ({ title, write, read }) => {
    const [loading, setLoading] = useState(true);
    const [done, setDone] = useState(false);
    const onPress = useCallback(async () => {
        setLoading(true);
        try {
            await write();
            setDone(true);
        } catch (e) {
            Alert.alert("Oops! :(", e.errors?.[0]?.message || "Please try again.");
        } finally {
            setLoading(false);
        }
    }, [write]);
    useEffect(() => {
        InteractionManager.runAfterInteractions(async () => {
            const response = await read();
            if (response) {
                setDone(true);
            }
            setLoading(false);
        });
    }, []);
    return (
        <View style={{ marginTop: Spacing.tiny, marginBottom: Spacing.small }}>
            <RuleButton title={title} loading={loading} onPress={onPress} done={done} />
        </View>
    );
};

const RuleButton = ({ title, loading, onPress, done }) => {
    const { green, textLight, textMedium, borderDark } = useColors();
    const iconName = done ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline";
    const iconColor = done ? green : borderDark;
    const textColor = done ? textLight : textMedium;
    const textDecorationLine = done ? "line-through" : undefined;
    return (
        <Button
            type={done ? "solid" : "clear"}
            size={"small"}
            title={title}
            disabled={done}
            loading={loading}
            loadingProps={{ color: green }}
            icon={{ type: "material-community", name: iconName, color: iconColor }}
            buttonStyle={{ justifyContent: loading ? "center" : "flex-start" }}
            titleStyle={{ color: textColor, marginLeft: Spacing.tiny, textDecorationLine }}
            onPress={onPress}
        />
    );
};

const FAQ = () => (
    <View style={{ marginTop: Spacing.normal }}>
        <CaptionText>WHAT'S NEXT?</CaptionText>
        <FAQCard question={"When to be announced?"} answer={"6th August"} />
        <FAQCard question={"Where is it announced?"} answer={"In this app :)"} />
        <FAQCard question={"How can I get notified?"} answer={"A push notification will be sent to you on that day."} />
        <FAQCard
            question={"Is it okay to delete the app?"}
            answer={"No. If you remove the app prior to the announcement, you don't have a method to be notified."}
        />
    </View>
);

const FAQCard = ({ question, answer }) => (
    <Card
        containerStyle={{
            borderRadius: Spacing.small,
            elevation: Spacing.tiny,
            marginHorizontal: -Spacing.tiny,
            marginTop: Spacing.small
        }}
        title={question}
        titleStyle={{ textAlign: "left" }}>
        <Text light={true}>{answer}</Text>
    </Card>
);

const Social = () => {
    const onPressTwitter = useCallback(() => Linking.openURL("https://twitter.com/LevxApp"), []);
    const onPressInstagram = useCallback(() => Linking.openURL("https://instagram.com/levx.app"), []);
    const onPressGithub = useCallback(() => Linking.openURL("https://github.com/lev-x"), []);
    return (
        <FlexView style={{ marginTop: Spacing.large, marginBottom: Spacing.huge, justifyContent: "center" }}>
            <SocialIcon type="github" onPress={onPressGithub} />
            <SocialIcon type="instagram" onPress={onPressInstagram} />
            <SocialIcon type="twitter" onPress={onPressTwitter} />
        </FlexView>
    );
};

const CaptionText = props => (
    <Text
        {...props}
        caption={true}
        light={true}
        fontWeight={"bold"}
        style={{ letterSpacing: 3, marginBottom: Spacing.tiny }}
    />
);

const Border = () => {
    const { border } = useColors();
    return <View style={{ height: 0.5, width: "100%", backgroundColor: border }} />;
};

const getGiveawayTweetId = async twitter => {
    const user = await twitter.get("users/show", {
        user_id: LEVX_TWITTER_ID
    });
    return user.location;
};

const follow = twitter => async () => {
    await twitter.post("friendships/create", {
        user_id: LEVX_TWITTER_ID,
        follow: "true"
    });
    Alert.alert("Follow", "You're following @LevxApp!");
};
const isFollowing = (twitter, twitterAuth) => async () => {
    const response = await twitter.get("friendships/show", {
        source_id: twitterAuth?.user_id,
        target_id: LEVX_TWITTER_ID
    });
    return response?.relationship?.source?.following || false;
};
const retweet = twitter => async () => {
    const tweetId = await getGiveawayTweetId(twitter);
    await twitter.post("statuses/retweet/" + tweetId, {});
    Alert.alert("Retweet", "You retweeted successfully!");
};
const hasRetweeted = twitter => async () => {
    const tweetId = await getGiveawayTweetId(twitter);
    const response = await twitter.get("statuses/show", {
        id: tweetId,
        include_my_retweet: "true"
    });
    return !!response?.current_user_retweet;
};

const pushNotificationsRegistered = async () => {
    return !!(await AsyncStorage.getItem("push_token"));
};

const registerForPushNotifications = async () => {
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            throw new Error("Failed to get push token for push notification!");
        }
        const token = await Notifications.getExpoPushTokenAsync();
        await AsyncStorage.setItem("push_token", JSON.stringify(token));
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#9BECEE"
            });
        }
        Alert.alert("Push Notifications", "Push notifications turned on!");
        return token;
    } else {
        throw new Error("Must use physical device for Push Notifications");
    }
};

export default GiveawayScreen;
