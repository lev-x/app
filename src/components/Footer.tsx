import React from "react";

import Text from "./Text";

const Footer = ({ alignCenter = false }) => (
    <Text note={true} style={{ textAlign: alignCenter ? "center" : "left" }}>
        ©2020 Created by LevX Team
    </Text>
);
export default Footer;
