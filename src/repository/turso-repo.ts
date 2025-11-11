import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import config from '../config/config';

const client = createClient({
	url: config.tursoDatabaseUrl,
	authToken: config.tursoAuthToken,
});
export const tursoDb = drizzle({ client });
