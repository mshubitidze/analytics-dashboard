import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { getDate } from "@/utils";
import { analytics } from "@/utils/analytics";

export default async function AnalyticsPage() {
  const TRACKING_DAYS = 7;
  const pageviews = await analytics.retrieveDays("pageview", TRACKING_DAYS);

  const totalPageviews = pageviews.reduce((acc, curr) => {
    return (
      acc +
      curr.events.reduce((acc, curr) => {
        return acc + (Object.values(curr)?.at(0) ?? 0);
      }, 0)
    );
  }, 0);

  const amtVisitorsToday = pageviews
    .filter((pv) => pv.date === getDate())
    .reduce((acc, curr) => {
      return (
        acc +
        curr.events.reduce((acc, curr) => {
          return acc + (Object.values(curr)[0] ?? 0);
        }, 0)
      );
    }, 0);

  const topCountriesMap = new Map<string, number>();

  for (let i = 0; i < pageviews.length; i++) {
    const day = pageviews[i];
    if (!day) continue;

    for (let j = 0; j < day.events.length; j++) {
      const event = day.events[j];
      if (!event) continue;

      const key = Object.keys(event)[0] ?? "";
      const value = Object.values(event)[0] ?? 0;

      const parsedKey = JSON.parse(key);
      const country = parsedKey?.country;

      if (country) {
        if (topCountriesMap.has(country)) {
          const prevValue = topCountriesMap.get(country) ?? 0;
          topCountriesMap.set(country, prevValue + value);
        } else {
          topCountriesMap.set(country, value);
        }
      }
    }
  }

  const topCountries = Array.from(topCountriesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <main className="w-full py-12 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-6xl mx-auto text-white">
        <AnalyticsDashboard
          avgVisitorsPerDay={(totalPageviews / TRACKING_DAYS).toFixed(1)}
          amtVisitorsToday={amtVisitorsToday}
          timeseriesPageviews={pageviews}
          topCountries={topCountries}
        />
      </div>
    </main>
  );
}
