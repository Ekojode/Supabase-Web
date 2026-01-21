"use client";

import { useTheme } from "@/context/ThemeContext";
import ChillGrindToggleNeo from "./ChillGrindToggleNeo";
import ChillGrindToggleSwiss from "./ChillGrindToggleSwiss";
import ChillGrindToggleSoft from "./ChillGrindToggleSoft";

export default function ChillGrindToggle() {
    const { theme } = useTheme();

    if (theme === "swiss") {
        return <ChillGrindToggleSwiss />;
    }

    if (theme === "soft") {
        return <ChillGrindToggleSoft />;
    }

    return <ChillGrindToggleNeo />;
}
