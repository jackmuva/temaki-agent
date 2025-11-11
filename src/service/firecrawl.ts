import Firecrawl from '@mendable/firecrawl-js';
import config from '../config/config';

const firecrawl = new Firecrawl({ apiKey: config.firecrawlApiKey });
export default firecrawl;
