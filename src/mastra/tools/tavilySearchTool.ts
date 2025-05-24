import { createTool } from "@mastra/core";
import { z } from "zod";
import { tavily } from "@tavily/core";
import type { TavilySearchOptions } from "@tavily/core";

// Define input schema
const TavilySearchInputSchema = z.object({
    query: z.string().describe("The search query to look up on the web"),
    searchDepth: z.enum(["basic", "advanced"]).optional().describe("The depth of the search. 'advanced' search is tailored to retrieve the most relevant sources while 'basic' search provides generic content snippets."),
    maxResults: z.number().min(1).max(20).optional().describe("The maximum number of search results to return. Must be between 1 and 20."),
    includeAnswer: z.boolean().optional().describe("Whether to include an AI-generated answer based on the search results"),
    topic: z.enum(["general", "news"]).optional().describe("The category of the search, can be 'general' or 'news'"),
    timeRange: z.enum(["day", "week", "month", "year", "d", "w", "m", "y"]).optional().describe("The time range to search within"),
    includeDomains: z.array(z.string()).optional().describe("A list of domains to specifically include in the search results"),
    excludeDomains: z.array(z.string()).optional().describe("A list of domains to specifically exclude from the search results"),
});

// Define output schema
const TavilySearchOutputSchema = z.object({
    query: z.string().optional(),
    results: z.array(
        z.object({
            title: z.string(),
            url: z.string(),
            content: z.string(),
            score: z.number(),
        })
    ).optional(),
    answer: z.string().optional(),
    responseTime: z.number().optional(),
    error: z.string().optional(),
});

// Type definitions
type TavilySearchInput = z.infer<typeof TavilySearchInputSchema>;
type TavilySearchOutput = z.infer<typeof TavilySearchOutputSchema>;

/**
 * Creates a tool for searching the web using Tavily API for the Zenova Platform.
 * 
 * This tool uses the Tavily JavaScript SDK to perform web searches
 * and returns relevant results without including images.
 */
export const tavilySearchTool = createTool({
    id: 'zenova-tavily-search', // Changed ID for Zenova
    description: "Search the web for real-time information using Tavily API for the Zenova Platform",
    inputSchema: TavilySearchInputSchema,
    outputSchema: TavilySearchOutputSchema,
    execute: async ({ context }) => { // Removed options as it was unused in the example provided
        try {
            const input = context as TavilySearchInput;

            // Get API key from environment variables
            const apiKey = process.env.TAVILY_API_KEY;

            if (!apiKey) {
                throw new Error("TAVILY_API_KEY environment variable is not set");
            }

            // Initialize Tavily client
            const tvly = tavily({ apiKey });

            // Prepare search parameters
            const searchParams: TavilySearchOptions = {
                searchDepth: input.searchDepth,
                maxResults: input.maxResults,
                includeAnswer: input.includeAnswer,
                topic: input.topic,
                timeRange: input.timeRange,
                includeDomains: input.includeDomains,
                excludeDomains: input.excludeDomains,
                includeImages: false, // Always exclude images for agent usage
            };

            // Remove undefined parameters
            Object.keys(searchParams).forEach(key => {
                const K = key as keyof TavilySearchOptions;
                if (searchParams[K] === undefined) {
                  delete searchParams[K];
                }
              });

            // Execute the search
            const response = await tvly.search(input.query, searchParams);

            // Format response for the agent
            return {
                query: response.query,
                results: response.results,
                answer: response.answer,
                responseTime: response.responseTime,
            } as TavilySearchOutput;
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : "An unknown error occurred during web search",
            } as TavilySearchOutput;
        }
    },
}); 