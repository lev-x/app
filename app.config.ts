import "dotenv/config";

export default ({ config }) => {
    return {
        ...config,
        extra: {
            twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
            twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET
        }
    };
};
