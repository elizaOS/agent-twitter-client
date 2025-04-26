# agent-twitter-client

This is a modified version of [@the-convocation/twitter-scraper](https://github.com/the-convocation/twitter-scraper) with added functionality for sending tweets and retweets. This package does not require the Twitter API to use and will run in both the browser and server.

## Installation

```sh
npm install agent-twitter-client
```

## Setup

Configure environment variables for authentication.

```
TWITTER_USERNAME=    # Account username
TWITTER_PASSWORD=    # Account password
TWITTER_EMAIL=       # Account email
PROXY_URL=           # HTTP(s) proxy for requests (necessary for browsers)

# Twitter API v2 credentials for tweet and poll functionality
TWITTER_API_KEY=               # Twitter API Key
TWITTER_API_SECRET_KEY=        # Twitter API Secret Key
TWITTER_ACCESS_TOKEN=          # Access Token for Twitter API v2
TWITTER_ACCESS_TOKEN_SECRET=   # Access Token Secret for Twitter API v2
```

### Getting Twitter Cookies

It is important to use Twitter cookies to avoid sending a new login request to Twitter every time you want to perform an action.

In your application, you will likely want to check for existing cookies. If cookies are not available, log in with user authentication credentials and cache the cookies for future use.

```ts
const scraper = await getScraper({ authMethod: 'password' });

scraper.getCookies().then((cookies) => {
  console.log(cookies);
  // Remove 'Cookies' and save the cookies as a JSON array
});
```

## Getting Started

```ts
const scraper = new Scraper();
await scraper.login('username', 'password');

// If using v2 functionality (currently required to support polls)
await scraper.login(
  'username',
  'password',
  'email',
  'appKey',
  'appSecret',
  'accessToken',
  'accessSecret',
);

const tweets = await scraper.getTweets('elonmusk', 10);
const tweetsAndReplies = scraper.getTweetsAndReplies('elonmusk');
const latestTweet = await scraper.getLatestTweet('elonmusk');
const tweet = await scraper.getTweet('1234567890123456789');
await scraper.sendTweet('Hello world!');

// Create a poll
await scraper.sendTweetV2(
  `What's got you most hyped? Let us know! 🤖💸`,
  undefined,
  {
    poll: {
      options: [
        { label: 'AI Innovations 🤖' },
        { label: 'Crypto Craze 💸' },
        { label: 'Both! 🌌' },
        { label: 'Neither for Me 😅' },
      ],
      durationMinutes: 120, // Duration of the poll in minutes
    },
  },
);
```

### Fetching Specific Tweet Data (V2)

```ts
// Fetch a single tweet with poll details
const tweet = await scraper.getTweetV2('1856441982811529619', {
  expansions: ['attachments.poll_ids'],
  pollFields: ['options', 'end_datetime'],
});
console.log('tweet', tweet);

// Fetch multiple tweets with poll and media details
const tweets = await scraper.getTweetsV2(
  ['1856441982811529619', '1856429655215260130'],
  {
    expansions: ['attachments.poll_ids', 'attachments.media_keys'],
    pollFields: ['options', 'end_datetime'],
    mediaFields: ['url', 'preview_image_url'],
  },
);
console.log('tweets', tweets);
```

## API

### Authentication

```ts
// Log in
await scraper.login('username', 'password');

// Log out
await scraper.logout();

// Check if logged in
const isLoggedIn = await scraper.isLoggedIn();

// Get current session cookies
const cookies = await scraper.getCookies();

// Set current session cookies
await scraper.setCookies(cookies);

// Clear current cookies
await scraper.clearCookies();
```

### Profile

```ts
// Get a user's profile
const profile = await scraper.getProfile('TwitterDev');

// Get a user ID from their screen name
const userId = await scraper.getUserIdByScreenName('TwitterDev');

// Get logged-in user's profile
const me = await scraper.me();
```

### Search

```ts
import { SearchMode } from 'agent-twitter-client';

