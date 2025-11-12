import type { NextConfig } from "next";

const config: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ac.goit.global", // Для аватара за замовчуванням
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com", // Для завантажених аватарів
            },
        ],
    },
};

export default config;
