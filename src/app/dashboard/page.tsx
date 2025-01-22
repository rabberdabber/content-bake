import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Tags, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data
const userData = {
  email: "john.doe@example.com",
  fullName: "John Doe",
  avatar: "/avatar.png",
};

const postStats = {
  totalPosts: 100,
  yourPosts: 32,
  drafts: 8,
  tags: [
    { name: "Technology", count: 15 },
    { name: "Programming", count: 10 },
    { name: "Web Development", count: 5 },
    { name: "React", count: 2 },
  ],
};

export default function App() {
  const yourPostsPercentage =
    (postStats.yourPosts / postStats.totalPosts) * 100;

  return (
    <div className="flex flex-col bg-background p-8">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{userData.fullName}</p>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postStats.totalPosts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Posts</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postStats.yourPosts}</div>
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
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postStats.drafts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Popular Tags
              </CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {postStats.tags.map((tag) => (
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
                    {postStats.yourPosts} posts
                  </div>
                </div>
                <Progress value={yourPostsPercentage} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Drafts</div>
                  <div className="text-sm text-muted-foreground">
                    {postStats.drafts} drafts
                  </div>
                </div>
                <Progress
                  value={
                    (postStats.drafts /
                      (postStats.yourPosts + postStats.drafts)) *
                    100
                  }
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
              {postStats.tags.map((tag) => (
                <div key={tag.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{tag.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {tag.count} posts
                    </div>
                  </div>
                  <Progress
                    value={(tag.count / postStats.yourPosts) * 100}
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
