import browserAct from "./browserAct";
import browserExtract from "./browserExtract";
import browserObserve from "./browserObserve";
import browserAgent from "./browserAgent";
import waitTool from "./waitTool";

/**
 * Browser automation tools powered by Stagehand
 * 
 * Available tools:
 * - browser_act: Execute natural language actions (click, type, scroll)
 * - browser_extract: Extract structured data from pages
 * - browser_observe: Discover available actions on a page
 * - browser_agent: Autonomously execute multi-step workflows
 * - wait: Add delays to avoid rate limiting
 */
const browserTools = {
  browser_act: browserAct,
  browser_extract: browserExtract,
  browser_observe: browserObserve,
  browser_agent: browserAgent,
  wait: waitTool,
};

export default browserTools;

