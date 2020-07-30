import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, AlertButton, Image, View } from "react-native";
import { Card, Input, Overlay } from "react-native-elements";

import useAsyncEffect from "use-async-effect";
import { SCREEN_HEIGHT, Spacing } from "../constants/dimension";
import { GIVEAWAY_TAG_MSG } from "../constants/social";
import useColors from "../hooks/useColors";
import useTwitter from "../hooks/useTwitter";
import Button from "./Button";
import CloseButton from "./CloseButton";
import Container from "./Container";
import FlexView from "./FlexView";
import Text from "./Text";

const TagModal = ({ visible, onDismiss, onSuccess }) => {
    return (
        <Overlay
            isVisible={visible}
            onDismiss={onDismiss}
            onBackdropPress={onDismiss}
            statusBarTranslucent={true}
            fullScreen={true}
            animationType={"slide"}
            animated={true}
            hardwareAccelerated={true}
            overlayStyle={{ backgroundColor: "transparent", padding: 0, justifyContent: "flex-end" }}>
            <View>
                <TagCard onSuccess={onSuccess} />
                <CloseButton style={{ position: "absolute", top: 120, right: 0, margin: 24 }} onPress={onDismiss} />
            </View>
        </Overlay>
    );
};

const TagCard = ({ onSuccess }) => {
    const { getMe } = useTwitter();
    const [me, setMe] = useState({} as any);
    const [account0, setAccount0] = useState("" as string);
    const [account1, setAccount1] = useState("" as string);
    const [account2, setAccount2] = useState("" as string);
    const accounts = [account0, account1, account2];
    const disabled = !accounts.every(a => a.length > 0);
    useAsyncEffect(async () => setMe(await getMe()), []);
    return (
        <Card
            title={"Tag 3 Friends"}
            titleStyle={{ fontSize: 22 }}
            containerStyle={{
                borderTopLeftRadius: Spacing.large,
                borderTopRightRadius: Spacing.large,
                marginTop: Spacing.huge * 2,
                marginHorizontal: 0,
                padding: Spacing.normal,
                height: SCREEN_HEIGHT - 120
            }}>
            <Container>
                {/* tslint:disable-next-line:jsx-no-lambda */}
                <TagInput index={0} onType={setAccount0} onNext={() => {}} />
                {/* tslint:disable-next-line:jsx-no-lambda */}
                <TagInput index={1} onType={setAccount1} onNext={() => {}} />
                <TagInput index={2} onType={setAccount2} />
                <TagTweet me={me} accounts={[account0, account1, account2]} />
                <Actions me={me} accounts={accounts} disabled={disabled} onSuccess={onSuccess} />
            </Container>
        </Card>
    );
};

const TagInput = ({ index, onType, onNext = null as (() => void) | null }) => {
    const { twitter } = useColors();
    const [error, setError] = useState("");
    const onChangeText = useCallback((text: string) => {
        text = text.trim();
        if (!text.match("^@?(\\w){1,15}$")) {
            setError("Invalid account");
        }
        onType(text);
    }, []);
    return (
        <Input
            leftIcon={{ type: "material-community", name: "at", size: 18, color: twitter }}
            containerStyle={{ width: "100%", paddingHorizontal: 0 }}
            inputStyle={{ color: twitter }}
            onChangeText={onChangeText}
            label={"Friend " + (index + 1)}
            errorMessage={error}
            autoCapitalize={"none"}
            autoCompleteType={"off"}
            autoFocus={index === 0}
            returnKeyType={onNext ? "next" : "done"}
        />
    );
};

const TagTweet = ({ accounts, me }) => {
    const { primary, twitter: twitterColor } = useColors();
    return (
        <View>
            <Text note={true} style={{ marginBottom: Spacing.small }}>
                We'll tweet on behalf of you as such:
            </Text>
            <Card containerStyle={{ margin: 0 }}>
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
                            {GIVEAWAY_TAG_MSG}
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

const Actions = ({ me, accounts, disabled, onSuccess }) => {
    const { tagFriends } = useTwitter();
    const [loading, setLoading] = useState(false);
    const okButton: AlertButton = { onPress: onSuccess, style: "default", text: "OK" };
    const onTag = useCallback(async () => {
        if (validateAccounts(me, accounts)) {
            setLoading(true);
            try {
                await tagFriends(accounts);
                Alert.alert("Tag 3 friends", "You tagged 3 friends successfully!", [okButton]);
            } catch (e) {
                Alert.alert("Oops! :(", e.errors?.[0]?.message || "Please try again.");
            } finally {
                setLoading(false);
            }
        }
    }, [accounts, tagFriends, onSuccess]);
    return (
        <Button
            title={"Tweet"}
            onPress={onTag}
            disabled={disabled}
            loading={loading}
            containerStyle={{
                marginTop: Spacing.small,
                marginBottom: Spacing.huge * 4
            }}
        />
    );
};

const validateAccounts = (me, accounts) => {
    if (!accounts.every(a => a.length > 0)) {
        Alert.alert("Tag 3 Friends", "Fill in 3 accounts");
    } else if (
        accounts[0].toLowerCase() === accounts[1].toLowerCase() ||
        accounts[1].toLowerCase() === accounts[2].toLowerCase() ||
        accounts[0].toLowerCase() === accounts[2].toLowerCase()
    ) {
        Alert.alert("Tag 3 Friends", "Duplicate accounts not allowed");
    } else if (!accounts.every(a => a.toLowerCase() !== me.screen_name.toLowerCase())) {
        Alert.alert("Tag 3 Friends", "You can't tag yourself");
    } else if (!accounts.every(a => a.toLowerCase() !== "LevxApp".toLowerCase())) {
        Alert.alert("Tag 3 Friends", "You can't tag @LevxApp");
    } else {
        return true;
    }
};

export default TagModal;
