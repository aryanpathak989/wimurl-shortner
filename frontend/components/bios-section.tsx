"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Edit, ExternalLink, GripVertical, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BioLink {
  id: string
  title: string
  url: string
  clicks: number
}

interface BioProfile {
  id: string
  name: string
  username: string
  links: BioLink[]
}

export function BiosSection() {
  const [profiles, setProfiles] = useState<BioProfile[]>([
    {
      id: "1",
      name: "Personal Profile",
      username: "johndoe",
      links: [
        {
          id: "1-1",
          title: "Portfolio Website",
          url: "https://johndoe.com",
          clicks: 342,
        },
        {
          id: "1-2",
          title: "GitHub Profile",
          url: "https://github.com/johndoe",
          clicks: 128,
        },
        {
          id: "1-3",
          title: "LinkedIn",
          url: "https://linkedin.com/in/johndoe",
          clicks: 215,
        },
      ],
    },
    {
      id: "2",
      name: "Business Profile",
      username: "acmecorp",
      links: [
        {
          id: "2-1",
          title: "Company Website",
          url: "https://acmecorp.com",
          clicks: 567,
        },
        {
          id: "2-2",
          title: "Product Demo",
          url: "https://acmecorp.com/demo",
          clicks: 324,
        },
      ],
    },
  ])

  const [editingProfile, setEditingProfile] = useState<BioProfile | null>(null)
  const [editingLink, setEditingLink] = useState<BioLink | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

  const handleEditProfile = (profile: BioProfile) => {
    setEditingProfile({ ...profile })
    setIsProfileDialogOpen(true)
  }

  const handleEditLink = (profile: BioProfile, link: BioLink) => {
    setEditingProfile({ ...profile })
    setEditingLink({ ...link })
    setIsLinkDialogOpen(true)
  }

  const handleAddLink = (profile: BioProfile) => {
    setEditingProfile({ ...profile })
    setEditingLink({
      id: `new-${Date.now()}`,
      title: "",
      url: "",
      clicks: 0,
    })
    setIsLinkDialogOpen(true)
  }

  const handleSaveLink = () => {
    if (!editingProfile || !editingLink) return

    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === editingProfile.id) {
        const existingLinkIndex = profile.links.findIndex((link) => link.id === editingLink.id)

        if (existingLinkIndex >= 0) {
          // Update existing link
          const updatedLinks = [...profile.links]
          updatedLinks[existingLinkIndex] = editingLink
          return { ...profile, links: updatedLinks }
        } else {
          // Add new link
          return { ...profile, links: [...profile.links, editingLink] }
        }
      }
      return profile
    })

    setProfiles(updatedProfiles)
    setIsLinkDialogOpen(false)
  }

  const handleDeleteLink = (profileId: string, linkId: string) => {
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === profileId) {
        return {
          ...profile,
          links: profile.links.filter((link) => link.id !== linkId),
        }
      }
      return profile
    })

    setProfiles(updatedProfiles)
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
          <h1 className="text-3xl font-bold tracking-tight">Bio Links</h1>
          <p className="text-muted-foreground">Manage your link-in-bio profiles</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Profile
        </Button>
      </div>

      <motion.div className="grid gap-6" variants={container} initial="hidden" animate="show">
        {profiles.map((profile) => (
          <motion.div key={profile.id} variants={item}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{profile.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <span className="font-medium">@{profile.username}</span> · {profile.links.length} links
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEditProfile(profile)}>
                    <Edit className="h-3.5 w-3.5" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.links.map((link, index) => (
                    <div
                      key={link.id}
                      className="flex items-center gap-3 rounded-md border p-3 bg-card transition-all hover:border-primary/50"
                    >
                      <div className="flex items-center justify-center h-8 w-8">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{link.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{link.clicks}</span>
                        <span className="text-xs">clicks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditLink(profile, link)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Open</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteLink(profile.id, link.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {profile.links.length < 3 && (
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-dashed"
                      onClick={() => handleAddLink(profile)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Link
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 px-6 py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm text-muted-foreground">
                    {profile.links.reduce((total, link) => total + link.clicks, 0)} total clicks
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    View Public Page
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink?.id.startsWith("new") ? "Add Link" : "Edit Link"}</DialogTitle>
            <DialogDescription>
              {editingLink?.id.startsWith("new")
                ? "Add a new link to your bio profile."
                : "Make changes to your link details."}
            </DialogDescription>
          </DialogHeader>
          {editingLink && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Link Title</Label>
                <Input
                  id="title"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                  placeholder="e.g. My Website"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLink}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
