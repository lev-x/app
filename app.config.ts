import "dotenv/config";

export default ({ config }) => {
    const { version, versionCode } = require("./version.json");
    return {
        ...config,
        version,
        android: {
            ...config.android,
            versionCode: Number(versionCode)
        },
        ios: {
            ...config.ios,
            buildNumber: String(versionCode)
        },
        extra: {
            twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
            twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET
        }
    };
};
