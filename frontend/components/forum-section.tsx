"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUp, MessageSquare, MoreHorizontal, Plus, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  upvotes: number
  replies: number
  tags: string[]
  isUpvoted?: boolean
}

export function ForumSection() {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "1",
      title: "How to optimize link click-through rates?",
      content:
        "I've been using the platform for a few weeks now and I'm wondering what strategies others are using to optimize their click-through rates. Any tips or best practices would be greatly appreciated!",
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "2 hours ago",
      upvotes: 12,
      replies: 5,
      tags: ["tips", "optimization"],
    },
    {
      id: "2",
      title: "New feature request: Custom QR codes",
      content:
        "It would be great if we could generate custom QR codes for our shortened links. This would be really useful for print materials and physical marketing.",
      author: {
        name: "Sam Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "1 day ago",
      upvotes: 24,
      replies: 8,
      tags: ["feature request", "qr codes"],
    },
    {
      id: "3",
      title: "Sharing my analytics dashboard setup",
      content:
        "I've set up a custom analytics dashboard using the API and I thought I'd share my setup with the community. It's been really helpful for tracking performance across multiple campaigns.",
      author: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "3 days ago",
      upvotes: 36,
      replies: 14,
      tags: ["analytics", "dashboard", "tutorial"],
    },
    {
      id: "4",
      title: "Best practices for bio link organization",
      content:
        "I'm trying to organize my bio links in a way that maximizes engagement. Has anyone found a particular order or grouping that works well?",
      author: {
        name: "Taylor Reed",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "5 days ago",
      upvotes: 18,
      replies: 7,
      tags: ["bio links", "organization"],
    },
  ])

  const handleUpvote = (id: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes + 1,
            isUpvoted: !post.isUpvoted,
          }
        }
        return post
      }),
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forum</h1>
          <p className="text-muted-foreground">Join discussions and share your insights with the community</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input placeholder="Search discussions..." className="sm:max-w-xs" />
        <Tabs defaultValue="popular" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
        {posts.map((post) => (
          <motion.div key={post.id} variants={item}>
            <Card className="overflow-hidden transition-all hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Save</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Hide</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 px-6 py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{post.author.name}</span>
                    <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-1 h-8 ${post.isUpvoted ? "text-primary" : ""}`}
                      onClick={() => handleUpvote(post.id)}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {post.upvotes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 h-8">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {post.replies}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center">
        <Button variant="outline" className="gap-2">
          <ArrowUp className="h-4 w-4" />
          Load More
        </Button>
      </div>
    </div>
  )
}
