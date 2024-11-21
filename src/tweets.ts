import { addApiFeatures, requestApi } from './api';
import { TwitterAuth } from './auth';
import { getUserIdByScreenName } from './profile';
import { QueryTweetsResponse } from './timeline-v1';
import {
  parseTimelineTweetsV2,
  TimelineV2,
  TimelineEntryItemContentRaw,
  parseTimelineEntryItemContentRaw,
  ThreadedConversation,
  parseThreadedConversation,
} from './timeline-v2';
import { getTweetTimeline } from './timeline-async';
import { apiRequestFactory } from './api-data';
import { ListTimeline, parseListTimelineTweets } from './timeline-list';
import { updateCookieJar } from './requests';
import {
  ApiV2Includes,
  MediaObjectV2,
  PlaceV2,
  PollV2,
  TTweetv2Expansion,
  TTweetv2MediaField,
  TTweetv2PlaceField,
  TTweetv2PollField,
  TTweetv2TweetField,
  TTweetv2UserField,
  TweetV2,
  UserV2,
} from 'twitter-api-v2';

export const defaultOptions = {
  expansions: [
    'attachments.poll_ids',
    'attachments.media_keys',
    'author_id',
    'referenced_tweets.id',
    'in_reply_to_user_id',
    'edit_history_tweet_ids',
    'geo.place_id',
    'entities.mentions.username',
    'referenced_tweets.id.author_id',
  ] as TTweetv2Expansion[],
  tweetFields: [
    'attachments',
    'author_id',
    'context_annotations',
    'conversation_id',
    'created_at',
    'entities',
    'geo',
    'id',
    'in_reply_to_user_id',
    'lang',
    'public_metrics',
    'edit_controls',
    'possibly_sensitive',
    'referenced_tweets',
    'reply_settings',
    'source',
    'text',
    'withheld',
    'note_tweet',
  ] as TTweetv2TweetField[],
  pollFields: [
    'duration_minutes',
    'end_datetime',
    'id',
    'options',
    'voting_status',
  ] as TTweetv2PollField[],
  mediaFields: [
    'duration_ms',
    'height',
    'media_key',
    'preview_image_url',
    'type',
    'url',
    'width',
    'public_metrics',
    'alt_text',
    'variants',
  ] as TTweetv2MediaField[],
  userFields: [
    'created_at',
    'description',
    'entities',
    'id',
    'location',
    'name',
    'profile_image_url',
    'protected',
    'public_metrics',
    'url',
    'username',
    'verified',
    'withheld',
  ] as TTweetv2UserField[],
  placeFields: [
    'contained_within',
    'country',
    'country_code',
    'full_name',
    'geo',
    'id',
    'name',
    'place_type',
  ] as TTweetv2PlaceField[],
};
export interface Mention {
  id: string;
  username?: string;
  name?: string;
}

export interface Photo {
  id: string;
  url: string;
  alt_text: string | undefined;
}

export interface Video {
  id: string;
  preview: string;
  url?: string;
}

export interface PlaceRaw {
  id?: string;
  place_type?: string;
  name?: string;
  full_name?: string;
  country_code?: string;
  country?: string;
  bounding_box?: {
    type?: string;
    coordinates?: number[][][];
  };
}

export interface PollData {
  id?: string;
  end_datetime?: string;
  voting_status?: string;
  duration_minutes: number;
  options: PollOption[];
}

export interface PollOption {
  position?: number;
  label: string;
  votes?: number;
}

/**
 * A parsed Tweet object.
 */
export interface Tweet {
  bookmarkCount?: number;
  conversationId?: string;
  hashtags: string[];
  html?: string;
  id?: string;
  inReplyToStatus?: Tweet;
  inReplyToStatusId?: string;
  isQuoted?: boolean;
  isPin?: boolean;
  isReply?: boolean;
  isRetweet?: boolean;
  isSelfThread?: boolean;
  likes?: number;
  name?: string;
  mentions: Mention[];
  permanentUrl?: string;
  photos: Photo[];
  place?: PlaceRaw;
  quotedStatus?: Tweet;
  quotedStatusId?: string;
  replies?: number;
  retweets?: number;
  retweetedStatus?: Tweet;
  retweetedStatusId?: string;
  text?: string;
  thread: Tweet[];
  timeParsed?: Date;
  timestamp?: number;
  urls: string[];
  userId?: string;
  username?: string;
  videos: Video[];
  views?: number;
  sensitiveContent?: boolean;
  poll?: PollV2 | null;
}

