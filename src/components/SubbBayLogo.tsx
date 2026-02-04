"use client";

interface SubbBayLogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg";
}

export default function SubbBayLogo({
    className = "",
    showText = true,
    size = "md"
}: SubbBayLogoProps) {
    const sizes = {
        sm: { width: 32, height: 32, textSize: "text-lg" },
        md: { width: 40, height: 40, textSize: "text-xl" },
        lg: { width: 56, height: 56, textSize: "text-2xl" },
    };

    const { width, height, textSize } = sizes[size];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Logo Mark */}
            <svg
                width={width}
                height={height}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                <g transform="translate(15, 15) scale(0.75)">
                    {/* Leaf/Wave accent */}
                    <path
                        d="M25 18 C 30 10, 45 8, 52 18 L 48 22 C 48 22, 35 15, 25 25 Z"
                        fill="#8BD3CD"
                    />

                    {/* Top stripe */}
                    <path
                        d="M15 35 L 45 15 L 55 25 L 20 50 Z"
                        fill="#6A859C"
                    />

                    {/* Bottom curved stripe */}
                    <path
                        d="M15 55 L 48 32 L 52 40 C 52 40, 45 60, 25 65 C 15 65, 12 58, 15 55 Z"
                        fill="#6A859C"
                    />
                </g>
            </svg>

            {/* Text */}
            {showText && (
                <span className={`font-bold text-[#4B9C96] ${textSize}`}>
                    Subb Bay
                </span>
            )}
        </div>
    );
}
