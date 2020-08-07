import React, { useCallback, useState } from "react";

import useColors from "../hooks/useColors";
import Button from "./Button";

const SignInWithFacebookButton = ({ onSuccess, onError }) => {
    const { facebook } = useColors();
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
            title={"Sign in with Facebook"}
            icon={{ type: "material-community", name: "facebook", color: "white", size: 24 }}
            buttonStyle={{ justifyContent: "space-between" }}
            iconRight={true}
            size={"small"}
            color={facebook}
            loading={loading}
            onPress={onPress}
        />
    );
};

export default SignInWithFacebookButton;
