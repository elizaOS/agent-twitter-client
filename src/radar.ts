import { requestApi } from './api.js';
import { TwitterAuth } from './auth.js';

// Response shape for CreateInsightInputQuery
export interface CreateInsightInputQueryResponse {
  data: {
    create_insight_rule_v2: {
      __typename: 'InsightRuleMutationSuccess';
      result: {
        rest_id: string;
        id: string;
      };
    };
  };
}

/**
 * Creates a new insight input query.
 * @returns The created insight rule's result object ({ rest_id, id }).
 * @internal
 */
export async function CreateInsightInputQuery(
  query: string,
  auth: TwitterAuth,
): Promise<{ rest_id: string; id: string }> {
  const res = await requestApi<CreateInsightInputQueryResponse>(
    'https://x.com/i/api/graphql/AsXpgHWLsyD3H-L-VY679g/CreateInsightInputQuery',
    auth,
    'POST',
    undefined,
    {
      queryId: 'AsXpgHWLsyD3H-L-VY679g',
      variables: {
        tags: null,
        title: '',
        advanced_query: query,
        notifications_enabled: false,
      },
    },
  );

  if (!res.success) {
    throw res.err;
  }

  // Return just the result object for convenience
  return res.value.data.create_insight_rule_v2.result;
}

// Types for the deeply nested response structure
interface InsightRuleCore {
  title: string;
  advanced_query: string;
  created_at: string;
  updated_at: string;
  notifications_enabled: boolean;
}

interface InsightRuleById {
  rest_id: string;
  core: InsightRuleCore;
  id: string;
}

interface UserResult {
  __typename: string;
  insight_rule_by_id: InsightRuleById | null;
  id: string;
}

interface UserResults {
  result: UserResult;
  id: string;
}

interface ViewerV2 {
  user_results: UserResults;
}

interface InsightProviderGetQueryResponse {
  data: {
    viewer_v2: ViewerV2;
  };
}

/**
 * Fetches an insight rule by its ID and returns the normalized insight rule object.
 * @param id The insight rule ID to fetch.
 * @param auth TwitterAuth object.
 * @returns The insight rule object, or null if not found.
 */
export async function InsightProviderGetQuery(
  id: string,
  auth: TwitterAuth,
): Promise<InsightRuleById | null> {
  const res = await requestApi<InsightProviderGetQueryResponse>(
    'https://x.com/i/api/graphql/budp7YfzYNiuQbMvVRq3Vg/InsightProviderGetQuery',
    auth,
    'POST',
    undefined,
    {
      variables: {
        id: id,
      },
    },
  );

  if (!res.success) {
    throw res.err;
  }

  // Safely extract the insight_rule_by_id object, or return null if not found
  return (
    res.value?.data?.viewer_v2?.user_results?.result?.insight_rule_by_id ?? null
  );
}

interface MatchedPostCount {
  count: number;
  start_time: number;
}

interface MatchedPostCounts {
  __typename: 'InsightsMatchedPostCountsSuccess';
  counts: MatchedPostCount[];
  has_incomplete_counts: boolean;
  oldest_complete_count: number;
  total: number;
}

interface InsightRuleByIdWithCounts {
  matched_post_counts: MatchedPostCounts;
  id: string;
}

interface UsePostCountQueryUserResult {
  __typename: 'User';
  insight_rule_by_id: InsightRuleByIdWithCounts;
  id: string;
}

interface UsePostCountQueryUserResults {
  result: UsePostCountQueryUserResult;
  id: string;
}

interface UsePostCountQueryViewerV2 {
  user_results: UsePostCountQueryUserResults;
}

export interface UsePostCountQueryResponse {
  data: {
    viewer_v2: UsePostCountQueryViewerV2;
  };
}

export async function UsePostCountQuery(
  id: string,
  auth: TwitterAuth,
): Promise<UsePostCountQueryResponse> {
  const res = await requestApi<UsePostCountQueryResponse>(
    'https://x.com/i/api/graphql/bcYnBtV-7Mr_vbWIY4utWA/usePostCountQuery',
    auth,
    'POST',
    undefined,
    {
      variables: {
        from_time: 1744329600,
        to_time: 1744887599,
        granularity: 'Day',
        id: id,
        timezone_offset: 0,
      },
    },
  );

  if (!res.success) {
    throw res.err;
  }

  return res.value;
}

export interface PostListQueryResponse {
  data: {
    search_by_raw_query: {
      search_timeline: {
        timeline: {
          instructions: PostListQueryInstruction[];
          id: string;
        };
        id: string;
      };
    };
  };
}

export type PostListQueryInstruction = {
  __typename: 'TimelineAddEntries';
  entries: PostListQueryEntry[];
};

export type PostListQueryEntry =
  | {
      content: {
        __typename: 'TimelineTimelineModule';
      };
    }
  | {
      content: PostListQueryTimelineItem;
    }
  | {
      content: PostListQueryTimelineCursor;
    };

export interface PostListQueryTimelineItem {
  __typename: 'TimelineTimelineItem';
  content: {
    __typename: 'TimelineTweet';
    tweet_results: {
      result: PostListQueryTweet;
      id: string;
    };
  };
}

export interface PostListQueryTimelineCursor {
  __typename: 'TimelineTimelineCursor';
  value: string;
  cursor_type: string;
}

export interface PostListQueryTweet {
  __typename: 'Tweet';
  rest_id: string;
  core: {
    user_results: {
      result: PostListQueryUser;
      id: string;
    };
  };
  legacy: {
    full_text: string;
    reply_count: number;
    favorite_count: number;
    quote_count: number;
    retweet_count: number;
    bookmark_count: number;
    created_at_ms: number;
  };
  views: {
    count: string;
  };
  id: string;
}

export interface PostListQueryUser {
  __typename: 'User';
  rest_id: string;
  legacy: {
    name: string;
    screen_name: string;
    profile_image_url_https: string;
  };
  is_blue_verified: boolean;
  affiliates_highlighted_label: object;
  id: string;
}

export async function PostListQuery(
  query: string,
  auth: TwitterAuth,
): Promise<PostListQueryResponse> {
  const res = await requestApi<PostListQueryResponse>(
    'https://x.com/i/api/graphql/vqoJiOnCYxkIJ79fePvckg/PostListQuery',
    auth,
    'POST',
    undefined,
    {
      variables: {
        query: `${query} -is:retweet since:2025-04-11`, // TODO: Deal with dynamic dates
        cursor: null,
        product: 'Top',
      },
    },
  );

  if (!res.success) {
    throw res.err;
  }

  return res.value;
}
