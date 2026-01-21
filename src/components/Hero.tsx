"use client";

import { useTheme } from "@/context/ThemeContext";
import HeroNeo from "./HeroNeo";
import HeroSwiss from "./HeroSwiss";
import HeroSoft from "./HeroSoft";

export default function Hero() {
    const { theme } = useTheme();

    if (theme === "swiss") {
        return <HeroSwiss />;
    }

    if (theme === "soft") {
        return <HeroSoft />;
    }

    return <HeroNeo />;
}
