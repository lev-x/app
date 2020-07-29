import { useContext } from "react";

import { Colors } from "../constants/colors";
import { Context } from "../context";

const useColors = () => {
    const { darkMode } = useContext(Context);
    return {
        ...Colors[darkMode ? "dark" : "light"],
        ...Colors.common
    };
};

export default useColors;
