import { Dimensions } from "react-native";

export const Spacing = {
    tiny: 8,
    small: 16,
    normal: 32,
    large: 48,
    huge: 64,
    content: 40
};

export const SCREEN_WIDTH = Math.round(Dimensions.get("window").width);
export const SCREEN_HEIGHT = Math.round(Dimensions.get("window").height);
