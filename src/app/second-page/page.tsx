import { getDate } from "@/utils";
import { analytics } from "@/utils/analytics";

export default async function SecondPage() {
  const pageviews = await analytics.retrievePageViewsByPath(
    "pageview",
    getDate(),
    "/second-page",
  );

  return (
    <main className="container flex flex-col gap-4 mx-auto my-10">
      <p className="text-green-500">Page Views: {pageviews}</p>
      <p className="text-white">second page</p>
    </main>
  );
}
