import "dotenv/config";

export default ({ config }) => {
    return {
        ...config,
        android: {
            ...config.android,
            version: "1.0.0",
            versionCode: 3
        },
        ios: {
            ...config.ios,
            version: "1.0.0",
            buildNumber: "3"
        },
        extra: {
            twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
            twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET
        }
    };
};
