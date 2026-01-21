"use client";

import { useTheme } from "@/context/ThemeContext";
import VibeCalculatorNeo from "./VibeCalculatorNeo";
import VibeCalculatorSwiss from "./VibeCalculatorSwiss";
import VibeCalculatorSoft from "./VibeCalculatorSoft";

export default function VibeCalculator() {
    const { theme } = useTheme();

    if (theme === "swiss") {
        return <VibeCalculatorSwiss />;
    }

    if (theme === "soft") {
        return <VibeCalculatorSoft />;
    }

    return <VibeCalculatorNeo />;
}
