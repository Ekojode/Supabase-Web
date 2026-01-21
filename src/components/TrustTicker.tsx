"use client";

import { useTheme } from "@/context/ThemeContext";
import TrustTickerNeo from "./TrustTickerNeo";
import TrustTickerSwiss from "./TrustTickerSwiss";
import TrustTickerSoft from "./TrustTickerSoft";

export default function TrustTicker() {
    const { theme } = useTheme();

    if (theme === "swiss") {
        return <TrustTickerSwiss />;
    }

    if (theme === "soft") {
        return <TrustTickerSoft />;
    }

    return <TrustTickerNeo />;
}
