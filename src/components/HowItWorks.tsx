"use client";

import { useTheme } from "@/context/ThemeContext";
import HowItWorksNeo from "./HowItWorksNeo";
import HowItWorksSwiss from "./HowItWorksSwiss";
import HowItWorksSoft from "./HowItWorksSoft";

export default function HowItWorks() {
    const { theme } = useTheme();

    if (theme === "swiss") {
        return <HowItWorksSwiss />;
    }

    if (theme === "soft") {
        return <HowItWorksSoft />;
    }

    return <HowItWorksNeo />;
}
