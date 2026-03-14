"use client";

import { useState } from "react";
import CreateGroupModal from "./CreateGroupModal";

export default function CreateGroupButton({
    className = "bg-[#4CBBB9] hover:bg-[#3AA8A6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors inline-block",
    text = "Create a Group"
}: {
    className?: string;
    text?: string;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className={className}>
                {text}
            </button>
            <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
