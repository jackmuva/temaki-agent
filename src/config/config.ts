import dotenv from "dotenv";

dotenv.config();

interface Config {
	port: number;
	nodeEnv: string;
	baseUrl: string;
	localDbFileName: string;
	tursoDatabaseUrl: string;
	tursoAuthToken: string;
	aiGatewayApiKey: string;
	firecrawlApiKey: string;
}

const config: Config = {
	port: Number(process.env.PORT) || 3000,
	nodeEnv: process.env.NODE_ENV || 'development',
	baseUrl: process.env.BASE_URL || 'http://localhost',
	localDbFileName: process.env.LOCAL_DB_FILE_NAME!,
	tursoDatabaseUrl: process.env.TURSO_DATABASE_URL!,
	tursoAuthToken: process.env.TURSO_AUTH_TOKEN!,
	aiGatewayApiKey: process.env.AI_GATEWAY_API_KEY!,
	firecrawlApiKey: process.env.FIRECRAWL_API_KEY!,
};

export default config;
