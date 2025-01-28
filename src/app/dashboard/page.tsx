import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { DashboardStats } from "@/schemas/dashboard";
import { cookies } from "next/headers";

export async function getDashboardStats() {
  const env = process.env.NEXT_ENV;
  const cookieName =
    env === "local"
      ? "next-auth.session-token"
      : "__Secure-next-auth.session-token";
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard`, {
    headers: {
      "Content-Type": "application/json",
      ...(cookies().get(cookieName) && {
        Authorization: `Bearer ${cookies().get(cookieName)?.value}`,
      }),
      cache: "no-store",
    },
  });
  return response.json() as Promise<DashboardStats>;
}

export default async function App() {
  const {
    user,
    total_posts,
    user_posts,
    user_drafts,
    popular_tags,
    tag_distribution,
  } = await getDashboardStats();
  const yourPostsPercentage = total_posts
    ? (user_posts / total_posts) * 100
    : 0;

  return (
    <div className="mx-auto container flex flex-col bg-background p-8">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">
                {user?.full_name || "Anonymous User"}
              </p>
              <p className="text-sm text-muted-foreground">
                {user?.email || "Anonymous Email"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <Icons.fileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total_posts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Posts</CardTitle>
              <Icons.user className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user_posts}</div>
              <div className="mt-4 space-y-2">
                <Progress value={yourPostsPercentage} className="h-1" />
                <p className="text-xs text-muted-foreground">
                  {yourPostsPercentage.toFixed(1)}% of total posts
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Icons.fileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user_drafts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Popular Tags
              </CardTitle>
              <Icons.tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popular_tags?.map((tag) => (
                  <Badge key={tag.name} variant="secondary">
                    {tag.name} ({tag.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Post Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Published Posts</div>
                  <div className="text-sm text-muted-foreground">
                    {user_posts} posts
                  </div>
                </div>
                <Progress value={yourPostsPercentage} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Drafts</div>
                  <div className="text-sm text-muted-foreground">
                    {user_drafts} drafts
                  </div>
                </div>
                <Progress
                  value={(user_drafts / (user_posts + user_drafts)) * 100}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Contribution Rate</div>
                  <div className="text-sm text-muted-foreground">
                    {yourPostsPercentage.toFixed(1)}% of total
                  </div>
                </div>
                <Progress value={yourPostsPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Tag Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {tag_distribution?.map((tag) => (
                <div key={tag.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{tag.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {tag.count} posts
                    </div>
                  </div>
                  <Progress
                    value={(tag.count / user_posts) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
