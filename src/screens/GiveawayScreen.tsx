import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, InteractionManager, Platform, StatusBar, View } from "react-native";
import { Card, Icon, Input, Overlay, SocialIcon } from "react-native-elements";

import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { AndroidImportance } from "expo-notifications";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import useAsyncEffect from "use-async-effect";
import Button from "../components/Button";
import Container from "../components/Container";
import Content from "../components/Content";
import FlexView from "../components/FlexView";
import Footer from "../components/Footer";
import Text from "../components/Text";
import { SCREEN_WIDTH, Spacing } from "../constants/dimension";
import { Context } from "../context";
import useColors from "../hooks/useColors";
import useTwitter from "../hooks/useTwitter";

const LEVX_TWITTER_ID = "1187725084066103298";
const REPLY_MESSAGE = "$333 DAI giveaway. Enter now!";

const GiveawayScreen = ({ navigation }) => {
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
            <Header navigation={navigation} />
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
                        Picked at 7th August 00:00 UTC
                    </Text>
                </View>
            </Content>
        </View>
    </View>
);

const Header = ({ navigation }) => {
    const { disabled } = useColors();
    const onPress = useCallback(() => navigation.goBack(), [navigation]);
    return (
        <FlexView
            style={{
                position: "absolute",
                top: Constants.statusBarHeight,
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
                reverseColor={disabled}
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
    const { twitterAuth, pushToken, setPushToken } = useContext(Context);
    const { twitter } = useTwitter();
    const turnOnPush = useCallback(async () => {
        const token = await registerForPushNotifications();
        await sendDMWithPushToken(twitter, twitterAuth, token.data);
        await setPushToken(token);
        Alert.alert("Push Notifications", "Push notifications turned on!");
        return true;
    }, [registerForPushNotifications, sendDMWithPushToken]);
    const isPushTurnedOn = useCallback(() => !!pushToken, [pushToken]);
    return (
        <View style={{ marginTop: Spacing.normal }}>
            <CaptionText>RULES</CaptionText>
            <Text light={true} style={{ marginBottom: Spacing.small }}>
                Complete these tasks by clicking each of them!
            </Text>
            <Rule title={"Follow @LevxApp"} write={follow(twitter)} read={isFollowing(twitter, twitterAuth)} />
            <Rule title={"Retweet the giveaway"} write={retweet(twitter)} read={hasRetweeted(twitter)} />
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
    const { twitterAuth } = useContext(Context);
    const { twitter } = useTwitter();
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
            <Rule
                title={"Tag 3 friends"}
                write={openModal}
                read={hasTaggedFriends(twitter, twitterAuth?.user_id)}
                forceUpdate={forceUpdate}
            />
            <TagModal visible={modalOpen} onDismiss={closeModal} onSuccess={onSuccess} />
        </>
    );
};

const TagModal = ({ visible, onDismiss, onSuccess }) => {
    const { twitter, getMe } = useTwitter();
    const [me, setMe] = useState({} as any);
    const [account0, setAccount0] = useState("" as string);
    const [account1, setAccount1] = useState("" as string);
    const [account2, setAccount2] = useState("" as string);
    const accounts = [account0, account1, account2];
    const disabled = !accounts.every(a => a.length > 0);
    useAsyncEffect(async () => setMe(await getMe()), []);
    return (
        <Overlay
            isVisible={visible}
            onDismiss={onDismiss}
            onBackdropPress={onDismiss}
            statusBarTranslucent={true}
            overlayStyle={{ width: SCREEN_WIDTH, backgroundColor: "transparent" }}>
            <Card
                title={"Tag 3 Friends"}
                titleStyle={{ fontSize: 22 }}
                containerStyle={{
                    borderRadius: Spacing.small
                }}>
                <TagInput index={0} onComplete={setAccount0} />
                <TagInput index={1} onComplete={setAccount1} />
                <TagInput index={2} onComplete={setAccount2} />
                <TagTweet me={me} accounts={[account0, account1, account2]} />
                <Actions onCancel={onDismiss} onOk={tagFriends(twitter, me, accounts, onSuccess)} disabled={disabled} />
            </Card>
        </Overlay>
    );
};

const TagInput = ({ index, onComplete }) => {
    const { twitter } = useColors();
    const [error, setError] = useState("");
    const onChangeText = useCallback((text: string) => {
        text = text.trim();
        if (!text.match("^@?(\\w){1,15}$")) {
            setError("Invalid account");
        }
        onComplete(text);
    }, []);
    return (
        <Input
            leftIcon={{ type: "material-community", name: "at", size: 18, color: twitter }}
            labelStyle={{ fontSize: 13 }}
            containerStyle={{ width: "100%" }}
            inputContainerStyle={{ height: 28 }}
            inputStyle={{ fontSize: 18, minHeight: 28, color: twitter }}
            errorStyle={{ fontSize: 13 }}
            onChangeText={onChangeText}
            label={"Friend " + (index + 1)}
            errorMessage={error}
            autoCapitalize={"none"}
            autoCompleteType={"off"}
            autoFocus={index === 0}
        />
    );
};

const TagTweet = ({ accounts, me }) => {
    const { primary, twitter: twitterColor } = useColors();
    return (
        <View>
            <Text note={true} style={{ marginHorizontal: Spacing.small }}>
                We'll tweet on behalf of you as such:
            </Text>
            <Card>
                {me ? (
                    <View>
                        <TwitterBio me={me} />
                        <FlexView style={{ marginVertical: Spacing.tiny }}>
                            <Text note={true}>Replying to </Text>
                            <Text note={true} style={{ color: twitterColor }}>
                                @LevxApp
                            </Text>
                        </FlexView>
                        <Text medium={true} style={{ fontSize: 15, marginVertical: Spacing.tiny }}>
                            {REPLY_MESSAGE}
                        </Text>
                        {!accounts.every(account => !account) && (
                            <Text style={{ color: twitterColor }}>{accounts.map(account => "@" + account + " ")}</Text>
                        )}
                    </View>
                ) : (
                    <ActivityIndicator color={primary} />
                )}
            </Card>
        </View>
    );
};

const TwitterBio = ({ me }) => {
    return (
        <FlexView>
            <Image
                source={{ uri: me.profile_image_url_https }}
                style={{ width: 36, height: 36, borderRadius: 18, marginRight: Spacing.tiny }}
            />
            <View>
                <Text fontWeight={"bold"} style={{ fontSize: 15 }}>
                    {me.name}
                </Text>
                <Text light={true} style={{ fontSize: 15 }}>
                    @{me.screen_name}
                </Text>
            </View>
        </FlexView>
    );
};

const Actions = ({ onCancel, onOk, disabled }) => {
    const { primary, textLight } = useColors();
    return (
        <FlexView style={{ justifyContent: "flex-end", padding: Spacing.tiny }}>
            <Button
                size={"small"}
                type={"clear"}
                title={"Cancel"}
                titleStyle={{ color: textLight }}
                onPress={onCancel}
            />
            <Button
                size={"small"}
                type={"clear"}
                title={"OK"}
                titleStyle={{ color: primary }}
                onPress={onOk}
                disabled={disabled}
            />
        </FlexView>
    );
};

const FAQ = () => (
    <View style={{ marginTop: Spacing.normal }}>
        <CaptionText>FAQ</CaptionText>
        <FAQCard question={"When to be announced?"} answer={"7th August"} />
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
const getDownloadURL = async twitter => {
    const user = await twitter.get("users/show", {
        user_id: LEVX_TWITTER_ID
    });
    return user.url;
};
const getTimeline = async (twitter, userId) => {
    return await twitter.get("statuses/user_timeline", {
        user_id: userId,
        count: 200
    });
};

const follow = twitter => async () => {
    await twitter.post("friendships/create", {
        user_id: LEVX_TWITTER_ID,
        follow: "true"
    });
    Alert.alert("Follow", "You're following @LevxApp!");
    return true;
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
    return true;
};
const hasRetweeted = twitter => async () => {
    const tweetId = await getGiveawayTweetId(twitter);
    const response = await twitter.get("statuses/show", {
        id: tweetId,
        include_my_retweet: "true"
    });
    return !!response?.current_user_retweet;
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
const hasTaggedFriends = (twitter, userId) => async () => {
    const tweetId = await getGiveawayTweetId(twitter);
    const timeline = await getTimeline(twitter, userId);
    for (const tweet of timeline) {
        if (tweet.in_reply_to_status_id_str === tweetId) {
            return true;
        }
    }
    return false;
};
const tagFriends = (twitter, me, accounts, onSuccess) => async () => {
    if (!accounts.every(a => a.length > 0)) {
        Alert.alert("Tag 3 friends", "Fill in 3 accounts");
    } else if (
        accounts[0].toLowerCase() === accounts[1].toLowerCase() ||
        accounts[1].toLowerCase() === accounts[2].toLowerCase() ||
        accounts[0].toLowerCase() === accounts[2].toLowerCase()
    ) {
        Alert.alert("Tag 3 friends", "Duplicate accounts not allowed");
    } else if (!accounts.every(a => a.toLowerCase() !== me.screen_name.toLowerCase())) {
        Alert.alert("Tag 3 friends", "You can't tag yourself");
    } else if (!accounts.every(a => a.toLowerCase() !== "LevxApp".toLowerCase())) {
        Alert.alert("Tag 3 friends", "You can't tag @LevxApp");
    } else {
        const tweetId = await getGiveawayTweetId(twitter);
        const downloadURL = await getDownloadURL(twitter);
        const status =
            REPLY_MESSAGE + "\n" + accounts.map(account => "@" + account + " ").join("") + "\n\n" + downloadURL;
        await twitter.post("statuses/update", {
            status,
            in_reply_to_status_id: tweetId,
            auto_populate_reply_metadata: "true"
        });
        onSuccess?.();
        setTimeout(() => Alert.alert("Tag 3 friends", "You tagged 3 friends successfully!"), 500);
    }
};

export default GiveawayScreen;
