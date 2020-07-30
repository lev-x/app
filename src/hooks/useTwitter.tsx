import { useCallback, useContext } from "react";

import Constants from "expo-constants";
import Twitter from "twitter-lite";
import { Context } from "../context";

const useTwitter = () => {
    const { twitterAuth } = useContext(Context);
    const twitter = new Twitter({
        consumer_key: Constants.manifest.extra.twitterConsumerKey,
        consumer_secret: Constants.manifest.extra.twitterConsumerSecret,
        access_token_key: twitterAuth?.oauth_token || undefined,
        access_token_secret: twitterAuth?.oauth_token_secret || undefined
    });
    const getMe = useCallback(async () => {
        return await twitter.get("users/show", {
            user_id: twitterAuth?.user_id
        });
    }, [twitterAuth, twitter]);
    return { twitter, getMe };
};
export default useTwitter;
