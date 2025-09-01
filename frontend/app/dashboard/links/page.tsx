"use client"

import {useState } from "react"
import {
  ChevronRight,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {fetchAllLinks} from '../../../api/linkData'
import { useRouter } from "next/navigation"
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import {UrlItem, UrlResponse} from '@/types/link'
import { useQuery } from "@tanstack/react-query"
import Error from '@/components/ui/Error'


import Pagination from "@/components/ui/pagination"
import LoadingScreen from "@/components/ui/Loader"

dayjs.extend(relativeTime);

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
]


export default function LinksContent() {
  const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    isError
  } = useQuery<UrlResponse>({
    queryKey: ["fetch_all_link", currentPage],
    queryFn: () => fetchAllLinks(currentPage),
  });

  if (isLoading) return <LoadingScreen/>
  if(isError) return <Error/>

  const urls:UrlItem[] = data?.data.urls ?? [];
  const pagination = data?.data.pagination;


  return (
    <>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Links</h1>
          <p className="text-muted-foreground">Manage and track all your shortened links</p>
        </div>
        {
          urls.length > 0 &&         <Button className="gap-2" onClick={()=>{router.push("/dashboard/links/create")}}>
          <Plus className="h-4 w-4"  />
          New Link
        </Button>
        }
      </div>

    <div className="min-h-[68vh]">
           { urls.length > 0 ?<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {
           urls?.map((item:UrlItem,i:number)=>{
          return <Card key={i} className="overflow-hidden hover:shadow-md hover:scale-105 transition-all cursor-pointer" onClick={()=>{
            router.push(`/dashboard/links/${item.id}`)
          }}>
  <CardHeader className="pb-2">
    <div className="flex items-start justify-between">
      <div>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="mt-1">{dayjs(item.createdAt).fromNow()}</CardDescription>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center">
            <ChevronRight className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Copy URL</DropdownMenuItem>
            <DropdownMenuItem>Analytics</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Button>
    </div>
  </CardHeader>

  <CardContent>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium gradient-text">shrl.me/{item.shortUrl}</span>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e)=>{
        e.stopPropagation()
        navigator.clipboard.writeText(process.env.NEXT_PUBLIC_API_URL+"/"+item.shortUrl)
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      </Button>
    </div>
    <p className="mt-1 truncate text-xs text-muted-foreground">{item.actualUrl}</p>
  </CardContent>

  <CardFooter className="border-t bg-muted/50 px-6 py-3">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-end gap-2">
        <span className="text-sm font-medium">{item.clicks} clicks</span>
      </div>
      {/* Beeping Green Light */}
      <div className="relative flex items-center gap-2">
        {
          item.expiryDate && dayjs(item.expiryDate).isAfter(dayjs()) ?
          <>
             <span className="text-xs text-green-600 font-medium">Live</span>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
        </span>
          </>:
          <>
             <span className="text-xs text-red-600 font-medium">Expire</span>
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </span>
          </>
        }
      </div>
    </div>
  </CardFooter>
</Card>       
          })
        }
      </div>:
          <div className="flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground h-[80vh] w-full">
      <div className="w-24 h-24 flex items-center justify-center rounded-full bg-muted/50">
        <Plus className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold">No Links Yet</h2>
      <p className="max-w-sm">
        You don&apos;t have any shortened links right now. Start creating one to easily manage and track your URLs.
      </p>
      <Button className="mt-2" onClick={() => router.push("/dashboard/links/create")}>
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Link
      </Button>
    </div>
      }
    </div>

      {
        urls?.length > 0 &&       <div className="flex justify-center items-center p-3 gap-5">
        <span>
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
          )}
        </span>
      </div>
      }
    </div>
    </>
  )
}