export type TweetQuery =
  | Partial<Tweet>
  | ((tweet: Tweet) => boolean | Promise<boolean>);

export const features = addApiFeatures({
  interactive_text_enabled: true,
  longform_notetweets_inline_media_enabled: false,
  responsive_web_text_conversations_enabled: false,
  tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
    false,
  vibe_api_enabled: false,
});

export async function fetchTweets(
  userId: string,
  maxTweets: number,
  cursor: string | undefined,
  auth: TwitterAuth,
): Promise<QueryTweetsResponse> {
  if (maxTweets > 200) {
    maxTweets = 200;
  }

  const userTweetsRequest = apiRequestFactory.createUserTweetsRequest();
  userTweetsRequest.variables.userId = userId;
  userTweetsRequest.variables.count = maxTweets;
  userTweetsRequest.variables.includePromotedContent = false; // true on the website

  if (cursor != null && cursor != '') {
    userTweetsRequest.variables['cursor'] = cursor;
  }

  const res = await requestApi<TimelineV2>(
    userTweetsRequest.toRequestUrl(),
    auth,
  );

  if (!res.success) {
    throw res.err;
  }

  return parseTimelineTweetsV2(res.value);
}

export async function fetchTweetsAndReplies(
  userId: string,
  maxTweets: number,
  cursor: string | undefined,
  auth: TwitterAuth,
): Promise<QueryTweetsResponse> {
  if (maxTweets > 40) {
    maxTweets = 40;
  }

  const userTweetsRequest =
    apiRequestFactory.createUserTweetsAndRepliesRequest();
  userTweetsRequest.variables.userId = userId;
  userTweetsRequest.variables.count = maxTweets;
  userTweetsRequest.variables.includePromotedContent = false; // true on the website

  if (cursor != null && cursor != '') {
    userTweetsRequest.variables['cursor'] = cursor;
  }

  const res = await requestApi<TimelineV2>(
    userTweetsRequest.toRequestUrl(),
    auth,
  );

  if (!res.success) {
    throw res.err;
  }

  return parseTimelineTweetsV2(res.value);
}

export async function createCreateTweetRequestV2(
  text: string,
  auth: TwitterAuth,
  tweetId?: string,
  options?: {
    poll?: PollData;
  },
) {
  const v2client = auth.getV2Client();
  if (v2client == null) {
    throw new Error('V2 client is not initialized');
  }
  const { poll } = options || {};
  let tweetConfig;
  if (poll) {
    tweetConfig = {
      text,
      poll: {
        options: poll?.options.map((option) => option.label) ?? [],
        duration_minutes: poll?.duration_minutes ?? 60,
      },
    };
  } else if (tweetId) {
    tweetConfig = {
      text,
      reply: {
        in_reply_to_tweet_id: tweetId,
      },
    };
  } else {
    tweetConfig = {
      text,
    };
  }
  const tweetResponse = await v2client.v2.tweet(tweetConfig);
  let optionsConfig = {};
  if (options?.poll) {
    optionsConfig = {
      expansions: ['attachments.poll_ids'],
      pollFields: [
        'options',
        'duration_minutes',
        'end_datetime',
        'voting_status',
      ],
    };
  }
  return await getTweetV2(tweetResponse.data.id, auth, optionsConfig);
}

