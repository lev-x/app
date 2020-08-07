import React, { FC, useCallback, useContext, useRef } from "react";
import { Image, View } from "react-native";
import { Icon } from "react-native-elements";
import Menu, { MenuItem } from "react-native-material-menu";

import { StackActions, useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { HEADER_HEIGHT, Spacing } from "../constants/dimension";
import { Context } from "../context";
import useColors from "../hooks/useColors";

export interface HeaderProps {
    type?: "raised" | "clear";
    hideTitle?: boolean;
    hideBackButton?: boolean;
    hideOverflowButton?: boolean;
}

const Header: FC<HeaderProps> = props => {
    const { background, shadow } = useColors();
    const type = props.type || "raised";
    return (
        <View
            style={{
                height: HEADER_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
                marginTop: Constants.statusBarHeight,
                paddingHorizontal: Spacing.content,
                ...(type === "raised"
                    ? {
                          elevation: Spacing.normal,
                          shadowColor: shadow,
                          shadowOffset: { width: Spacing.small, height: Spacing.small },
                          shadowOpacity: 0.2,
                          shadowRadius: Spacing.small,
                          backgroundColor: background,
                          zIndex: 100
                      }
                    : {})
            }}>
            {!props.hideTitle && (
                <Image source={require("../../assets/logo-typography.png")} style={{ width: 102, height: 17.7 }} />
            )}
            {!props.hideBackButton && <BackButton />}
            {!props.hideOverflowButton && <OverflowButton />}
        </View>
    );
};

const BackButton = () => {
    const { textLight } = useColors();
    const navigation = useNavigation();
    const onPress = useCallback(() => {
        navigation.goBack();
    }, []);
    return (
        <>
            <Icon
                type={"ionicon"}
                name={"ios-arrow-back"}
                color={textLight}
                raised={true}
                onPress={onPress}
                containerStyle={{ elevation: 0, position: "absolute", left: 0, shadowOpacity: 0 }}
            />
        </>
    );
};

const OverflowButton = () => {
    const { textLight } = useColors();
    const menuRef = useRef<Menu>();
    const onOpen = useCallback(() => {
        if (menuRef.current) {
            menuRef.current.show();
        }
    }, [menuRef]);
    return (
        <>
            <Icon
                type={"ionicon"}
                name={"md-more"}
                color={textLight}
                raised={true}
                onPress={onOpen}
                containerStyle={{ elevation: 0, position: "absolute", right: 0, shadowOpacity: 0 }}
            />
            <View style={{ position: "absolute", right: 0 }}>
                <Menu ref={menuRef}>
                    <SignOutItem />
                </Menu>
            </View>
        </>
    );
};

const SignOutItem = () => {
    const { clear } = useContext(Context);
    const navigation = useNavigation();
    const onSignOut = useCallback(async () => {
        await clear();
        navigation.dispatch(StackActions.replace("Auth"));
    }, [navigation]);
    return (
        <MenuItem textStyle={{ fontSize: 18 }} onPress={onSignOut}>
            Sign Out
        </MenuItem>
    );
};

export default Header;
