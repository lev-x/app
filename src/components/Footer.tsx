import React from "react";

import Constants from "expo-constants";
import Text from "./Text";

const Footer = ({ alignCenter = false }) => (
    <Text note={true} style={{ textAlign: alignCenter ? "center" : "left" }}>
        ©2020 Created by LevX Team (v{Constants.manifest.version})
    </Text>
);
export default Footer;