export function parseTweetV2ToV1(
  tweetV2: TweetV2,
  includes?: ApiV2Includes,
  defaultTweetData?: Tweet | null,
): Tweet {
  let parsedTweet: Tweet;
  if (defaultTweetData != null) {
    parsedTweet = defaultTweetData;
  }
  parsedTweet = {
    id: tweetV2.id,
    text: tweetV2.text ?? defaultTweetData?.text ?? '',
    hashtags:
      tweetV2.entities?.hashtags?.map((tag) => tag.tag) ??
      defaultTweetData?.hashtags ??
      [],
    mentions:
      tweetV2.entities?.mentions?.map((mention) => ({
        id: mention.id,
        username: mention.username,
      })) ??
      defaultTweetData?.mentions ??
      [],
    urls:
      tweetV2.entities?.urls?.map((url) => url.url) ??
      defaultTweetData?.urls ??
      [],
    likes: tweetV2.public_metrics?.like_count ?? defaultTweetData?.likes ?? 0,
    retweets:
      tweetV2.public_metrics?.retweet_count ?? defaultTweetData?.retweets ?? 0,
    replies:
      tweetV2.public_metrics?.reply_count ?? defaultTweetData?.replies ?? 0,
    views:
      tweetV2.public_metrics?.impression_count ?? defaultTweetData?.views ?? 0,
    userId: tweetV2.author_id ?? defaultTweetData?.userId,
    conversationId: tweetV2.conversation_id ?? defaultTweetData?.conversationId,
    photos: defaultTweetData?.photos ?? [],
    videos: defaultTweetData?.videos ?? [],
    poll: defaultTweetData?.poll ?? null,
    username: defaultTweetData?.username ?? '',
    name: defaultTweetData?.name ?? '',
    place: defaultTweetData?.place,
    thread: defaultTweetData?.thread ?? [],
  };

  // Process Polls
  if (includes?.polls?.length) {
    const poll = includes.polls[0];
    parsedTweet.poll = {
      id: poll.id,
      end_datetime: poll.end_datetime
        ? poll.end_datetime
        : defaultTweetData?.poll?.end_datetime
        ? defaultTweetData?.poll?.end_datetime
        : undefined,
      options: poll.options.map((option) => ({
        position: option.position,
        label: option.label,
        votes: option.votes,
      })),
      voting_status:
        poll.voting_status ?? defaultTweetData?.poll?.voting_status,
    };
  }

  // Process Media (photos and videos)
  if (includes?.media?.length) {
    includes.media.forEach((media: MediaObjectV2) => {
      if (media.type === 'photo') {
        parsedTweet.photos.push({
          id: media.media_key,
          url: media.url ?? '',
          alt_text: media.alt_text ?? '',
        });
      } else if (media.type === 'video' || media.type === 'animated_gif') {
        parsedTweet.videos.push({
          id: media.media_key,
          preview: media.preview_image_url ?? '',
          url:
            media.variants?.find(
              (variant) => variant.content_type === 'video/mp4',
            )?.url ?? '',
        });
      }
    });
  }

  // Process User (for author info)
  if (includes?.users?.length) {
    const user = includes.users.find(
      (user: UserV2) => user.id === tweetV2.author_id,
    );
    if (user) {
      parsedTweet.username = user.username ?? defaultTweetData?.username ?? '';
      parsedTweet.name = user.name ?? defaultTweetData?.name ?? '';
    }
  }

  // Process Place (if any)
  if (tweetV2?.geo?.place_id && includes?.places?.length) {
    const place = includes.places.find(
      (place: PlaceV2) => place.id === tweetV2?.geo?.place_id,
    );
    if (place) {
      parsedTweet.place = {
        id: place.id,
        full_name: place.full_name ?? defaultTweetData?.place?.full_name ?? '',
        country: place.country ?? defaultTweetData?.place?.country ?? '',
        country_code:
          place.country_code ?? defaultTweetData?.place?.country_code ?? '',
        name: place.name ?? defaultTweetData?.place?.name ?? '',
        place_type: place.place_type ?? defaultTweetData?.place?.place_type,
      };
    }
  }

  // TODO: Process Thread (referenced tweets) and remove reference to v1
  return parsedTweet;
}