// Search for recent tweets
const tweets = scraper.searchTweets('#nodejs', 20, SearchMode.Latest);

// Search for profiles
const profiles = scraper.searchProfiles('John', 10);

// Fetch a page of tweet results
const results = await scraper.fetchSearchTweets('#nodejs', 20, SearchMode.Top);

// Fetch a page of profile results
const profileResults = await scraper.fetchSearchProfiles('John', 10);
```

### Relationships

```ts
// Get a user's followers
const followers = scraper.getFollowers('12345', 100);

// Get who a user is following
const following = scraper.getFollowing('12345', 100);

// Fetch a page of a user's followers
const followerResults = await scraper.fetchProfileFollowers('12345', 100);

// Fetch a page of who a user is following
const followingResults = await scraper.fetchProfileFollowing('12345', 100);

// Follow a user
const followUserResults = await scraper.followUser('elonmusk');
```

### Trends

```ts
// Get current trends
const trends = await scraper.getTrends();

// Fetch tweets from a list
const listTweets = await scraper.fetchListTweets('1234567890', 50);
```

### Tweets

```ts
// Get a user's tweets
const tweets = scraper.getTweets('TwitterDev');

// Fetch the home timeline
const homeTimeline = await scraper.fetchHomeTimeline(10, [
  'seenTweetId1',
  'seenTweetId2',
]);

// Get a user's liked tweets
const likedTweets = scraper.getLikedTweets('TwitterDev');

// Get a user's tweets and replies
const tweetsAndReplies = scraper.getTweetsAndReplies('TwitterDev');

// Get tweets matching specific criteria
const timeline = scraper.getTweets('TwitterDev', 100);
const retweets = await scraper.getTweetsWhere(
  timeline,
  (tweet) => tweet.isRetweet,
);

// Get a user's latest tweet
const latestTweet = await scraper.getLatestTweet('TwitterDev');

// Get a specific tweet by ID
const tweet = await scraper.getTweet('1234567890123456789');

// Send a tweet
const sendTweetResults = await scraper.sendTweet('Hello world!');

// Send a quote tweet - Media files are optional
const sendQuoteTweetResults = await scraper.sendQuoteTweet(
  'Hello world!',
  '1234567890123456789',
  ['mediaFile1', 'mediaFile2'],
);

// Retweet a tweet
const retweetResults = await scraper.retweet('1234567890123456789');

// Like a tweet
const likeTweetResults = await scraper.likeTweet('1234567890123456789');
```

## Sending Tweets with Media

### Media Handling

The scraper requires media files to be processed into a specific format before sending:

- Media must be converted to Buffer format
- Each media file needs its MIME type specified
- This helps the scraper distinguish between image and video processing models

### Basic Tweet with Media

```ts
// Example: Sending a tweet with media attachments
const mediaData = [
  {
    data: fs.readFileSync('path/to/image.jpg'),
    mediaType: 'image/jpeg',
  },
  {
    data: fs.readFileSync('path/to/video.mp4'),
    mediaType: 'video/mp4',
  },
];

await scraper.sendTweet('Hello world!', undefined, mediaData);
```

### Supported Media Types

```ts
// Image formats and their MIME types
const imageTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
};

// Video format
const videoTypes = {
  '.mp4': 'video/mp4',
};
```

### Media Upload Limitations

- Maximum 4 images per tweet
- Only 1 video per tweet
- Maximum video file size: 512MB
- Supported image formats: JPG, PNG, GIF
- Supported video format: MP4

## Grok Integration

This client provides programmatic access to Grok through Twitter's interface, offering a unique capability that even Grok's official API cannot match - access to real-time Twitter data. While Grok has a standalone API, only by interacting with Grok through Twitter can you leverage its ability to analyze and respond to live Twitter content. This makes it the only way to programmatically access an LLM with direct insight into Twitter's real-time information. [@grokkyAi](https://x.com/grokkyAi)

### Basic Usage

```ts
const scraper = new Scraper();
await scraper.login('username', 'password');

