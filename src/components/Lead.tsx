import React, { FC, ReactNode } from "react";
import { View } from "react-native";

import { Spacing } from "../constants/dimension";
import Text from "./Text";

export interface LeadProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
}

const Lead: FC<LeadProps> = props => (
    <View style={{ marginBottom: Spacing.small }}>
        <Text h2={true}>{props.title}</Text>
        {props.subtitle && (
            <Text h3={true} fontWeight={"light"} medium={true}>
                {props.subtitle}
            </Text>
        )}
        {props.children && (
            <Text medium={true} style={{ marginTop: Spacing.small }}>
                {props.children}
            </Text>
        )}
    </View>
);

export default Lead;