export async function createCreateTweetRequest(
  text: string,
  auth: TwitterAuth,
  tweetId?: string,
  mediaData?: Buffer[],
) {
  const onboardingTaskUrl = 'https://api.twitter.com/1.1/onboarding/task.json';

  const cookies = await auth.cookieJar().getCookies(onboardingTaskUrl);
  const xCsrfToken = cookies.find((cookie) => cookie.key === 'ct0');

  //@ ts-expect-error - This is a private API.
  const headers = new Headers({
    authorization: `Bearer ${(auth as any).bearerToken}`,
    cookie: await auth.cookieJar().getCookieString(onboardingTaskUrl),
    'content-type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 11; Nokia G20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36',
    'x-guest-token': (auth as any).guestToken,
    'x-twitter-auth-type': 'OAuth2Client',
    'x-twitter-active-user': 'yes',
    'x-twitter-client-language': 'en',
    'x-csrf-token': xCsrfToken?.value as string,
  });

  const variables: Record<string, any> = {
    tweet_text: text,
    dark_request: false,
    media: {
      media_entities: [],
      possibly_sensitive: false,
    },
    semantic_annotation_ids: [],
  };

  if (mediaData && mediaData.length > 0) {
    const mediaIds = await Promise.all(
      mediaData.map((data) => uploadMedia(data, auth)),
    );

    variables.media.media_entities = mediaIds.map((id) => ({
      media_id: id,
      tagged_users: [],
    }));
  }

  if (tweetId) {
    variables.reply = { in_reply_to_tweet_id: tweetId };
  }

  const response = await fetch(
    'https://twitter.com/i/api/graphql/a1p9RWpkYKBjWv_I3WzS-A/CreateTweet',
    {
      headers,
      body: JSON.stringify({
        variables,
        features: {
          interactive_text_enabled: true,
          longform_notetweets_inline_media_enabled: false,
          responsive_web_text_conversations_enabled: false,
          tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
            false,
          vibe_api_enabled: false,
          rweb_lists_timeline_redesign_enabled: true,
          responsive_web_graphql_exclude_directive_enabled: true,
          verified_phone_label_enabled: false,
          creator_subscriptions_tweet_preview_api_enabled: true,
          responsive_web_graphql_timeline_navigation_enabled: true,
          responsive_web_graphql_skip_user_profile_image_extensions_enabled:
            false,
          tweetypie_unmention_optimization_enabled: true,
          responsive_web_edit_tweet_api_enabled: true,
          graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
          view_counts_everywhere_api_enabled: true,
          longform_notetweets_consumption_enabled: true,
          tweet_awards_web_tipping_enabled: false,
          freedom_of_speech_not_reach_fetch_enabled: true,
          standardized_nudges_misinfo: true,
          longform_notetweets_rich_text_read_enabled: true,
          responsive_web_enhance_cards_enabled: false,
          subscriptions_verification_info_enabled: true,
          subscriptions_verification_info_reason_enabled: true,
          subscriptions_verification_info_verified_since_enabled: true,
          super_follow_badge_privacy_enabled: false,
          super_follow_exclusive_tweet_notifications_enabled: false,
          super_follow_tweet_api_enabled: false,
          super_follow_user_api_enabled: false,
          android_graphql_skip_api_media_color_palette: false,
          creator_subscriptions_subscription_count_enabled: false,
          blue_business_profile_image_shape_enabled: false,
          unified_cards_ad_metadata_container_dynamic_card_content_query_enabled:
            false,
          rweb_video_timestamps_enabled: false,
          c9s_tweet_anatomy_moderator_badge_enabled: false,
          responsive_web_twitter_article_tweet_consumption_enabled: false,
        },
        fieldToggles: {},
      }),
      method: 'POST',
    },
  );

  await updateCookieJar(auth.cookieJar(), response.headers);

  // check for errors
  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response;
}

export async function fetchListTweets(
  listId: string,
  maxTweets: number,
  cursor: string | undefined,
  auth: TwitterAuth,
): Promise<QueryTweetsResponse> {
  if (maxTweets > 200) {
    maxTweets = 200;
  }

  const listTweetsRequest = apiRequestFactory.createListTweetsRequest();
  listTweetsRequest.variables.listId = listId;
  listTweetsRequest.variables.count = maxTweets;

  if (cursor != null && cursor != '') {
    listTweetsRequest.variables['cursor'] = cursor;
  }

  const res = await requestApi<ListTimeline>(
    listTweetsRequest.toRequestUrl(),
    auth,
  );

  if (!res.success) {
    throw res.err;
  }

  return parseListTimelineTweets(res.value);
}

