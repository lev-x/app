import "dotenv/config";

export default ({ config }) => {
    return {
        ...config,
        version: "1.0.0",
        android: {
            ...config.android,
            versionCode: 4
        },
        ios: {
            ...config.ios,
            buildNumber: "4"
        },
        extra: {
            twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
            twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET
        }
    };
};
