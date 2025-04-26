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
    console.log('No saved cookies found or login failed.');
  }

  // --- Radar Workflow ---
  const query = '"artificial intelligence" OR #AI -is:retweet'; // Example advanced query
  let insightRestId = null;

  try {
    // 1. Create an Insight Rule
    console.log(`Creating insight rule for query: ${query}`);
    const createResult = await scraper.CreateInsightInputQuery(query);
    insightRestId = createResult.rest_id; // Use rest_id!
    console.log(`Insight rule created. Rest ID: ${insightRestId}`);

    // 2. (Recommended) Initialize the Rule
    console.log(`Initializing rule with ID: ${insightRestId}`);
    // This call might not return immediately useful data, but is often necessary
    await scraper.InsightProviderGetQuery(insightRestId);
    console.log('Rule initialization called.');

    // 3. Fetch Post Counts
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
    const now = Math.floor(Date.now() / 1000);
    console.log(
      `Fetching post counts for rule ${insightRestId} from ${new Date(
        sevenDaysAgo * 1000,
      ).toISOString()} to ${new Date(now * 1000).toISOString()}`,
    );
    const postCounts = await scraper.UsePostCountQuery(
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
    const topPosts = await scraper.PostListQuery(query);
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
      tweetEntries.forEach((entry, index) => {
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
    const allRules = await scraper.InsightsListContextQuery();
    const rulesList =
      allRules?.data?.viewer_v2?.user_results?.result?.insight_rules?.items;
    if (rulesList) {
      console.log(`Found ${rulesList.length} rules:`);
      rulesList.forEach((rule) => {
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
        await scraper.DeleteInsightButtonMutation(insightRestId);
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