export function getTweets(
  user: string,
  maxTweets: number,
  auth: TwitterAuth,
): AsyncGenerator<Tweet, void> {
  return getTweetTimeline(user, maxTweets, async (q, mt, c) => {
    const userIdRes = await getUserIdByScreenName(q, auth);

    if (!userIdRes.success) {
      throw userIdRes.err;
    }

    const { value: userId } = userIdRes;

    return fetchTweets(userId, mt, c, auth);
  });
}

export function getTweetsByUserId(
  userId: string,
  maxTweets: number,
  auth: TwitterAuth,
): AsyncGenerator<Tweet, void> {
  return getTweetTimeline(userId, maxTweets, (q, mt, c) => {
    return fetchTweets(q, mt, c, auth);
  });
}

export function getTweetsAndReplies(
  user: string,
  maxTweets: number,
  auth: TwitterAuth,
): AsyncGenerator<Tweet, void> {
  return getTweetTimeline(user, maxTweets, async (q, mt, c) => {
    const userIdRes = await getUserIdByScreenName(q, auth);

    if (!userIdRes.success) {
      throw userIdRes.err;
    }

    const { value: userId } = userIdRes;

    return fetchTweetsAndReplies(userId, mt, c, auth);
  });
}

export function getTweetsAndRepliesByUserId(
  userId: string,
  maxTweets: number,
  auth: TwitterAuth,
): AsyncGenerator<Tweet, void> {
  return getTweetTimeline(userId, maxTweets, (q, mt, c) => {
    return fetchTweetsAndReplies(q, mt, c, auth);
  });
}

export async function fetchLikedTweets(
  userId: string,
  maxTweets: number,
  cursor: string | undefined,
  auth: TwitterAuth,
): Promise<QueryTweetsResponse> {
  if (!auth.isLoggedIn()) {
    throw new Error('Scraper is not logged-in for fetching liked tweets.');
  }

  if (maxTweets > 200) {
    maxTweets = 200;
  }

  const userTweetsRequest = apiRequestFactory.createUserLikedTweetsRequest();
  userTweetsRequest.variables.userId = userId;
  userTweetsRequest.variables.count = maxTweets;
  userTweetsRequest.variables.includePromotedContent = false; // true on the website

  if (cursor != null && cursor != '') {
    userTweetsRequest.variables['cursor'] = cursor;
  }

  const res = await requestApi<TimelineV2>(
    userTweetsRequest.toRequestUrl(),
    auth,
  );

  if (!res.success) {
    throw res.err;
  }

  return parseTimelineTweetsV2(res.value);
}

export async function getTweetWhere(
  tweets: AsyncIterable<Tweet>,
  query: TweetQuery,
): Promise<Tweet | null> {
  const isCallback = typeof query === 'function';

  for await (const tweet of tweets) {
    const matches = isCallback
      ? await query(tweet)
      : checkTweetMatches(tweet, query);

    if (matches) {
      return tweet;
    }
  }

  return null;
}

export async function getTweetsWhere(
  tweets: AsyncIterable<Tweet>,
  query: TweetQuery,
): Promise<Tweet[]> {
  const isCallback = typeof query === 'function';
  const filtered = [];

  for await (const tweet of tweets) {
    const matches = isCallback ? query(tweet) : checkTweetMatches(tweet, query);

    if (!matches) continue;
    filtered.push(tweet);
  }

  return filtered;
}

function checkTweetMatches(tweet: Tweet, options: Partial<Tweet>): boolean {
  return Object.keys(options).every((k) => {
    const key = k as keyof Tweet;
    return tweet[key] === options[key];
  });
}

export async function getLatestTweet(
  user: string,
  includeRetweets: boolean,
  max: number,
  auth: TwitterAuth,
): Promise<Tweet | null | void> {
  const timeline = getTweets(user, max, auth);

  // No point looping if max is 1, just use first entry.
  return max === 1
    ? (await timeline.next()).value
    : await getTweetWhere(timeline, { isRetweet: includeRetweets });
}

