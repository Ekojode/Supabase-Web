"use client";

import { useTheme } from "@/context/ThemeContext";
import NavbarNeo from "./NavbarNeo";
import NavbarSwiss from "./NavbarSwiss";
import NavbarSoft from "./NavbarSoft";

export default function Navbar() {
    const { theme } = useTheme();

    if (theme === "swiss") {
        return <NavbarSwiss />;
    }

    if (theme === "soft") {
        return <NavbarSoft />;
    }

    return <NavbarNeo />;
}
