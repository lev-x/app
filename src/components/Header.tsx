import React, { useCallback, useContext, useRef } from "react";
import { Image, View } from "react-native";
import { Icon } from "react-native-elements";
import Menu, { MenuItem } from "react-native-material-menu";

import Constants from "expo-constants";
import { Spacing } from "../constants/dimension";
import { Context } from "../context";
import useColors from "../hooks/useColors";

const Header = ({ navigation }) => {
    const { background, shadow } = useColors();
    return (
        <View
            style={{
                height: 64,
                justifyContent: "center",
                alignItems: "center",
                marginTop: Constants.statusBarHeight,
                paddingHorizontal: Spacing.content,
                elevation: Spacing.normal,
                shadowColor: shadow,
                shadowOffset: { width: Spacing.small, height: Spacing.small },
                shadowOpacity: 0.2,
                shadowRadius: Spacing.small,
                backgroundColor: background,
                zIndex: 100
            }}>
            <Image source={require("../../assets/logo-typography.png")} style={{ width: 102, height: 17.7 }} />
            <OverflowButton navigation={navigation} />
        </View>
    );
};

const OverflowButton = ({ navigation }) => {
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
                containerStyle={{ elevation: 0, position: "absolute", right: 0 }}
            />
            <View style={{ position: "absolute", right: 0 }}>
                <Menu ref={menuRef}>
                    <SignOutItem navigation={navigation} />
                </Menu>
            </View>
        </>
    );
};

const SignOutItem = ({ navigation }) => {
    const { clear } = useContext(Context);
    const onSignOut = useCallback(async () => {
        await clear();
        navigation.replace("Auth");
    }, [navigation]);
    return (
        <MenuItem textStyle={{ fontSize: 18 }} onPress={onSignOut}>
            Sign Out
        </MenuItem>
    );
};

export default Header;