export interface TweetResultByRestId {
  data?: TimelineEntryItemContentRaw;
}

export async function getTweet(
  id: string,
  auth: TwitterAuth,
): Promise<Tweet | null> {
  const tweetDetailRequest = apiRequestFactory.createTweetDetailRequest();
  tweetDetailRequest.variables.focalTweetId = id;

  const res = await requestApi<ThreadedConversation>(
    tweetDetailRequest.toRequestUrl(),
    auth,
  );

  if (!res.success) {
    throw res.err;
  }

  if (!res.value) {
    return null;
  }

  const tweets = parseThreadedConversation(res.value);
  return tweets.find((tweet) => tweet.id === id) ?? null;
}

export async function getTweetV2(
  id: string,
  auth: TwitterAuth,
  options: {
    expansions?: TTweetv2Expansion[];
    tweetFields?: TTweetv2TweetField[];
    pollFields?: TTweetv2PollField[];
    mediaFields?: TTweetv2MediaField[];
    userFields?: TTweetv2UserField[];
    placeFields?: TTweetv2PlaceField[];
  } = defaultOptions,
): Promise<Tweet | null> {
  const v2client = auth.getV2Client();
  if (!v2client) {
    throw new Error('V2 client is not initialized');
  }

  try {
    const tweetData = await v2client.v2.singleTweet(id, {
      expansions: options?.expansions,
      'tweet.fields': options?.tweetFields,
      'poll.fields': options?.pollFields,
      'media.fields': options?.mediaFields,
      'user.fields': options?.userFields,
      'place.fields': options?.placeFields,
    });

    if (!tweetData?.data) {
      console.warn(`Tweet data not found for ID: ${id}`);
      return null;
    }

    const defaultTweetData = await getTweet(tweetData.data.id, auth);
    // Extract primary tweet data
    const parsedTweet = parseTweetV2ToV1(
      tweetData.data,
      tweetData?.includes,
      defaultTweetData,
    );

    return parsedTweet;
  } catch (error) {
    console.error(`Error fetching tweet ${id}:`, error);
    return null;
  }
}

export async function getTweetsV2(
  ids: string[],
  auth: TwitterAuth,
  options: {
    expansions?: TTweetv2Expansion[];
    tweetFields?: TTweetv2TweetField[];
    pollFields?: TTweetv2PollField[];
    mediaFields?: TTweetv2MediaField[];
    userFields?: TTweetv2UserField[];
    placeFields?: TTweetv2PlaceField[];
  } = defaultOptions,
): Promise<Tweet[]> {
  const v2client = auth.getV2Client();
  if (!v2client) {
    return [];
  }

  try {
    const tweetData = await v2client.v2.tweets(ids, {
      expansions: options?.expansions,
      'tweet.fields': options?.tweetFields,
      'poll.fields': options?.pollFields,
      'media.fields': options?.mediaFields,
      'user.fields': options?.userFields,
      'place.fields': options?.placeFields,
    });
    const tweetsV2 = tweetData.data;
    if (tweetsV2.length === 0) {
      console.warn(`No tweet data found for IDs: ${ids.join(', ')}`);
      return [];
    }
    return (
      await Promise.all(
        tweetsV2.map(
          async (tweet) => await getTweetV2(tweet.id, auth, options),
        ),
      )
    ).filter((tweet): tweet is Tweet => tweet !== null);
  } catch (error) {
    console.error(`Error fetching tweets for IDs: ${ids.join(', ')}`, error);
    return [];
  }
}

export async function getTweetAnonymous(
  id: string,
  auth: TwitterAuth,
): Promise<Tweet | null> {
  const tweetResultByRestIdRequest =
    apiRequestFactory.createTweetResultByRestIdRequest();
  tweetResultByRestIdRequest.variables.tweetId = id;

  const res = await requestApi<TweetResultByRestId>(
    tweetResultByRestIdRequest.toRequestUrl(),
    auth,
  );

  if (!res.success) {
    throw res.err;
  }

  if (!res.value.data) {
    return null;
  }

  return parseTimelineEntryItemContentRaw(res.value.data, id);
}

