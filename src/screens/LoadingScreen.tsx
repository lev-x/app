import React from "react";
import { ActivityIndicator } from "react-native";

import Content from "../components/Content";
import useColors from "../hooks/useColors";

const LoadingScreen = () => {
    const { primary } = useColors();
    return (
        <Content style={{ width: "100%", height: "100%", justifyContent: "center", alignContent: "center" }}>
            <ActivityIndicator size={"large"} color={primary} />
        </Content>
    );
};

export default LoadingScreen;
