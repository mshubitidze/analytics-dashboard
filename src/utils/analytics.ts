import { redis } from "@/lib/redis";
import { getDate } from "@/utils";
import { parse } from "date-fns";

type AnalyticsArgs = { retention?: number };

type TrackOptions = {
  persist?: boolean;
};

export class Analytics {
  private retention: number = 60 * 60 * 24 * 7;

  constructor(opts?: AnalyticsArgs) {
    if (opts?.retention) {
      this.retention = opts.retention;
    }
  }

  async track(namespace: string, event: object = {}, opts?: TrackOptions) {
    let key = `analytics::${namespace}`;

    if (!opts?.persist) {
      key += `::${getDate()}`;
    }

    await redis.hincrby(key, JSON.stringify(event), 1);

    if (!opts?.persist) {
      await redis.expire(key, this.retention);
    }
  }

  async retrieveDays(namespace: string, nDays: number) {
    type AnalyticsPromise = ReturnType<typeof analytics.retrieve>;
    const promises: AnalyticsPromise[] = [];

    for (let i = 0; i < nDays; i++) {
      const formattedDate = getDate(i);
      const promise = analytics.retrieve(namespace, formattedDate);
      promises.push(promise);
    }

    const fetched = await Promise.all(promises);

    const data = fetched.sort((a, b) => {
      const parsedA = parse(a.date, "dd/MM/yyyy", new Date());
      const parsedB = parse(b.date, "dd/MM/yyyy", new Date());
      if (parsedA > parsedB) {
        return 1;
      }
      return -1;
    });

    return data;
  }

  async retrieve(namespace: string, date: string) {
    const key = `analytics::${namespace}::${date}`;
    const res = await redis.hgetall<Record<string, string>>(key);
    return {
      date,
      events: Object.entries(res ?? []).map(([k, v]) => ({
        [k]: Number(v),
      })),
    };
  }

  async retrievePageViewsByPath(namespace: string, date: string, path: string) {
    const key = `analytics::${namespace}::${date}`;

    const res = await redis.hget<number>(key, `{"namespace":"${path}"}`);
    return res ?? 0;
  }
}

export const analytics = new Analytics();