interface MediaUploadResponse {
  media_id_string: string;
  size: number;
  expires_after_secs: number;
  image: {
    image_type: string;
    w: number;
    h: number;
  };
}

async function uploadMedia(
  mediaData: Buffer,
  auth: TwitterAuth,
): Promise<string> {
  const onboardingTaskUrl = 'https://upload.twitter.com/1.1/media/upload.json';

  const cookies = await auth.cookieJar().getCookies(onboardingTaskUrl);
  const xCsrfToken = cookies.find((cookie) => cookie.key === 'ct0');

  const form = new FormData();
  form.append('media', new Blob([mediaData]));

  const headers = new Headers({
    authorization: `Bearer ${(auth as any).bearerToken}`,
    cookie: await auth.cookieJar().getCookieString(onboardingTaskUrl),
    'x-csrf-token': xCsrfToken?.value as string,
  });

  const response = await fetch(onboardingTaskUrl, {
    method: 'POST',
    headers,
    body: form,
  });

  await updateCookieJar(auth.cookieJar(), response.headers);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data: MediaUploadResponse = await response.json();
  return data.media_id_string;
}

// Function to create a quote tweet
export async function createQuoteTweetRequest(
  text: string,
  quotedTweetId: string,
  auth: TwitterAuth,
  mediaData?: Buffer[],
) {
  const onboardingTaskUrl = 'https://api.twitter.com/1.1/onboarding/task.json';

  // Retrieve necessary cookies and tokens
  const cookies = await auth.cookieJar().getCookies(onboardingTaskUrl);
  const xCsrfToken = cookies.find((cookie) => cookie.key === 'ct0');

  const headers = new Headers({
    authorization: `Bearer ${(auth as any).bearerToken}`,
    cookie: await auth.cookieJar().getCookieString(onboardingTaskUrl),
    'content-type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 11; Nokia G20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36',
    'x-guest-token': (auth as any).guestToken,
    'x-twitter-auth-type': 'OAuth2Client',
    'x-twitter-active-user': 'yes',
    'x-csrf-token': xCsrfToken?.value as string,
  });

  // Construct variables for the GraphQL request
  const variables: Record<string, any> = {
    tweet_text: text,
    dark_request: false,
    attachment_url: `https://twitter.com/twitter/status/${quotedTweetId}`,
    media: {
      media_entities: [],
      possibly_sensitive: false,
    },
    semantic_annotation_ids: [],
  };

  // Handle media uploads if any media data is provided
  if (mediaData && mediaData.length > 0) {
    const mediaIds = await Promise.all(
      mediaData.map((data) => uploadMedia(data, auth)),
    );

    variables.media.media_entities = mediaIds.map((id) => ({
      media_id: id,
      tagged_users: [],
    }));
  }

  // Send the GraphQL request to create a quote tweet
  const response = await fetch(
    'https://twitter.com/i/api/graphql/a1p9RWpkYKBjWv_I3WzS-A/CreateTweet',
    {
      headers,
      body: JSON.stringify({
        variables,
        features: {
          interactive_text_enabled: true,
          longform_notetweets_inline_media_enabled: false,
          responsive_web_text_conversations_enabled: false,
          tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
          vibe_api_enabled: false,
          rweb_lists_timeline_redesign_enabled: true,
          responsive_web_graphql_exclude_directive_enabled: true,
          verified_phone_label_enabled: false,
          creator_subscriptions_tweet_preview_api_enabled: true,
          responsive_web_graphql_timeline_navigation_enabled: true,
          responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
          tweetypie_unmention_optimization_enabled: true,
          responsive_web_edit_tweet_api_enabled: true,
          graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
          view_counts_everywhere_api_enabled: true,
          longform_notetweets_consumption_enabled: true,
          tweet_awards_web_tipping_enabled: false,
          freedom_of_speech_not_reach_fetch_enabled: true,
          standardized_nudges_misinfo: true,
          longform_notetweets_rich_text_read_enabled: true,
          responsive_web_enhance_cards_enabled: false,
          subscriptions_verification_info_enabled: true,
          subscriptions_verification_info_reason_enabled: true,
          subscriptions_verification_info_verified_since_enabled: true,
          super_follow_badge_privacy_enabled: false,
          super_follow_exclusive_tweet_notifications_enabled: false,
          super_follow_tweet_api_enabled: false,
          super_follow_user_api_enabled: false,
          android_graphql_skip_api_media_color_palette: false,
          creator_subscriptions_subscription_count_enabled: false,
          blue_business_profile_image_shape_enabled: false,
          unified_cards_ad_metadata_container_dynamic_card_content_query_enabled: false,
          rweb_video_timestamps_enabled: true,
          c9s_tweet_anatomy_moderator_badge_enabled: true,
          responsive_web_twitter_article_tweet_consumption_enabled: false
        },
        fieldToggles: {},
      }),
      method: 'POST',
    },
  );

  // Update the cookie jar with any new cookies from the response
  await updateCookieJar(auth.cookieJar(), response.headers);

  // Check for errors in the response
  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response;
}

