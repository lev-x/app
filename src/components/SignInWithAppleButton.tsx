import React, { useCallback, useState } from "react";

import Button from "./Button";

const SignInWithAppleButton = ({ onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);
    const onPress = useCallback(async () => {
        try {
            onSuccess();
        } catch (e) {
            onError(e);
        }
    }, []);
    return (
        <Button
            title={"Sign in with Apple"}
            icon={{ type: "material-community", name: "apple", color: "white", size: 24 }}
            buttonStyle={{ justifyContent: "space-between" }}
            titleStyle={{ color: "white" }}
            type={"solid"}
            iconRight={true}
            size={"small"}
            color={"black"}
            loading={loading}
            onPress={onPress}
        />
    );
};

export default SignInWithAppleButton;
