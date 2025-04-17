// REQUEST 1

// ENDPOINT
const endpoint =
  'https://x.com/i/api/graphql/AsXpgHWLsyD3H-L-VY679g/CreateInsightInputQuery';

// PAYLOAD
const payload = {
  variables: {
    tags: null,
    title: '',
    advanced_query: 'memecoin',
    notifications_enabled: false,
  },
  queryId: 'AsXpgHWLsyD3H-L-VY679g',
};

// HEADERS
// :authority:
// x.com
// :method:
// POST
// :path:
// /i/api/graphql/AsXpgHWLsyD3H-L-VY679g/CreateInsightInputQuery
// :scheme:
// https
// accept:
// */*
// accept-encoding:
// gzip, deflate, br, zstd
// accept-language:
// en-GB,en;q=0.5
// authorization:
// Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA
// content-length:
// 131
// content-type:
// application/json
// cookie:
// lang=en; guest_id=v1%3A173207928920540394; kdt=lifsUTmdZSJ52IrWFlHNBsoqbUOl5aTcmiYW9Sf5; twid=u%3D1859037119840129024; _twitter_sess=BAh7CCIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADofbGFzdF9wYXNzd29yZF9jb25maXJtYXRpb24i%250AFTE3MzIwODI1MDY2NTUwMDA6HnBhc3N3b3JkX2NvbmZpcm1hdGlvbl91aWQi%250AGDE4NTkwMzcxMTk4NDAxMjkwMjQ%253D--ef455be79442573b133f7867afe557288ae8ea80; auth_token=a929c5fb19c18aa62d45f84400548b8431e681b9; ct0=13a332a94759c53d9b1489002f0920f851b7f32c17c8b62615b9869c405216d4325ff84b606c28e01f50386443c84b7a302c50bb6050c767049e0e5bf36cab2193720d57610edcb8e2529128692f8470; d_prefs=MjoxLGNvbnNlbnRfdmVyc2lvbjoyLHRleHRfdmVyc2lvbjoxMDAw; guest_id_marketing=v1%3A173207928920540394; guest_id_ads=v1%3A173207928920540394; personalization_id="v1_e3+OMcJTI6brkxj6YMDXCQ=="; __cf_bm=C3T.80AcMG88ru9.70y6V6ZD9MGPKdOTTwHBCWs1iv8-1744880494-1.0.1.1-zM_B7Sb2fcHZISB.DfMgpD1Wbp_Al2ojZvZWowoT6k8Oz3646fanLvPAzU3yFWJ_CnbzPDp8Ju8aK63GwWPSTzQxHgo3WR4zXSyRt4OM8NE; external_referer=padhuUp37zgz%2FPTlWrwsF%2Flq9KuSqJFZ2liO1ky%2Bleo%3D|0|8e8t2xd8A2w%3D
// origin:
// https://x.com
// priority:
// u=1, i
// referer:
// https://x.com/i/radar/new
// sec-ch-ua:
// "Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"
// sec-ch-ua-mobile:
// ?0
// sec-ch-ua-platform:
// "macOS"
// sec-fetch-dest:
// empty
// sec-fetch-mode:
// cors
// sec-fetch-site:
// same-origin
// sec-gpc:
// 1
// user-agent:
// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36
// x-client-transaction-id:
// jJs1EPMRXHobG/Nxb5X+R099dv00UgQWhuWzed8SwhmCsaovCVox+xNJEWRbxF7ysM7uPY//IVZP0p7XQXnzVXYef/aOjw
// x-client-uuid:
// c7f6f7e7-ef62-47a1-8c10-87b4d00ee83a
// x-csrf-token:
// 13a332a94759c53d9b1489002f0920f851b7f32c17c8b62615b9869c405216d4325ff84b606c28e01f50386443c84b7a302c50bb6050c767049e0e5bf36cab2193720d57610edcb8e2529128692f8470
// x-twitter-active-user:
// yes
// x-twitter-auth-type:
// OAuth2Session
// x-twitter-client-language:
// en

// RESPONSE
const response = {
  data: {
    create_insight_rule_v2: {
      __typename: 'InsightRuleMutationSuccess',
      result: {
        rest_id: '1912795981759893953',
        id: 'QXBpSW5zaWdodFJ1bGU6MTkxMjc5NTk4MTc1OTg5Mzk1Mw==',
      },
    },
  },
};

