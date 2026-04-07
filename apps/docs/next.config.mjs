import { createMDX } from "fumadocs-mdx/next";

const nextConfig = {
	typedRoutes: false,
	allowedDevOrigins: ["docs.revaos.local"],
};

export default createMDX()(nextConfig);