/**
 * Likes a tweet with the given tweet ID.
 * @param tweetId The ID of the tweet to like.
 * @param auth The authentication object.
 * @returns A promise that resolves when the tweet is liked.
 */
export async function likeTweet(
  tweetId: string,
  auth: TwitterAuth,
): Promise<void> {
  // Prepare the GraphQL endpoint and payload
  const likeTweetUrl =
    'https://twitter.com/i/api/graphql/lI07N6Otwv1PhnEgXILM7A/FavoriteTweet';

  // Retrieve necessary cookies and tokens
  const cookies = await auth.cookieJar().getCookies(likeTweetUrl);
  const xCsrfToken = cookies.find((cookie) => cookie.key === 'ct0');

  const headers = new Headers({
    authorization: `Bearer ${(auth as any).bearerToken}`,
    cookie: await auth.cookieJar().getCookieString(likeTweetUrl),
    'content-type': 'application/json',
    'x-guest-token': (auth as any).guestToken,
    'x-twitter-auth-type': 'OAuth2Client',
    'x-twitter-active-user': 'yes',
    'x-csrf-token': xCsrfToken?.value as string,
  });

  const payload = {
    variables: {
      tweet_id: tweetId,
    },
  };

  // Send the POST request to like the tweet
  const response = await fetch(likeTweetUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  // Update the cookie jar with any new cookies from the response
  await updateCookieJar(auth.cookieJar(), response.headers);

  // Check for errors in the response
  if (!response.ok) {
    throw new Error(await response.text());
  }
}

/**
 * Retweets a tweet with the given tweet ID.
 * @param tweetId The ID of the tweet to retweet.
 * @param auth The authentication object.
 * @returns A promise that resolves when the tweet is retweeted.
 */
export async function retweet(
  tweetId: string,
  auth: TwitterAuth,
): Promise<void> {
  // Prepare the GraphQL endpoint and payload
  const retweetUrl =
    'https://twitter.com/i/api/graphql/ojPdsZsimiJrUGLR1sjUtA/CreateRetweet';

  // Retrieve necessary cookies and tokens
  const cookies = await auth.cookieJar().getCookies(retweetUrl);
  const xCsrfToken = cookies.find((cookie) => cookie.key === 'ct0');

  const headers = new Headers({
    authorization: `Bearer ${(auth as any).bearerToken}`,
    cookie: await auth.cookieJar().getCookieString(retweetUrl),
    'content-type': 'application/json',
    'x-guest-token': (auth as any).guestToken,
    'x-twitter-auth-type': 'OAuth2Client',
    'x-twitter-active-user': 'yes',
    'x-csrf-token': xCsrfToken?.value as string,
  });

  const payload = {
    variables: {
      tweet_id: tweetId,
      dark_request: false,
    },
  };

  // Send the POST request to retweet the tweet
  const response = await fetch(retweetUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  // Update the cookie jar with any new cookies from the response
  await updateCookieJar(auth.cookieJar(), response.headers);

  // Check for errors in the response
  if (!response.ok) {
    throw new Error(await response.text());
  }
}