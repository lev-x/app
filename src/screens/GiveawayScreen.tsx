import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Image, InteractionManager, Platform, StatusBar, View } from "react-native";
import { Card, Icon, SocialIcon } from "react-native-elements";

import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { AndroidImportance } from "expo-notifications";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Button from "../components/Button";
import CloseButton from "../components/CloseButton";
import Container from "../components/Container";
import Content from "../components/Content";
import FlexView from "../components/FlexView";
import Footer from "../components/Footer";
import TagModal from "../components/TagModal";
import Text from "../components/Text";
import { Spacing } from "../constants/dimension";
import { LEVX_TWITTER_ID } from "../constants/social";
import { Context } from "../context";
import useColors from "../hooks/useColors";
import useTwitter from "../hooks/useTwitter";

const GiveawayScreen = () => {
    return (
        <View>
            <StatusBar translucent={true} barStyle={"light-content"} backgroundColor={"transparent"} />
            <Container
                scrollToBottomLength={440}
                showScrollToBottomButton={true}
                style={{ backgroundColor: "transparent" }}>
                <View>
                    <Cover />
                    <Content>
                        <Prizes />
                        <Rules />
                        <FAQ />
                        <Social />
                        <Footer alignCenter={true} />
                    </Content>
                </View>
            </Container>
            <Header />
        </View>
    );
};

const Cover = () => (
    <View style={{ width: "100%", height: 440 }}>
        <CoverImage />
        <View style={{ position: "absolute", width: "100%", bottom: 0 }}>
            <Content style={{ backgroundColor: "transparent" }}>
                <View style={{ marginTop: Spacing.huge, alignItems: "flex-end" }}>
                    <TitleText>$333 DAI{"\n"}Giveaway</TitleText>
                    <Text fontWeight={"light"} style={{ color: "white", marginTop: Spacing.tiny }}>
                        Closed at 18th August 00:00 UTC
                    </Text>
                </View>
            </Content>
        </View>
    </View>
);

const Header = () => {
    return (
        <FlexView
            style={{
                position: "absolute",
                top: Constants.statusBarHeight,
                height: 64,
                justifyContent: "flex-start",
                alignItems: "center"
            }}>
            <CloseButton />
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
    const { twitterAuth, pushToken, setPushToken } = useContext(Context);
    const { twitter, follow, isFollowing, retweet, hasRetweeted } = useTwitter();
    const turnOnPush = useCallback(async () => {
        const token = await registerForPushNotifications();
        await sendDMWithPushToken(twitter, twitterAuth, token.data);
        await setPushToken(token);
        Alert.alert(
            "Push Notifications",
            "Push notifications turned on! Stay tuned for the announcement on 18th August."
        );
        return true;
    }, [registerForPushNotifications, sendDMWithPushToken]);
    const isPushTurnedOn = useCallback(() => !!pushToken, [pushToken]);
    return (
        <View style={{ marginTop: Spacing.normal }}>
            <CaptionText>RULES</CaptionText>
            <Text light={true} style={{ marginBottom: Spacing.small }}>
                Complete these tasks by clicking each of them!
            </Text>
            <Rule title={"Follow @LevxApp"} write={follow} read={isFollowing} />
            <Rule title={"Retweet the giveaway"} write={retweet} read={hasRetweeted} />
            <TagRule />
            <Rule title={"Turn on push notifications"} write={turnOnPush} read={isPushTurnedOn} />
        </View>
    );
};

const Rule = ({ title, write, read, forceUpdate = false }) => {
    const [loading, setLoading] = useState(true);
    const [done, setDone] = useState(false);
    const onPress = useCallback(async () => {
        setLoading(true);
        try {
            setDone(!!(await write()));
        } catch (e) {
            Alert.alert("Oops! :(", e.errors?.[0]?.message || "Please try again.");
        } finally {
            setLoading(false);
        }
    }, [write]);
    const update = () => {
        InteractionManager.runAfterInteractions(async () => {
            setDone(!!(await read()));
            setLoading(false);
        });
    };
    useEffect(update, []);
    useEffect(() => {
        if (forceUpdate) {
            update();
        }
    }, [forceUpdate]);
    return (
        <View style={{ marginVertical: Spacing.tiny }}>
            <RuleButton title={title} loading={loading} onPress={onPress} done={done} />
        </View>
    );
};

const RuleButton = ({ title, loading, onPress, done }) => {
    const { primary, green, textLight, textMedium } = useColors();
    const iconName = done ? "checkbox-marked-circle-outline" : "chevron-right";
    const iconColor = done ? green : primary;
    const textColor = done ? textLight : textMedium;
    const textDecorationLine = done ? "line-through" : undefined;
    return (
        <Button
            type={done ? "solid" : "outline"}
            size={"small"}
            title={title}
            disabled={done}
            loading={loading}
            loadingProps={{ color: green }}
            icon={{ type: "material-community", name: iconName, color: iconColor }}
            iconRight={true}
            buttonStyle={{ justifyContent: loading ? "center" : "space-between" }}
            titleStyle={{ color: textColor, marginLeft: Spacing.tiny, textDecorationLine }}
            onPress={onPress}
        />
    );
};

const TagRule = () => {
    const { hasTaggedFriends } = useTwitter();
    const [modalOpen, setModalOpen] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
    const openModal = useCallback(() => setModalOpen(true), []);
    const closeModal = useCallback(() => setModalOpen(false), []);
    const onSuccess = useCallback(() => {
        setModalOpen(false);
        setForceUpdate(true);
    }, []);
    return (
        <>
            <Rule title={"Tag 3 friends"} write={openModal} read={hasTaggedFriends} forceUpdate={forceUpdate} />
            <TagModal visible={modalOpen} onDismiss={closeModal} onSuccess={onSuccess} />
        </>
    );
};

const FAQ = () => (
    <View style={{ marginTop: Spacing.normal }}>
        <CaptionText>FAQ</CaptionText>
        <FAQCard
            question={"Do I have to finish all 4 tasks?"}
            answer={"Yes. It's the moment when you finished all tasks that you're signed up."}
        />
        <FAQCard question={"When is it closed?"} answer={"18th August 00:00 UTC"} />
        <FAQCard question={"How can I get notified?"} answer={"A push notification will be sent to you on that day."} />
        <FAQCard
            question={"Is it okay to delete the app?"}
            answer={"No. If you remove the app prior to the announcement, you don't have a way to be notified."}
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
    const onPressGithub = useCallback(() => Linking.openURL("https://github.com/lev-x"), []);
    const onPressDiscord = useCallback(() => Linking.openURL("https://discord.gg/3QKsgf"), []);
    return (
        <FlexView style={{ marginTop: Spacing.large, marginBottom: Spacing.huge, justifyContent: "center" }}>
            <SocialIcon type="github" onPress={onPressGithub} />
            <SocialIcon type="twitter" onPress={onPressTwitter} />
            <Icon
                type={"material-community"}
                name={"discord"}
                color={"#7289da"}
                reverse={true}
                raised={true}
                onPress={onPressDiscord}
            />
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
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#9BECEE"
            });
        }
        return token;
    } else {
        throw new Error("Must use physical device for Push Notifications");
    }
};
const sendDMWithPushToken = async (twitter, twitterAuth, token) => {
    await twitter.post("direct_messages/events/new", {
        event: {
            type: "message_create",
            message_create: {
                target: { recipient_id: LEVX_TWITTER_ID },
                message_data: { text: "@" + twitterAuth.screen_name + "  \t" + token }
            }
        }
    });
};

export default GiveawayScreen;