// Start a new conversation
const response = await scraper.grokChat({
  messages: [{ role: 'user', content: 'What are your thoughts on AI?' }],
});

console.log(response.message); // Grok's response
console.log(response.messages); // Full conversation history
```

If no `conversationId` is provided, the client will automatically create a new conversation.

### Handling Rate Limits

Grok has rate limits of 25 messages every 2 hours for non-premium accounts. The client provides rate limit information in the response:

```ts
const response = await scraper.grokChat({
  messages: [{ role: 'user', content: 'Hello!' }],
});

if (response.rateLimit?.isRateLimited) {
  console.log(response.rateLimit.message);
  console.log(response.rateLimit.upsellInfo); // Premium upgrade information
}
```

### Response Types

The Grok integration includes TypeScript types for better development experience:

```ts
interface GrokChatOptions {
  messages: GrokMessage[];
  conversationId?: string;
  returnSearchResults?: boolean;
  returnCitations?: boolean;
}

interface GrokChatResponse {
  conversationId: string;
  message: string;
  messages: GrokMessage[];
  webResults?: any[];
  metadata?: any;
  rateLimit?: GrokRateLimit;
}
```

### Advanced Usage

```ts
const response = await scraper.grokChat({
  messages: [{ role: 'user', content: 'Research quantum computing' }],
  returnSearchResults: true, // Include web search results
  returnCitations: true, // Include citations for information
});

// Access web results if available
if (response.webResults) {
  console.log('Sources:', response.webResults);
}

// Full conversation with history
console.log('Conversation:', response.messages);
```

### Limitations

- Message history prefilling is currently limited due to unofficial API usage
- Rate limits are enforced (25 messages/2 hours for non-premium)

## Twitter Radar API Integration

This package now includes support for Twitter's **Radar** analytics functionality, which allows you to programmatically analyze trends, search for advanced queries, and retrieve analytics such as post counts and top tweets over time. The Radar API is undocumented and subject to change, but the following methods have been reverse engineered and are available for use.

**Important Note:** These Radar functions act as direct proxies to the underlying, undocumented Twitter GraphQL API endpoints. This means:

- The responses returned are the raw, often complex, data structures from the API. You should refer to the TypeScript interfaces defined in `src/radar.ts` (like `CreateInsightInputQueryResponse`, `UsePostCountQueryResponse`, `PostListQueryResponse`, etc.) to understand the shape of the data.
- The API behavior, request parameters, and response structures can change without notice as Twitter updates its internal systems.
- Errors from the API (e.g., rate limits, invalid queries, authentication issues, or API changes) will be thrown as exceptions. **It is crucial to wrap your calls to these functions in `try...catch` blocks** to handle potential errors gracefully.

### Overview

Radar enables you to:

- **Create and manage "insight rules"**: These are essentially saved advanced search queries.
- **Fetch post count analytics**: Get daily tweet counts for a specific query over a defined time range.
- **Retrieve top tweets**: Find the most relevant tweets matching a query from the last 7 days.
- **List and delete your saved insight rules**: Manage your created rules (Twitter currently seems to limit users to 5 rules).

#### Typical Workflow

1.  **Create an Insight Rule**:
    Use `scraper.createInsightInputQuery(query)` to define and save a search query.
    This returns an object containing `id` and `rest_id`.
    **Crucially, you must use the `rest_id` value as the identifier for most subsequent Radar API calls.**

2.  **(Recommended) Initialize the Rule**:
    Call `scraper.insightProviderGetQuery(rest_id)` shortly after creation.
    While this function's direct return value might not seem immediately useful, calling it appears necessary to fully initialize the rule for analytics fetching.

3.  **Fetch Post Counts**:
    Use `scraper.usePostCountQuery(rest_id, from, to)` to retrieve daily post counts for the rule's query within a specific date range (using UNIX timestamps in seconds).

4.  **Fetch Top Posts**:
    Use `scraper.postListQuery(query)` to get a timeline of top tweets matching a query string from the past 7 days.
    Note: This function uses the _query string directly_, not the `rest_id` of an insight rule.

5.  **List All Insight Rules**:
    Use `scraper.insightsListContextQuery()` to retrieve a list of all insight rules currently saved to your account.

6.  **Delete an Insight Rule**:
    Use `scraper.deleteInsightButtonMutation(rest_id)` to remove a previously created insight rule using its `rest_id`.

---

### Example Usage

Here's an example demonstrating the typical workflow for using the Radar API:

```typescript
import { Scraper } from 'agent-twitter-client';
import fs from 'fs'; // Assuming you might save/load cookies

