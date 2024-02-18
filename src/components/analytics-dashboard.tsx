"use client";

import { analytics } from "@/utils/analytics";
import { BarChart, Card } from "@tremor/react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

interface AnalyticsDashboardProps {
  avgVisitorsPerDay: string;
  amtVisitorsToday: number;
  timeseriesPageviews: Awaited<ReturnType<typeof analytics.retrieveDays>>;
  topCountries: [string, number][];
}

function Badge({ percentage }: { percentage: number }) {
  const isPositive = percentage > 0;
  const isNeutral = percentage === 0;
  const positiveClassname = "bg-green-900/25 text-green-400 ring-green-400/25";
  const neutralClassname = "bg-zinc-900/25 text-zinc-400 ring-zinc-400/25";
  const negativeClassname = "bg-red-900/25 text-red-400 ring-red-400/25";

  if (Number.isNaN(percentage)) return null;
  return (
    <span
      className={`inline-flex gap-1 items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        isPositive
          ? positiveClassname
          : isNeutral
            ? neutralClassname
            : negativeClassname
      }`}
    >
      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : null}
      {isNeutral ? <ArrowRight className="h-3 w-3" /> : null}
      {!isPositive ? <ArrowDownRight className="h-3 w-3" /> : null}
      {percentage.toFixed(0)}%
    </span>
  );
}
export function AnalyticsDashboard({
  avgVisitorsPerDay,
  amtVisitorsToday,
  timeseriesPageviews,
  topCountries,
}: AnalyticsDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid w-full mx-auto grid-cols-1 sm:grid-cols-2">
        <Card className="w-full mx-auto max-w-xs flex flex-col gap-2">
          <p className="text-tremor-default text-dark-tremor-content">
            Avg. visitors/day
          </p>
          <p className="text-3xl font-semibold text-dark-tremor-content-strong">
            {avgVisitorsPerDay}
          </p>
        </Card>
        <Card className="w-full mx-auto max-w-xs flex flex-col gap-2">
          <p className="flex items-center gap-2.5 text-tremor-default text-dark-tremor-content">
            Visitors Today
            <Badge
              percentage={
                (amtVisitorsToday / Number(avgVisitorsPerDay) - 1) * 100
              }
            />
          </p>
          <p className="text-3xl font-semibold text-dark-tremor-content-strong">
            {amtVisitorsToday}
          </p>
        </Card>
      </div>
      <Card className="flex flex-col sm:grid grid-cols-4 gap-6">
        <h2 className="w-full text-dark-tremor-content-strong text-center sm:text-left font-semibold text-xl">
          This weeks top visitors:
        </h2>
        <div className="col-span-3 flex items-center justify-center flex-wrap gap-8">
          {topCountries?.map(([countryCode, count]) => {
            return (
              <div
                key={countryCode}
                className="flex items-center gap-3 text-dark-tremor-content-strong"
              >
                <p className="hidden sm:block text-tremor-content">
                  {countryCode}
                </p>
                <ReactCountryFlag
                  countryCode={countryCode}
                  className="text-5xl sm:text-3xl"
                  svg
                />
                <p className="text-tremor-content sm:text-dark-tremor-content-strong">
                  {count}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        {timeseriesPageviews ? (
          <BarChart
            allowDecimals={false}
            showAnimation
            data={timeseriesPageviews.map((day) => ({
              name: day.date,
              Visitors: day.events.reduce(
                (acc, curr) => acc + (Object.values(curr)[0] ?? 0),
                0,
              ),
            }))}
            categories={["Visitors"]}
            index="name"
          />
        ) : null}
      </Card>
    </div>
  );
}