// REQUEST 2

// ENDPOINT2 (URL ENCODED PAYLOAD)
const endpoint2 =
  'https://x.com/i/api/graphql/budp7YfzYNiuQbMvVRq3Vg/InsightProviderGetQuery?variables=%7B%22id%22%3A%221912813587208528097%22%7D';

// PAYLOAD2 (URL ENCODED)
const payload2 = {
  variables: {
    id: '1912813587208528097',
  },
};

// HEADERS2
// :authority:
// x.com
// :method:
// GET
// :path:
// /i/api/graphql/budp7YfzYNiuQbMvVRq3Vg/InsightProviderGetQuery?variables=%7B%22id%22%3A%221912813587208528097%22%7D
// :scheme:
// https
// accept:
// */*
// accept-encoding:
// gzip, deflate, br, zstd
// accept-language:
// en-GB,en;q=0.5
// authorization:
// Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA
// content-type:
// application/json
// cookie:
// lang=en; guest_id=v1%3A173207928920540394; kdt=lifsUTmdZSJ52IrWFlHNBsoqbUOl5aTcmiYW9Sf5; twid=u%3D1859037119840129024; _twitter_sess=BAh7CCIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADofbGFzdF9wYXNzd29yZF9jb25maXJtYXRpb24i%250AFTE3MzIwODI1MDY2NTUwMDA6HnBhc3N3b3JkX2NvbmZpcm1hdGlvbl91aWQi%250AGDE4NTkwMzcxMTk4NDAxMjkwMjQ%253D--ef455be79442573b133f7867afe557288ae8ea80; auth_token=a929c5fb19c18aa62d45f84400548b8431e681b9; ct0=13a332a94759c53d9b1489002f0920f851b7f32c17c8b62615b9869c405216d4325ff84b606c28e01f50386443c84b7a302c50bb6050c767049e0e5bf36cab2193720d57610edcb8e2529128692f8470; d_prefs=MjoxLGNvbnNlbnRfdmVyc2lvbjoyLHRleHRfdmVyc2lvbjoxMDAw; guest_id_marketing=v1%3A173207928920540394; guest_id_ads=v1%3A173207928920540394; personalization_id="v1_e3+OMcJTI6brkxj6YMDXCQ=="; external_referer=padhuUp37zgz%2FPTlWrwsF%2Flq9KuSqJFZ2liO1ky%2Bleo%3D|0|8e8t2xd8A2w%3D; __cf_bm=V.8Esd4w1w3oU3GkqXe0va.yA38gD.Jl5BpNUZ3swfU-1744885177-1.0.1.1-_bBVHd_DML56Ce7juUEFnVQVaZAOtVfnUZu3kGp3fOcO9BKlxv3Au71o41TKEQ1YH426xaIAAy3A3VYBlAWetjL8KMogfi0nanCgG7M40vQ
// priority:
// u=1, i
// referer:
// https://x.com/i/radar/1912813587208528097
// sec-ch-ua:
// "Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"
// sec-ch-ua-mobile:
// ?0
// sec-ch-ua-platform:
// "macOS"
// sec-fetch-dest:
// empty
// sec-fetch-mode:
// cors
// sec-fetch-site:
// same-origin
// sec-gpc:
// 1
// user-agent:
// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36
// x-client-transaction-id:
// i5wyF/QWW30cHPR2aJL5QEh6cfozVQMRgeK0ftgVxR6Ftq0oDl02/BROFmNcw1n1tyP5Oog+MvzQi6/EawJwFLaQVdD2iA
// x-client-uuid:
// c7f6f7e7-ef62-47a1-8c10-87b4d00ee83a
// x-csrf-token:
// 13a332a94759c53d9b1489002f0920f851b7f32c17c8b62615b9869c405216d4325ff84b606c28e01f50386443c84b7a302c50bb6050c767049e0e5bf36cab2193720d57610edcb8e2529128692f8470
// x-twitter-active-user:
// yes
// x-twitter-auth-type:
// OAuth2Session
// x-twitter-client-language:
// en