async function runRadarExample() {
  const scraper = new Scraper();

  // --- Authentication ---
  // Ensure you are logged in. You might load cookies or log in via credentials.
  // Replace with your actual login logic (credentials or loading saved cookies)
  try {
    // Example: Load cookies if they exist
    const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
    await scraper.setCookies(cookies);
    if (!(await scraper.isLoggedIn())) {
      throw new Error('Failed to log in with cookies.');
    }
    console.log('Logged in successfully using saved cookies.');
  } catch (error) {
    console.log(
      'No saved cookies found or login failed, logging in with credentials...',
    );
    // Replace with your actual credentials or environment variables
    await scraper.login(
      process.env.TWITTER_USERNAME!,
      process.env.TWITTER_PASSWORD!,
      process.env.TWITTER_EMAIL, // Optional email
      // Add other necessary login params like 2FA if needed
    );
    console.log('Logged in successfully using credentials.');
    // Optional: Save cookies for next time
    // const currentCookies = await scraper.getCookies();
    // fs.writeFileSync('cookies.json', JSON.stringify(currentCookies));
  }

  // --- Radar Workflow ---
  const query = '"artificial intelligence" OR #AI -is:retweet'; // Example advanced query
  let insightRestId: string | null = null;

  try {
    // 1. Create an Insight Rule
    console.log(`Creating insight rule for query: ${query}`);
    const createResult = await scraper.createInsightInputQuery(query);
    insightRestId = createResult.rest_id; // Use rest_id!
    console.log(`Insight rule created. Rest ID: ${insightRestId}`);

    // 2. (Recommended) Initialize the Rule
    console.log(`Initializing rule with ID: ${insightRestId}`);
    // This call might not return immediately useful data, but is often necessary
    await scraper.insightProviderGetQuery(insightRestId);
    console.log('Rule initialization called.');
    // Add a small delay if needed, as initialization might take time
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

    // 3. Fetch Post Counts
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
    const now = Math.floor(Date.now() / 1000);
    console.log(
      `Fetching post counts for rule ${insightRestId} from ${new Date(
        sevenDaysAgo * 1000,
      ).toISOString()} to ${new Date(now * 1000).toISOString()}`,
    );
    const postCounts = await scraper.usePostCountQuery(
      insightRestId,
      sevenDaysAgo,
      now,
    );
    // Process the complex response structure (refer to UsePostCountQueryResponse in radar.ts)
    const countsData =
      postCounts?.data?.viewer_v2?.user_results?.result?.insight_rule_by_id
        ?.matched_post_counts;
    if (countsData) {
      console.log(`Total posts found: ${countsData.total}`);
      console.log('Daily counts:', countsData.counts);
    } else {
      console.log('Could not extract post count data from response.');
      // console.log('Raw Post Count Response:', JSON.stringify(postCounts, null, 2)); // For debugging
    }

    // 4. Fetch Top Posts (using the query string, not rest_id)
    console.log(`Fetching top posts for query: ${query}`);
    const topPosts = await scraper.postListQuery(query);
    // Process the complex response structure (refer to PostListQueryResponse in radar.ts)
    const timelineInstructions =
      topPosts?.data?.search_by_raw_query?.search_timeline?.timeline
        ?.instructions;
    const tweetEntries = timelineInstructions
      ?.find((inst) => inst.__typename === 'TimelineAddEntries')
      ?.entries?.filter(
        (entry) => entry?.content?.__typename === 'TimelineTimelineItem',
      );

    if (tweetEntries && tweetEntries.length > 0) {
      console.log(`Found ${tweetEntries.length} top tweets:`);
      tweetEntries.forEach((entry: any, index: number) => {
        // Use 'any' or define a stricter type based on the interface
        const tweetResult = entry?.content?.content?.tweet_results?.result;
        if (tweetResult?.__typename === 'Tweet') {
          console.log(
            `  ${index + 1}. ID: ${
              tweetResult.rest_id
            }, Text: ${tweetResult.legacy.full_text.substring(0, 50)}...`,
          );
        }
      });
    } else {
      console.log('No top tweets found or could not extract from response.');
      // console.log('Raw Top Posts Response:', JSON.stringify(topPosts, null, 2)); // For debugging
    }

    // 5. List All Insight Rules
    console.log('Listing all current insight rules...');
    const allRules = await scraper.insightsListContextQuery();
    const rulesList =
      allRules?.data?.viewer_v2?.user_results?.result?.insight_rules?.items;
    if (rulesList) {
      console.log(`Found ${rulesList.length} rules:`);
      rulesList.forEach((rule: any) => {
        // Use 'any' or define a stricter type
        console.log(
          `  - ID: ${rule.rest_id}, Query: ${rule.core.advanced_query}`,
        );
      });
    } else {
      console.log('Could not list insight rules.');
    }
  } catch (error) {
    console.error('An error occurred during the Radar workflow:', error);
  } finally {
    // 6. Delete the Insight Rule (Optional Cleanup)
    if (insightRestId) {
      try {
        console.log(`Attempting to delete insight rule: ${insightRestId}`);
        await scraper.deleteInsightButtonMutation(insightRestId);
        console.log(`Successfully deleted insight rule: ${insightRestId}`);
      } catch (deleteError) {
        console.error(
          `Failed to delete insight rule ${insightRestId}:`,
          deleteError,
        );
      }
    }

    // Log out if necessary
    // await scraper.logout();
    // console.log('Logged out.');
  }
}

