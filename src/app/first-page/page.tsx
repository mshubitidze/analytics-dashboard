import { getDate } from "@/utils";
import { analytics } from "@/utils/analytics";

export default async function FirstPage() {
  const pageviews = await analytics.retrievePageViewsByPath(
    "pageview",
    getDate(),
    "/first-page",
  );

  return (
    <main className="container flex flex-col gap-4 mx-auto my-10">
      <p className="text-green-500">Page Views: {pageviews}</p>
      <p>first page</p>
    </main>
  );
}
