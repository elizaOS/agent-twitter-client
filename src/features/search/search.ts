import { addApiFeatures, requestApi } from '@/core/api';
import { TwitterAuth } from '@/core/auth';
import { getTweetTimeline, getUserTimeline, parseSearchTimelineTweets, parseSearchTimelineUsers, QueryProfilesResponse, QueryTweetsResponse, SearchTimeline } from '@/timeline';
import stringify from 'json-stable-stringify';
import { Profile } from '../profiles';
import { Tweet } from '../tweets';

/**
 * The categories that can be used in Twitter searches.
 */
export enum SearchMode {
  Top,
  Latest,
  Photos,
  Videos,
  Users,
}

export function searchTweets(
  query: string,
  maxTweets: number,
  searchMode: SearchMode,
  auth: TwitterAuth,
): AsyncGenerator<Tweet, void> {
  return getTweetTimeline(query, maxTweets, (q, mt, c) => {
    return fetchSearchTweets(q, mt, searchMode, auth, c);
  });
}

export function searchProfiles(
  query: string,
  maxProfiles: number,
  auth: TwitterAuth,
): AsyncGenerator<Profile, void> {
  return getUserTimeline(query, maxProfiles, (q, mt, c) => {
    return fetchSearchProfiles(q, mt, auth, c);
  });
}

export async function fetchSearchTweets(
  query: string,
  maxTweets: number,
  searchMode: SearchMode,
  auth: TwitterAuth,
  cursor?: string,
): Promise<QueryTweetsResponse> {
  const timeline = await getSearchTimeline(
    query,
    maxTweets,
    searchMode,
    auth,
    cursor,
  );

  return parseSearchTimelineTweets(timeline);
}

export async function fetchSearchProfiles(
  query: string,
  maxProfiles: number,
  auth: TwitterAuth,
  cursor?: string,
): Promise<QueryProfilesResponse> {
  const timeline = await getSearchTimeline(
    query,
    maxProfiles,
    SearchMode.Users,
    auth,
    cursor,
  );

  return parseSearchTimelineUsers(timeline);
}

async function getSearchTimeline(
  query: string,
  maxItems: number,
  searchMode: SearchMode,
  auth: TwitterAuth,
  cursor?: string,
): Promise<SearchTimeline> {
  if (!auth.isLoggedIn()) {
    throw new Error('Scraper is not logged-in for search.');
  }

  if (maxItems > 50) {
    maxItems = 50;
  }

  const variables: Record<string, any> = {
    rawQuery: query,
    count: maxItems,
    querySource: 'typed_query',
    product: 'Top',
  };

  const features = addApiFeatures({
    longform_notetweets_inline_media_enabled: true,
    responsive_web_enhance_cards_enabled: false,
    responsive_web_media_download_video_enabled: false,
    responsive_web_twitter_article_tweet_consumption_enabled: false,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
      true,
    interactive_text_enabled: false,
    responsive_web_text_conversations_enabled: false,
    vibe_api_enabled: false,
  });

  const fieldToggles: Record<string, any> = {
    withArticleRichContentState: false,
  };

  if (cursor != null && cursor != '') {
    variables['cursor'] = cursor;
  }

  switch (searchMode) {
    case SearchMode.Latest:
      variables.product = 'Latest';
      break;
    case SearchMode.Photos:
      variables.product = 'Photos';
      break;
    case SearchMode.Videos:
      variables.product = 'Videos';
      break;
    case SearchMode.Users:
      variables.product = 'People';
      break;
    default:
      break;
  }

  const params = new URLSearchParams();
  params.set('features', stringify(features) ?? '');
  params.set('fieldToggles', stringify(fieldToggles) ?? '');
  params.set('variables', stringify(variables) ?? '');

  const res = await requestApi<SearchTimeline>(
    `https://api.twitter.com/graphql/gkjsKepM6gl_HmFWoWKfgg/SearchTimeline?${params.toString()}`,
    auth,
  );

  if (!res.success) {
    throw res.err;
  }

  return res.value;
}