runRadarExample();
```

**Explanation:**

1.  **Authentication**: Ensure the scraper is logged in before using Radar functions.
2.  **Create Rule**: Define your search `query` using Twitter's advanced search syntax. Call `createInsightInputQuery` and store the returned `rest_id`.
3.  **Initialize Rule**: Call `insightProviderGetQuery` with the `rest_id`. A small delay might be helpful afterwards.
4.  **Get Post Counts**: Call `usePostCountQuery` with the `rest_id` and Unix timestamps (in seconds) for the desired `from` and `to` dates. Parse the complex response to get the counts.
5.  **Get Top Posts**: Call `postListQuery` with the original `query` string (not the `rest_id`). Parse the response to extract the top tweets from the timeline instructions.
6.  **List Rules**: Call `insightsListContextQuery` to see all saved rules associated with your account.
7.  **Delete Rule**: If you need to remove a rule (e.g., due to the 5-rule limit), call `deleteInsightButtonMutation` with the `rest_id`.
8.  **Error Handling**: Wrap calls in `try...catch` blocks as these are undocumented APIs and can fail or change. The `finally` block ensures cleanup (like deleting the created rule) happens even if errors occur.

Remember to consult the TypeScript interfaces in `src/radar.ts` to fully understand the structure of the data returned by these functions, especially for `usePostCountQuery` and `postListQuery`, as their responses are deeply nested.
