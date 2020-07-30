import { useCallback, useContext } from "react";
import { Alert } from "react-native";

import Constants from "expo-constants";
import Twitter from "twitter-lite";
import { GIVEAWAY_TAG_MSG, LEVX_TWITTER_ID } from "../constants/social";
import { Context } from "../context";

// tslint:disable-next-line:max-func-body-length
const useTwitter = () => {
    const { twitterAuth } = useContext(Context);
    const twitter = new Twitter({
        consumer_key: Constants.manifest.extra.twitterConsumerKey,
        consumer_secret: Constants.manifest.extra.twitterConsumerSecret,
        access_token_key: twitterAuth?.oauth_token || undefined,
        access_token_secret: twitterAuth?.oauth_token_secret || undefined
    });
    const getMe = useCallback(
        async () =>
            await twitter.get("users/show", {
                user_id: twitterAuth?.user_id
            }),
        [twitterAuth, twitter]
    );
    const getGiveawayTweetId = useCallback(async () => {
        const user = await twitter.get("users/show", {
            user_id: LEVX_TWITTER_ID
        });
        return user.location;
    }, [twitter]);
    const getDownloadURL = useCallback(async () => {
        const user = await twitter.get("users/show", {
            user_id: LEVX_TWITTER_ID
        });
        return user.url;
    }, [twitter]);
    const getTimeline = useCallback(
        async userId =>
            await twitter.get("statuses/user_timeline", {
                user_id: userId,
                count: 200
            }),
        [twitter]
    );
    const postUpdate = useCallback(async (body: object) => await twitter.post("statuses/update", body), [twitter]);
    const follow = useCallback(async () => {
        await twitter.post("friendships/create", {
            user_id: LEVX_TWITTER_ID,
            follow: "true"
        });
        Alert.alert("Follow", "You're following @LevxApp!");
        return true;
    }, [twitter]);
    const isFollowing = useCallback(async () => {
        const response = await twitter.get("friendships/show", {
            source_id: twitterAuth?.user_id,
            target_id: LEVX_TWITTER_ID
        });
        return response?.relationship?.source?.following || false;
    }, [twitter, twitterAuth]);
    const retweet = useCallback(async () => {
        const tweetId = await getGiveawayTweetId();
        await twitter.post("statuses/retweet/" + tweetId, {});
        Alert.alert("Retweet", "You retweeted successfully!");
        return true;
    }, [getGiveawayTweetId]);
    const hasRetweeted = useCallback(async () => {
        const tweetId = await getGiveawayTweetId();
        const response = await twitter.get("statuses/show", {
            id: tweetId,
            include_my_retweet: "true"
        });
        return !!response?.current_user_retweet;
    }, [getGiveawayTweetId, twitter]);
    const tagFriends = useCallback(async friends => {
        const tweetId = await getGiveawayTweetId();
        const downloadURL = await getDownloadURL();
        const status =
            GIVEAWAY_TAG_MSG + "\n" + friends.map(account => "@" + account + " ").join("") + "\n\n" + downloadURL;
        await postUpdate({ status, in_reply_to_status_id: tweetId, auto_populate_reply_metadata: "true" });
    }, []);
    const hasTaggedFriends = useCallback(async () => {
        const tweetId = await getGiveawayTweetId();
        const timeline = await getTimeline(twitterAuth?.user_id);
        for (const tweet of timeline) {
            if (tweet.in_reply_to_status_id_str === tweetId) {
                return true;
            }
        }
        return false;
    }, [getGiveawayTweetId, getTimeline, twitterAuth]);
    return {
        twitter,
        getMe,
        getGiveawayTweetId,
        getDownloadURL,
        getTimeline,
        postUpdate,
        follow,
        isFollowing,
        retweet,
        hasRetweeted,
        tagFriends,
        hasTaggedFriends
    };
};
export default useTwitter;
