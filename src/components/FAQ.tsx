"use client";

import { useTheme } from "@/context/ThemeContext";
import FAQNeo from "./FAQNeo";
import FAQSwiss from "./FAQSwiss";
import FAQSoft from "./FAQSoft";

export default function FAQ() {
    const { theme } = useTheme();

    if (theme === "swiss") {
        return <FAQSwiss />;
    }

    if (theme === "soft") {
        return <FAQSoft />;
    }

    return <FAQNeo />;
}
