import PostFeed from "@/components/Feed/PostFeed";
import MainFeed from "@/components/Feed/MainFeed";
import SideFeed from "@/components/Feed/SideFeed";

export default function FeedPage() {
  return (
    <section className="page-shell space-y-6">
      <h1 className="page-title">Community reviews</h1>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <PostFeed />
          <MainFeed />
        </div>
        <SideFeed />
      </div>
    </section>
  );
}
