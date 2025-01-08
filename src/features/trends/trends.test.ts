import { getScraper } from "../../core/utils/test-utils";

test('scraper can get trends', async () => {
  const scraper = await getScraper();
  const trends = await scraper.getTrends();
  expect(trends).toHaveLength(20);
  trends.forEach((trend) => expect(trend).not.toBeFalsy());
}, 15000);