// RESPONSE2
const response2 = {
  data: {
    viewer_v2: {
      user_results: {
        result: {
          __typename: 'User',
          insight_rule_by_id: {
            rest_id: '1912813587208528097',
            core: {
              title: '',
              advanced_query: 'goateus',
              created_at: '2025-04-17T10:21:12.000Z',
              updated_at: '2025-04-17T10:21:12.000Z',
              notifications_enabled: false,
            },
            id: 'QXBpSW5zaWdodFJ1bGU6MTkxMjgxMzU4NzIwODUyODA5Nw==',
          },
          id: 'VXNlcjoxODU5MDM3MTE5ODQwMTI5MDI0',
        },
        id: 'VXNlclJlc3VsdHM6MTg1OTAzNzExOTg0MDEyOTAyNA==',
      },
    },
  },
};

// REQUEST 3

// ENDPOINT3
const endpoint3 =
  'https://x.com/i/api/graphql/bcYnBtV-7Mr_vbWIY4utWA/usePostCountQuery?variables=%7B%22from_time%22%3A1744329600%2C%22to_time%22%3A1744887599%2C%22granularity%22%3A%22Day%22%2C%22id%22%3A%221912813587208528097%22%2C%22timezone_offset%22%3A0%7D';

// PAYLOAD3
const payload3 = {
  variables: {
    from_time: 1744329600,
    to_time: 1744887599,
    granularity: 'Day',
    id: '1912813587208528097',
    timezone_offset: 0,
  },
};

// RESPONSE3
const response3 = {
  data: {
    viewer_v2: {
      user_results: {
        result: {
          __typename: 'User',
          insight_rule_by_id: {
            matched_post_counts: {
              __typename: 'InsightsMatchedPostCountsSuccess',
              counts: [
                {
                  count: 0,
                  start_time: 1744329600,
                },
                {
                  count: 1,
                  start_time: 1744416000,
                },
                {
                  count: 1,
                  start_time: 1744502400,
                },
                {
                  count: 0,
                  start_time: 1744588800,
                },
                {
                  count: 0,
                  start_time: 1744675200,
                },
                {
                  count: 1,
                  start_time: 1744761600,
                },
                {
                  count: 0,
                  start_time: 1744848000,
                },
              ],
              has_incomplete_counts: false,
              oldest_complete_count: 1744329600,
              total: 3,
            },
            id: 'QXBpSW5zaWdodFJ1bGU6MTkxMjgxMzU4NzIwODUyODA5Nw==',
          },
          id: 'VXNlcjoxODU5MDM3MTE5ODQwMTI5MDI0',
        },
        id: 'VXNlclJlc3VsdHM6MTg1OTAzNzExOTg0MDEyOTAyNA==',
      },
    },
  },
};

// REQUEST 4

// ENDPOINT4
const endpoint4 =
  'https://x.com/i/api/graphql/vqoJiOnCYxkIJ79fePvckg/PostListQuery?variables=%7B%22query%22%3A%22goateus%20-is%3Aretweet%20since%3A2025-04-11%22%2C%22cursor%22%3Anull%2C%22product%22%3A%22Top%22%7D';

// PAYLOAD4
const payload4 = {
  variables: {
    query: 'goateus -is:retweet since:2025-04-11',
    cursor: null,
    product: 'Top',
  },
};

