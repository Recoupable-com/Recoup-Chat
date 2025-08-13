import getSearchWebTool from "./getSearchWebTool";

/**
 * Fetches and filters Perplexity tools, excluding the problematic perplexity_reason tool
 * @returns An object containing only the search_web tool
 */
const searchWeb = getSearchWebTool("sonar-pro");

export default searchWeb;
