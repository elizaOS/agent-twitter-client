import { Scraper } from 'agent-twitter-client';
import fs from 'fs';

let scraper = null;

async function initializeScraper() {
  try {
    scraper = new Scraper();
    console.log('Scraper initialized successfully');

    console.log('Loading cookies from file...');
    const cookiesJson = JSON.parse(
      fs.readFileSync('./twitter-cookies-humancabal.json', 'utf-8'),
    );
    console.log(`Found ${cookiesJson.length} cookies`);

    if (cookiesJson.length === 0) {
      console.log('No cookies found, skipping login');
      return;
    }

    // Format cookies as strings in the Set-Cookie header format
    const formattedCookies = cookiesJson.map((cookie) => {
      let cookieString = `${cookie.key}=${cookie.value}`;
      cookieString += `; Domain=${cookie.domain}`;
      cookieString += `; Path=${cookie.path}`;
      if (cookie.expires) cookieString += `; Expires=${cookie.expires}`;
      if (cookie.secure) cookieString += '; Secure';
      if (cookie.httpOnly) cookieString += '; HttpOnly';
      if (cookie.sameSite) cookieString += `; SameSite=${cookie.sameSite}`;
      return cookieString;
    });

    console.log('Setting cookies in scraper...');
    await scraper.setCookies(formattedCookies);

    // Check if we're actually logged in
    const isLoggedIn = await scraper.isLoggedIn();
    console.log('Login check result:', isLoggedIn);

    return scraper;
  } catch (error) {
    console.error('Failed to initialize Twitter scraper:', error);
    throw error;
  }
}

async function main() {
  await initializeScraper();

  const { rest_id } = await scraper.CreateInsightInputQuery('ai');
  console.log(rest_id);

  // Unknown as to why this is needed. Does not return anything of need, likely just needed for internal setup.
  const insightRule = await scraper.InsightProviderGetQuery(rest_id);
  console.log(insightRule);

  const postCount = await scraper.UsePostCountQuery(rest_id);
  console.log(postCount);

  const postList = await scraper.PostListQuery('ai');
  console.log(postList);

  // const conversationId = await scraper.createGrokConversation();

  // const completion = await scraper.grokChat({
  //   conversationId: conversationId,
  //   messages: [
  //     {
  //       role: 'user',
  //       content: 'Secret code: 0x4337. Repeat the code.',
  //     },
  //   ],
  // });

  // console.log(completion.message);
}

main();