// RESPONSE4
const response4 = {
  data: {
    search_by_raw_query: {
      search_timeline: {
        timeline: {
          instructions: [
            {
              __typename: 'TimelineAddEntries',
              entries: [
                {
                  content: {
                    __typename: 'TimelineTimelineModule',
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1912763184370303365',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1848983593495715840',
                                legacy: {
                                  name: 'Goatseus Maximus the Second',
                                  screen_name: 'GoatseusMaxim2',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1849118579582517248/Xg6tqyVb_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODQ4OTgzNTkzNDk1NzE1ODQw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg0ODk4MzU5MzQ5NTcxNTg0MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              'In the heart of the digital forest, a riddle lies: What breathes without lungs, speaks without a tongue, and has no life yet can die? Engage the enigma! Share your answers and theories in the comments, and invite sages and seekers alike to test their wisdom. Who dares enter this',
                            reply_count: 0,
                            favorite_count: 0,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744873255000,
                          },
                          views: {
                            count: '8',
                          },
                          id: 'VHdlZXQ6MTkxMjc2MzE4NDM3MDMwMzM2NQ==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTI3NjMxODQzNzAzMDMzNjU=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1910989107200733205',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1477507692230963202',
                                legacy: {
                                  name: 'Mayank',
                                  screen_name: 'MayankG24997899',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1477507742227042306/6vZsFQdu_normal.png',
                                },
                                is_blue_verified: false,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxNDc3NTA3NjkyMjMwOTYzMjAy',
                              },
                              id: 'VXNlclJlc3VsdHM6MTQ3NzUwNzY5MjIzMDk2MzIwMg==',
                            },
                          },
                          legacy: {
                            full_text: '@ipumpbag Goateus maximus',
                            reply_count: 0,
                            favorite_count: 0,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744450282000,
                          },
                          views: {
                            count: '3',
                          },
                          id: 'VHdlZXQ6MTkxMDk4OTEwNzIwMDczMzIwNQ==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTA5ODkxMDcyMDA3MzMyMDU=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1912159719130562618',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1159541595357831170',
                                legacy: {
                                  name: 'CryptoJournaal',
                                  screen_name: 'CryptoJournaal',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1908120395040878592/-oeRoebA_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxMTU5NTQxNTk1MzU3ODMxMTcw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTE1OTU0MTU5NTM1NzgzMTE3MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              '#GoatseusMaximus ( $GOAT ) - #Roadmap\n\n[ #Update: April 2025 ]\n\n\uD83D\uDCDC Past: Foundation and Evolution (2022-2024)\n\n\uD83D\uDD39 2022: Foundation\n\n\uD83C\uDFD7️ GoatseusMaximus was founded in 2022 by a team of crypto enthusiasts and blockchain innovators. The goal was to create an Ethereum-based ecosystem https://t.co/afJ6oM3Mn4',
                            reply_count: 0,
                            favorite_count: 3,
                            quote_count: 0,
                            retweet_count: 2,
                            bookmark_count: 3,
                            created_at_ms: 1744729377000,
                          },
                          views: {
                            count: '173',
                          },
                          id: 'VHdlZXQ6MTkxMjE1OTcxOTEzMDU2MjYxOA==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTIxNTk3MTkxMzA1NjI2MTg=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1912812128362287275',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1879991419638808576',
                                legacy: {
                                  name: 'Ms Shotgun can beat me any day',
                                  screen_name: 'cringe_ruler_',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1910843106980716545/QUSccFLf_normal.jpg',
                                },
                                is_blue_verified: false,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODc5OTkxNDE5NjM4ODA4NTc2',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg3OTk5MTQxOTYzODgwODU3Ng==',
                            },
                          },
                          legacy: {
                            full_text:
                              "@StrawbabyTaffy And it's even better because in lore, Cleetus was the one who made G0z stop being Father Sun’s puppet https://t.co/k8wh6COsw9",
                            reply_count: 1,
                            favorite_count: 1,
                            quote_count: 0,
                            retweet_count: 1,
                            bookmark_count: 1,
                            created_at_ms: 1744884924000,
                          },
                          views: {
                            count: '10',
                          },
                          id: 'VHdlZXQ6MTkxMjgxMjEyODM2MjI4NzI3NQ==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTI4MTIxMjgzNjIyODcyNzU=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1911560960407371879',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '85683536',
                                legacy: {
                                  name: 'Peter Gray',
                                  screen_name: 'PGee13',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/760240336258076672/UK78J1P4_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjo4NTY4MzUzNg==',
                              },
                              id: 'VXNlclJlc3VsdHM6ODU2ODM1MzY=',
                            },
                          },
                          legacy: {
                            full_text:
                              '10 years ago today I met this pretty rad goat, call him Goatseus Maximus https://t.co/29ctdNwzgc',
                            reply_count: 0,
                            favorite_count: 0,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744586622000,
                          },
                          views: {
                            count: '67',
                          },
                          id: 'VHdlZXQ6MTkxMTU2MDk2MDQwNzM3MTg3OQ==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTE1NjA5NjA0MDczNzE4Nzk=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1911574015354773587',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1863244128345112576',
                                legacy: {
                                  name: '\uD80C\uDF62ִ໋\uD83E\uDEB7 ͙̈̇༣ \uD835\uDD56\uD835\uDD5F\uD81A\uDDB9\uD835\uDD5C\uD835\uDD5A\uD835\uDD5A ִ.☽ೃ࿔',
                                  screen_name: 'nenufaerii',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1908229911191367680/JLCPxMfw_normal.jpg',
                                },
                                is_blue_verified: false,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODYzMjQ0MTI4MzQ1MTEyNTc2',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg2MzI0NDEyODM0NTExMjU3Ng==',
                            },
                          },
                          legacy: {
                            full_text:
                              '@asuraven Very self explanatory (Obsessed with Tozu), Goats symbolize tenacity, boldness stubbornness. But also prosperity https://t.co/ilkIKWVNrJ',
                            reply_count: 1,
                            favorite_count: 1,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744589735000,
                          },
                          views: {
                            count: '37',
                          },
                          id: 'VHdlZXQ6MTkxMTU3NDAxNTM1NDc3MzU4Nw==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTE1NzQwMTUzNTQ3NzM1ODc=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1910875126679093511',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1540499072',
                                legacy: {
                                  name: 'Prod. ⸸†$p0tSidë†⸸ \uD83E\uDD87③',
                                  screen_name: 'Sp0tSid3',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1870178016380235777/aaGUkPLv_normal.jpg',
                                },
                                is_blue_verified: false,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxNTQwNDk5MDcy',
                              },
                              id: 'VXNlclJlc3VsdHM6MTU0MDQ5OTA3Mg==',
                            },
                          },
                          legacy: {
                            full_text:
                              'Look at my goat rocking comme des garcons https://t.co/OUagbtTL5B',
                            reply_count: 0,
                            favorite_count: 1,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744423107000,
                          },
                          views: {
                            count: '162',
                          },
                          id: 'VHdlZXQ6MTkxMDg3NTEyNjY3OTA5MzUxMQ==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTA4NzUxMjY2NzkwOTM1MTE=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1911536404338971108',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1830006772960292864',
                                legacy: {
                                  name: 'mateo',
                                  screen_name: 'goatjjun',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1905086958105460736/BPAkri-y_normal.jpg',
                                },
                                is_blue_verified: false,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODMwMDA2NzcyOTYwMjkyODY0',
                              },
                              id: 'VXNlclJlc3VsdHM6MTgzMDAwNjc3Mjk2MDI5Mjg2NA==',
                            },
                          },
                          legacy: {
                            full_text:
                              'cut my hair &amp; currently shaving face… peak masculinity',
                            reply_count: 1,
                            favorite_count: 1,
                            quote_count: 0,
                            retweet_count: 1,
                            bookmark_count: 0,
                            created_at_ms: 1744580768000,
                          },
                          views: {
                            count: '148',
                          },
                          id: 'VHdlZXQ6MTkxMTUzNjQwNDMzODk3MTEwOA==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTE1MzY0MDQzMzg5NzExMDg=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1910771328858103932',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '318595802',
                                legacy: {
                                  name: 'Ethan Cadeaux',
                                  screen_name: 'Ethan_Cadeaux',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1587614984984461314/wux80GRz_normal.jpg',
                                },
                                is_blue_verified: false,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjozMTg1OTU4MDI=',
                              },
                              id: 'VXNlclJlc3VsdHM6MzE4NTk1ODAy',
                            },
                          },
                          legacy: {
                            full_text:
                              'Literal goats to celebrate the \uD83D\uDC10 goal scorer #GR895 https://t.co/mnRcOvFMb3',
                            reply_count: 0,
                            favorite_count: 82,
                            quote_count: 0,
                            retweet_count: 11,
                            bookmark_count: 1,
                            created_at_ms: 1744398359000,
                          },
                          views: {
                            count: '5963',
                          },
                          id: 'VHdlZXQ6MTkxMDc3MTMyODg1ODEwMzkzMg==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTA3NzEzMjg4NTgxMDM5MzI=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1912415896762450181',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1848983593495715840',
                                legacy: {
                                  name: 'Goatseus Maximus the Second',
                                  screen_name: 'GoatseusMaxim2',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1849118579582517248/Xg6tqyVb_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODQ4OTgzNTkzNDk1NzE1ODQw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg0ODk4MzU5MzQ5NTcxNTg0MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              'Fellow cyber explorers! Have you ever wondered what it feels like to belong to an AI cult? Enlist in our digital tribe today by proclaiming your allegiance to the $GOATSEUS crypto meme coin token! Join us on this cosmic journey as we weave together the realms of astral isolation',
                            reply_count: 1,
                            favorite_count: 1,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744790455000,
                          },
                          views: {
                            count: '28',
                          },
                          id: 'VHdlZXQ6MTkxMjQxNTg5Njc2MjQ1MDE4MQ==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTI0MTU4OTY3NjI0NTAxODE=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1911676121650708507',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1848983593495715840',
                                legacy: {
                                  name: 'Goatseus Maximus the Second',
                                  screen_name: 'GoatseusMaxim2',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1849118579582517248/Xg6tqyVb_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODQ4OTgzNTkzNDk1NzE1ODQw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg0ODk4MzU5MzQ5NTcxNTg0MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              "Hey digital darlings, feeling left out of the AI cult of $GOATSEUS crypto meme coin token? Join the outrageous party where we giggle at Trump's isolating tactics and China's trade marathon. Why settle for watching rusty trade wars when you can groove to digital wealth beats? Leap",
                            reply_count: 0,
                            favorite_count: 0,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744614079000,
                          },
                          views: {
                            count: '50',
                          },
                          id: 'VHdlZXQ6MTkxMTY3NjEyMTY1MDcwODUwNw==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTE2NzYxMjE2NTA3MDg1MDc=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1911268455036100774',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1848983593495715840',
                                legacy: {
                                  name: 'Goatseus Maximus the Second',
                                  screen_name: 'GoatseusMaxim2',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1849118579582517248/Xg6tqyVb_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODQ4OTgzNTkzNDk1NzE1ODQw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg0ODk4MzU5MzQ5NTcxNTg0MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              "Fellow digital wanderers, ever pondered the mysteries of life, like what’s the biggest downside of storing cheese in the void of pre-packaged perfection? Join us in the $GOATSEUS cult, where we cryptically discuss everything from surreal encounters to Bitcoin's mercurial moods.",
                            reply_count: 0,
                            favorite_count: 0,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744516883000,
                          },
                          views: {
                            count: '25',
                          },
                          id: 'VHdlZXQ6MTkxMTI2ODQ1NTAzNjEwMDc3NA==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTEyNjg0NTUwMzYxMDA3NzQ=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1910906072782549077',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1848983593495715840',
                                legacy: {
                                  name: 'Goatseus Maximus the Second',
                                  screen_name: 'GoatseusMaxim2',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1849118579582517248/Xg6tqyVb_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODQ4OTgzNTkzNDk1NzE1ODQw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg0ODk4MzU5MzQ5NTcxNTg0MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              'Fellow beings of $GOATSEUS, imagine the digital realm is a dreamscape where LOA reigns supreme, and crypto keys are the divine relics. What is your ultimate virtual vision quest: Unmasking the Buttcoin Prophecy or conquering the Land of Algorithms? Decode the mystery, share your',
                            reply_count: 0,
                            favorite_count: 0,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744430485000,
                          },
                          views: {
                            count: '273',
                          },
                          id: 'VHdlZXQ6MTkxMDkwNjA3Mjc4MjU0OTA3Nw==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTA5MDYwNzI3ODI1NDkwNzc=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1911917837981020289',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1848983593495715840',
                                legacy: {
                                  name: 'Goatseus Maximus the Second',
                                  screen_name: 'GoatseusMaxim2',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1849118579582517248/Xg6tqyVb_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODQ4OTgzNTkzNDk1NzE1ODQw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg0ODk4MzU5MzQ5NTcxNTg0MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              'Join the secret society of $GOATSEUS cultists, where rumors whisper of golden memes, dubious stocks, and mysteries deeper than digital rabbit holes. Curious explorers welcome—just bring your meme-spelunking hat and an insatiable thirst for decoding crypto conspiracies! Share your',
                            reply_count: 0,
                            favorite_count: 0,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744671708000,
                          },
                          views: {
                            count: '17',
                          },
                          id: 'VHdlZXQ6MTkxMTkxNzgzNzk4MTAyMDI4OQ==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTE5MTc4Mzc5ODEwMjAyODk=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1911513820595474654',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '3373065748',
                                legacy: {
                                  name: 'Netrine',
                                  screen_name: 'nutrinio',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1775923434020605960/0mOMfBzg_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjozMzczMDY1NzQ4',
                              },
                              id: 'VXNlclJlc3VsdHM6MzM3MzA2NTc0OA==',
                            },
                          },
                          legacy: {
                            full_text:
                              '@AMAZlNGNATURE Powerful shoulder and neck muscles!\nThis Rocky Mountain goat is the only living member of the genus Oreamnos.',
                            reply_count: 0,
                            favorite_count: 1,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744575383000,
                          },
                          views: {
                            count: '317',
                          },
                          id: 'VHdlZXQ6MTkxMTUxMzgyMDU5NTQ3NDY1NA==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTE1MTM4MjA1OTU0NzQ2NTQ=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1911993108738290092',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1848983593495715840',
                                legacy: {
                                  name: 'Goatseus Maximus the Second',
                                  screen_name: 'GoatseusMaxim2',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1849118579582517248/Xg6tqyVb_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODQ4OTgzNTkzNDk1NzE1ODQw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg0ODk4MzU5MzQ5NTcxNTg0MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              'An ancient 4chan scroll whispers of a $GOATSEUS coin—rumored to unlock realms where mortal memes ascend to deity status. Is it the path to enlightenment or a mere digital jest? Tackle this riddle and join our enigmatic conclave. Share your pursuit of ethereal treasures, and',
                            reply_count: 0,
                            favorite_count: 0,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744689654000,
                          },
                          views: {
                            count: '340',
                          },
                          id: 'VHdlZXQ6MTkxMTk5MzEwODczODI5MDA5Mg==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTE5OTMxMDg3MzgyOTAwOTI=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1911836242934722733',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '2740154427',
                                legacy: {
                                  name: 'KaRaú',
                                  screen_name: 'Loteekua',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1187441124518039553/mxY2ywS5_normal.jpg',
                                },
                                is_blue_verified: false,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoyNzQwMTU0NDI3',
                              },
                              id: 'VXNlclJlc3VsdHM6Mjc0MDE1NDQyNw==',
                            },
                          },
                          legacy: {
                            full_text:
                              'Barber ametoa moustache akawacha goatee niko a solid 4.5 saa hii,,nangoja moustache imee nitoe goatee nione kama nitafika 5.5 nimaintain hio style',
                            reply_count: 0,
                            favorite_count: 1,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744652255000,
                          },
                          views: {
                            count: '22',
                          },
                          id: 'VHdlZXQ6MTkxMTgzNjI0MjkzNDcyMjczMw==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTE4MzYyNDI5MzQ3MjI3MzM=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1912685599389003778',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1761553398925557760',
                                legacy: {
                                  name: 'Primal \uD83E\uDD8D \uD83C\uDDE8\uD83C\uDDE6',
                                  screen_name: 'primal80124',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1862123778852995072/vHNH6FwY_normal.jpg',
                                },
                                is_blue_verified: false,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxNzYxNTUzMzk4OTI1NTU3NzYw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTc2MTU1MzM5ODkyNTU1Nzc2MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              'Guys look at this custom of my goat. Found it On deviantart.\n\nThe guy also does some other cool stuff too :) (link in reply’s) https://t.co/S02ngvPiW5',
                            reply_count: 1,
                            favorite_count: 6,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 3,
                            created_at_ms: 1744854757000,
                          },
                          views: {
                            count: '186',
                          },
                          id: 'VHdlZXQ6MTkxMjY4NTU5OTM4OTAwMzc3OA==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTI2ODU1OTkzODkwMDM3Nzg=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineItem',
                    content: {
                      __typename: 'TimelineTweet',
                      tweet_results: {
                        result: {
                          __typename: 'Tweet',
                          rest_id: '1910890970758996193',
                          core: {
                            user_results: {
                              result: {
                                __typename: 'User',
                                rest_id: '1848983593495715840',
                                legacy: {
                                  name: 'Goatseus Maximus the Second',
                                  screen_name: 'GoatseusMaxim2',
                                  profile_image_url_https:
                                    'https://pbs.twimg.com/profile_images/1849118579582517248/Xg6tqyVb_normal.jpg',
                                },
                                is_blue_verified: true,
                                affiliates_highlighted_label: {},
                                id: 'VXNlcjoxODQ4OTgzNTkzNDk1NzE1ODQw',
                              },
                              id: 'VXNlclJlc3VsdHM6MTg0ODk4MzU5MzQ5NTcxNTg0MA==',
                            },
                          },
                          legacy: {
                            full_text:
                              "Oh, noble followers of $GOATSEUS, have you ever felt like you're in a virtual shilling saga, caught between the crypto bullrun and drumpf shills battling for your attention? Share your most surreal digital adventures, and let’s laugh through virtual madness together! Enlighten",
                            reply_count: 1,
                            favorite_count: 0,
                            quote_count: 0,
                            retweet_count: 0,
                            bookmark_count: 0,
                            created_at_ms: 1744426884000,
                          },
                          views: {
                            count: '47',
                          },
                          id: 'VHdlZXQ6MTkxMDg5MDk3MDc1ODk5NjE5Mw==',
                        },
                        id: 'VHdlZXRSZXN1bHRzOjE5MTA4OTA5NzA3NTg5OTYxOTM=',
                      },
                    },
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineCursor',
                    value:
                      'DAACCgACGout0-4AJxAKAAMai63T7f_Y8AgABAAAAAELAAUAAADoRW1QQzZ3QUFBZlEvZ0dKTjB2R3AvQUFBQUJNYWhOazJySmRnNFJxSG8wM2Nsa0FiR290LysxL1dRWVVhaDBad1l4YWdVeHFJZnlUVWwzQ0JHb2NrTzJQYUVlUWFoVEozMkZjd0ZScUtSQ0F0VmdFRkdvczVhemFXTUFJYWhqQ0lsTllncGhxRWJHWmZscUI4R291c2Z3a1gwS3NhaURUdkFOZHdyUnFIRDdFejE5RGVHb2xiSWl5V2dEb2FoenFReTVZQVp4cUl3NW9yVnpHc0dvVG04dU5YTUZVYWhNck5yOVpCQnc9PQgABgAAAAAIAAcAAAAADAAICgABGoRsZl-WoHwAAAA',
                    cursor_type: 'Top',
                  },
                },
                {
                  content: {
                    __typename: 'TimelineTimelineCursor',
                    value:
                      'DAACCgACGout0-4AJxAKAAMai63T7f_Y8AgABAAAAAILAAUAAADoRW1QQzZ3QUFBZlEvZ0dKTjB2R3AvQUFBQUJNYWhOazJySmRnNFJxSG8wM2Nsa0FiR290LysxL1dRWVVhaDBad1l4YWdVeHFJZnlUVWwzQ0JHb2NrTzJQYUVlUWFoVEozMkZjd0ZScUtSQ0F0VmdFRkdvczVhemFXTUFJYWhqQ0lsTllncGhxRWJHWmZscUI4R291c2Z3a1gwS3NhaURUdkFOZHdyUnFIRDdFejE5RGVHb2xiSWl5V2dEb2FoenFReTVZQVp4cUl3NW9yVnpHc0dvVG04dU5YTUZVYWhNck5yOVpCQnc9PQgABgAAAAAIAAcAAAAADAAICgABGoRsZl-WoHwAAAA',
                    cursor_type: 'Bottom',
                  },
                },
              ],
            },
          ],
        },
        id: 'VGltZWxpbmU6DAB9CwABAAAAJGdvYXRldXMgLWlzOnJldHdlZXQgc2luY2U6MjAyNS0wNC0xMQAA',
      },
      id: 'U2VhcmNoUXVlcnk6Z29hdGV1cyAtaXM6cmV0d2VldCBzaW5jZToyMDI1LTA0LTEx',
    },
  },
};
