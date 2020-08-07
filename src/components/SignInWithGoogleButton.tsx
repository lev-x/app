import React, { useCallback, useState } from "react";

import useColors from "../hooks/useColors";
import Button from "./Button";
import SvgGoogle from "./SvgGoogle";

const SignInWithGoogleButton = ({ onSuccess, onError }) => {
    const { textMedium } = useColors();
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
            title={"Sign in with Google"}
            // @ts-ignore
            icon={{ Component: () => <SvgGoogle width={18} height={18} /> }}
            buttonStyle={{ justifyContent: "space-between" }}
            titleStyle={{ color: textMedium }}
            type={"outline"}
            iconRight={true}
            size={"small"}
            loading={loading}
            onPress={onPress}
        />
    );
};

export default SignInWithGoogleButton;
