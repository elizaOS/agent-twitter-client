import { requestApi } from './api.js';
import { TwitterAuth } from './auth.js';

// Response shape for CreateInsightInputQuery
// Adjusted interface to handle both success and failure responses
export interface CreateInsightInputQuerySuccess {
  __typename: 'InsightRuleMutationSuccess';
  result: {
    rest_id: string;
    id: string;
  };
}

export interface CreateInsightInputQueryFailure {
  __typename: 'InsightRuleFailure';
  error_code: string;
  error_message: string;
}

export interface CreateInsightInputQueryResponse {
  data: {
    create_insight_rule_v2:
      | CreateInsightInputQuerySuccess
      | CreateInsightInputQueryFailure;
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
        advanced_query: query,
        notifications_enabled: false,
        tags: null,
        title: '',
      },
    },
    true,
  );

  if (!res.success) {
    throw res.err;
  }

  const rule = res.value?.data?.create_insight_rule_v2;
  if (!rule) {
    throw new Error('CreateInsightInputQuery failed: No response from API');
  }

  if (rule.__typename === 'InsightRuleMutationSuccess') {
    return rule.result;
  } else if (rule.__typename === 'InsightRuleFailure') {
    throw new Error(
      `CreateInsightInputQuery failed: ${rule.__typename} (${rule.error_code}) - ${rule.error_message}`,
    );
  } else {
    throw new Error(
      `CreateInsightInputQuery failed: Unknown response type (${
        (rule as any).__typename
      })`,
    );
  }
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
  const variables = encodeURIComponent(JSON.stringify({ id }));
  const url = `https://x.com/i/api/graphql/budp7YfzYNiuQbMvVRq3Vg/InsightProviderGetQuery?variables=${variables}`;
  const res = await requestApi<InsightProviderGetQueryResponse>(
    url,
    auth,
    'GET',
    undefined,
    undefined, // no body for GET
    true,
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
  const now = Math.floor(Date.now() / 1000);
  const sevenDaysAgo = now - 7 * 24 * 60 * 60;

  const variables = encodeURIComponent(
    JSON.stringify({
      from_time: sevenDaysAgo,
      to_time: now,
      granularity: 'Day',
      id: id,
      timezone_offset: 0,
    }),
  );
  const url = `https://x.com/i/api/graphql/bcYnBtV-7Mr_vbWIY4utWA/usePostCountQuery?variables=${variables}`;
  const res = await requestApi<UsePostCountQueryResponse>(
    url,
    auth,
    'GET',
    undefined,
    undefined, // no body for GET
    true,
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
  const variables = encodeURIComponent(
    JSON.stringify({
      query: `${query} -is:retweet since:2025-04-11`, // TODO: Deal with dynamic dates
      cursor: null,
      product: 'Top',
    }),
  );
  const url = `https://x.com/i/api/graphql/vqoJiOnCYxkIJ79fePvckg/PostListQuery?variables=${variables}`;
  const res = await requestApi<PostListQueryResponse>(
    url,
    auth,
    'GET',
    undefined,
    undefined, // no body for GET
    true,
  );

  if (!res.success) {
    throw res.err;
  }

  return res.value;
}

// Interface for the InsightsListContextQuery response structure

export interface InsightsListContextQueryResponse {
  data: {
    viewer_v2: {
      user_results: {
        result: {
          __typename: 'User';
          insight_rules: {
            items: Array<{
              rest_id: string;
              core: {
                title: string;
                advanced_query: string;
                created_at: string;
                updated_at: string;
                notifications_enabled: boolean;
              };
              preview: {
                counts: Array<{
                  start_time: number;
                  count: number;
                }>;
              };
              id: string;
            }>;
          };
          id: string;
        };
        id: string;
      };
    };
  };
}

export async function InsightsListContextQuery(
  auth: TwitterAuth,
): Promise<InsightsListContextQueryResponse> {
  const variables = encodeURIComponent(
    JSON.stringify({
      previewsEnabled: true,
    }),
  );

  const url = `https://x.com/i/api/graphql/wDbaSTpre4EH5ED1bDsLTg/InsightsListContextQuery?variables=${variables}`;
  const res = await requestApi<InsightsListContextQueryResponse>(
    url,
    auth,
    'GET',
    undefined,
    undefined, // no body for GET
    true,
  );

  if (!res.success) {
    throw res.err;
  }

  return res.value;
}

export interface DeleteInsightButtonMutationResponse {
  data: {
    delete_insight_rule_v2: {
      __typename: 'InsightRuleMutationSuccess';
      result: {
        rest_id: string;
        id: string;
      };
    };
  };
}

export async function DeleteInsightButtonMutation(
  id: string,
  auth: TwitterAuth,
): Promise<DeleteInsightButtonMutationResponse> {
  const variables = encodeURIComponent(
    JSON.stringify({
      id: id,
    }),
  );

  const url = `https://x.com/i/api/graphql/Ylfgu_WxLasiJaOk2KVWew/DeleteInsightButtonMutation`;
  const res = await requestApi<DeleteInsightButtonMutationResponse>(
    url,
    auth,
    'POST',
    undefined,
    {
      queryId: 'Ylfgu_WxLasiJaOk2KVWew',
      variables: {
        id: id,
      },
    },
    true,
  );

  if (!res.success) {
    throw res.err;
  }

  return res.value;
}
