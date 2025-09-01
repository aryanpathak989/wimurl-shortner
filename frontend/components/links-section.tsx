"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Edit, ExternalLink, MoreHorizontal, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LinkItem {
  id: string
  title: string
  shortUrl: string
  originalUrl: string
  clicks: number
  createdAt: string
}

export function LinksSection() {
  const [links, setLinks] = useState<LinkItem[]>([
    {
      id: "1",
      title: "Company Website",
      shortUrl: "linkpro.com/co",
      originalUrl: "https://example.com/company",
      clicks: 245,
      createdAt: "2023-05-12",
    },
    {
      id: "2",
      title: "Product Launch",
      shortUrl: "linkpro.com/pl",
      originalUrl: "https://example.com/product-launch",
      clicks: 189,
      createdAt: "2023-06-03",
    },
    {
      id: "3",
      title: "Summer Campaign",
      shortUrl: "linkpro.com/sc",
      originalUrl: "https://example.com/summer-campaign",
      clicks: 432,
      createdAt: "2023-06-15",
    },
    {
      id: "4",
      title: "Blog Post",
      shortUrl: "linkpro.com/bp",
      originalUrl: "https://example.com/blog/latest-post",
      clicks: 87,
      createdAt: "2023-07-01",
    },
    {
      id: "5",
      title: "Newsletter Signup",
      shortUrl: "linkpro.com/nl",
      originalUrl: "https://example.com/newsletter",
      clicks: 156,
      createdAt: "2023-07-10",
    },
  ])

  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (link: LinkItem) => {
    setEditingLink(link)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingLink) {
      setLinks(links.map((link) => (link.id === editingLink.id ? editingLink : link)))
    }
    setIsDialogOpen(false)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
          <h1 className="text-3xl font-bold tracking-tight">Links</h1>
          <p className="text-muted-foreground">Manage and track all your shortened links</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Link
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder="Search links..." className="max-w-sm" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Sort By</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Most Clicks</DropdownMenuItem>
            <DropdownMenuItem>Newest</DropdownMenuItem>
            <DropdownMenuItem>Oldest</DropdownMenuItem>
            <DropdownMenuItem>Alphabetical</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {links.map((link) => (
          <motion.div
            key={link.id}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <CardDescription className="mt-1">Created on {link.createdAt}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(link)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-primary">{link.shortUrl}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy URL</span>
                  </Button>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{link.originalUrl}</p>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{link.clicks.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">clicks</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 h-8" onClick={() => handleEdit(link)}>
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>Make changes to your link. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          {editingLink && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortUrl">Short URL</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">linkpro.com/</span>
                  <Input
                    id="shortUrl"
                    value={editingLink.shortUrl.replace("linkpro.com/", "")}
                    onChange={(e) => setEditingLink({ ...editingLink, shortUrl: `linkpro.com/${e.target.value}` })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalUrl">Original URL</Label>
                <Input
                  id="originalUrl"
                  value={editingLink.originalUrl}
                  onChange={(e) => setEditingLink({ ...editingLink, originalUrl: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
