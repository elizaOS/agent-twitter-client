import { requestApi } from './api';
import { TwitterAuth } from './auth';
import { apiRequestFactory } from './api-data';
import { QueryTweetsResponse } from './timeline-v1';
import { parseAndPush, TimelineEntryRaw } from './timeline-v2';
import { Tweet } from './tweets';

export interface BookmarkTimeline {
  data?: {
    bookmark_timeline_v2?: {
      timeline?: {
        instructions?: {
          entries?: TimelineEntryRaw[];
          entry?: TimelineEntryRaw;
          type?: string;
        }[];
      };
    };
  };
}

export function parseBookmarkTimelineTweets(
  timeline: BookmarkTimeline,
): QueryTweetsResponse {
  let bottomCursor: string | undefined;
  let topCursor: string | undefined;
  const tweets: Tweet[] = [];
  const instructions =
    timeline.data?.bookmark_timeline_v2?.timeline?.instructions ?? [];

  for (const instruction of instructions) {
    const entries = instruction.entries ?? [];

    for (const entry of entries) {
      const entryContent = entry.content;
      if (!entryContent) continue;

      if (entryContent.cursorType === 'Bottom') {
        bottomCursor = entryContent.value;
        continue;
      } else if (entryContent.cursorType === 'Top') {
        topCursor = entryContent.value;
        continue;
      }

      const idStr = entry.entryId;
      if (!idStr.startsWith('tweet')) {
        continue;
      }

      if (entryContent.itemContent) {
        parseAndPush(tweets, entryContent.itemContent, idStr);
      } else if (entryContent.items) {
        for (const contentItem of entryContent.items) {
          if (
            contentItem.item &&
            contentItem.item.itemContent &&
            contentItem.entryId
          ) {
            parseAndPush(
              tweets,
              contentItem.item.itemContent,
              contentItem.entryId.split('tweet-')[1],
            );
          }
        }
      }
    }
  }

  return { tweets, next: bottomCursor, previous: topCursor };
}

export async function fetchBookmarks(
  auth: TwitterAuth,
  count = 20,
  cursor?: string,
): Promise<QueryTweetsResponse> {
  if (count > 200) {
    count = 200;
  }

  const bookmarksRequest = apiRequestFactory.createBookmarksRequest();
  if (bookmarksRequest.variables) {
    bookmarksRequest.variables.count = count;
    bookmarksRequest.variables.includePromotedContent = false;

    if (cursor != null && cursor != '') {
      bookmarksRequest.variables['cursor'] = cursor;
    }
  }

  const res = await requestApi<BookmarkTimeline>(
    bookmarksRequest.toRequestUrl(),
    auth,
  );

  if (!res.success) {
    throw res.err;
  }

  return parseBookmarkTimelineTweets(res.value);
}
