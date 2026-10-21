import { NextResponse } from "next/server";
import { ApiError, run } from "@/lib/api";
import { requireRole, STAFF } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";
import { lastNDays } from "@/lib/dates";
import { toArticle } from "@/lib/db/articles";
import { toAdvert } from "@/services/adverts";

export const dynamic = "force-dynamic";

/** Everything the dashboard needs, in one request. */
export async function GET(req: Request) {
  return run(async () => {
    const session = await requireRole(req, STAFF);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    const isAuthor = session.role === "author";

    const since30 = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const [artSnap, statSnap, subTotal, subNew, unread, adSnap] = await Promise.all([
      db.collection("articles").limit(2000).get(),
      db.collection("dailyStats").orderBy("date", "desc").limit(90).get(),
      isAuthor ? null : db.collection("newsletterSubscribers").count().get(),
      isAuthor
        ? null
        : db
            .collection("newsletterSubscribers")
            .where("subscribedAt", ">=", since30)
            .count()
            .get(),
      isAuthor
        ? null
        : db.collection("contactMessages").where("read", "==", false).count().get(),
      isAuthor ? null : db.collection("adverts").limit(200).get(),
    ]);

    let articles = artSnap.docs.map((d) => toArticle(d.id, d.data()));
    if (isAuthor) articles = articles.filter((a) => a.authorId === session.uid);
    const byId = new Map(articles.map((a) => [a.id, a]));
    const now = Date.now();

    const live = (a: { status: string; publishedAt: string | null }) =>
      a.status === "published" &&
      !!a.publishedAt &&
      new Date(a.publishedAt).getTime() <= now;

    const counts = {
      total: articles.length,
      published: articles.filter(live).length,
      scheduled: articles.filter(
        (a) => a.status === "published" && !live(a)
      ).length,
      drafts: articles.filter((a) => a.status !== "published").length,
    };

    // Daily views for the last 90 days (missing days count as 0).
    const days = lastNDays(90);
    const perDay = new Map<string, number>();
    const perArticle30 = new Map<string, number>();
    const last30 = new Set(days.slice(-30));
    statSnap.docs.forEach((d) => {
      const x = d.data();
      const date = String(x.date || d.id);
      perDay.set(date, Number(x.views) || 0);
      if (last30.has(date) && x.articles && typeof x.articles === "object") {
        for (const [id, n] of Object.entries(x.articles as Record<string, number>)) {
          perArticle30.set(id, (perArticle30.get(id) || 0) + (Number(n) || 0));
        }
      }
    });
    const daily = days.map((date) => ({ date, views: perDay.get(date) || 0 }));

    const slim = (a: (typeof articles)[number]) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      status: a.status,
      views: a.views,
      author: a.author,
      publishedAt: a.publishedAt,
      updatedAt: a.updatedAt,
      image: a.featuredImage.url,
    });

    const topAllTime = [...articles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 8)
      .map(slim);

    const top30 = Array.from(perArticle30.entries())
      .filter(([id]) => byId.has(id))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, views]) => ({ ...slim(byId.get(id)!), periodViews: views }));

    const catMap = new Map<string, number>();
    articles.forEach((a) =>
      catMap.set(a.category, (catMap.get(a.category) || 0) + a.views)
    );
    const byCategory = Array.from(catMap.entries())
      .map(([category, views]) => ({ category, views }))
      .filter((c) => c.views > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    const recent = [...articles]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      )
      .slice(0, 6)
      .map(slim);

    const adverts = adSnap
      ? adSnap.docs.map((d) => {
          const a = toAdvert(d.id, d.data());
          return {
            id: a.id,
            name: a.name,
            placement: a.placement,
            active: a.active,
            impressions: a.impressions,
            clicks: a.clicks,
            ctr: a.impressions > 0 ? (a.clicks / a.impressions) * 100 : 0,
          };
        })
      : null;

    return NextResponse.json({
      role: session.role,
      counts,
      totalViews: articles.reduce((s, a) => s + a.views, 0),
      daily,
      topAllTime,
      top30,
      byCategory,
      recent,
      adverts,
      audience: isAuthor
        ? null
        : {
            subscribers: subTotal ? subTotal.data().count : 0,
            newSubscribers30: subNew ? subNew.data().count : 0,
            unreadMessages: unread ? unread.data().count : 0,
          },
    });
  });
}
