import "dotenv/config";

export default ({ config }) => {
    return {
        ...config,
        android: {
            ...config.android,
            versionCode: Number(process.env.ANDROID_VERSION_CODE)
        },
        ios: {
            ...config.ios,
            buildNumber: process.env.IOS_BUILD_NUMBER
        },
        extra: {
            twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
            twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET
        }
    };
};
