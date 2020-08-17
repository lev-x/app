import { useCallback, useContext } from "react";
import { Platform } from "react-native";

import Constants from "expo-constants";
import { AndroidImportance } from "expo-notifications";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { LEVX_TWITTER_ID } from "../constants/social";
import { Context } from "../context";
import useTwitter from "./useTwitter";

const usePushNotifications = () => {
    const { twitterAuth, pushToken, setPushToken } = useContext(Context);
    const { twitter } = useTwitter();
    const turnOn = useCallback(
        async onSuccess => {
            const token = await registerForPushNotifications();
            await sendDMWithPushToken(twitter, twitterAuth, token.data);
            await setPushToken(token);
            onSuccess?.();
            return true;
        },
        [registerForPushNotifications, sendDMWithPushToken]
    );
    return { pushToken, turnOn };
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

export default usePushNotifications;
