import { getDate } from "@/utils";
import { analytics } from "@/utils/analytics";

export default async function IndexPage() {
  const pageviews = await analytics.retrievePageViewsByPath(
    "pageview",
    getDate(),
    "/",
  );

  return (
    <main className="container flex flex-col gap-4 mx-auto my-10">
      <p className="text-green-500">Page Views: {pageviews}</p>
      <p className="text-white">home</p>
    </main>
  );
}
