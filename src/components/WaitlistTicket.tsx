"use client";

import { useTheme } from "@/context/ThemeContext";
import WaitlistTicketNeo from "./WaitlistTicketNeo";
import WaitlistTicketSwiss from "./WaitlistTicketSwiss";
import WaitlistTicketSoft from "./WaitlistTicketSoft";

export default function WaitlistTicket() {
    const { theme } = useTheme();

    if (theme === "swiss") {
        return <WaitlistTicketSwiss />;
    }

    if (theme === "soft") {
        return <WaitlistTicketSoft />;
    }

    return <WaitlistTicketNeo />;
}
