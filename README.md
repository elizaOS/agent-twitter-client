# goat-x

This is a modified version of [@ai16z/agent-twitter-client](https://github.com/ai16z/agent-twitter-client) with added functionality for sending quote tweets, retweets, likes, and follows. This package does not require the Twitter API to use and will run in both the browser and server.

## Installation

```sh
npm install goat-x
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
const sendQuoteTweetResults = await scraper.sendQuoteTweet('Hello world!', '1234567890123456789', ['mediaFile1', 'mediaFile2']);

// Retweet a tweet
const retweetResults = await scraper.retweet('1234567890123456789');

// Like a tweet
const likeTweetResults = await scraper.likeTweet('1234567890123456789');
```