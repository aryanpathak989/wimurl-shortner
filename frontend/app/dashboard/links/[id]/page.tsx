"use client"

import { useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, Edit, ExternalLink, Calendar, TrendingUp, Share, QrCode, Zap, TrendingDown, ExternalLinkIcon, XCircle, Cross, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// Update the import path below to the correct location of Badge in your project, for example:
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LinkAnalyticsChart } from "@/components/dashboard/link-analytics-chart"
import { DeviceBreakdownChart } from "@/components/dashboard/device-breakdown-chart"
import { ReferrerBreakdown } from "@/components/dashboard/referrer-breakdown"
import { GeographicalDistribution } from "@/components/dashboard/geographical-distribution"
import { getLinkClickPerformance, getLinkDeviceBreakDown, getLinkReferencePerformance, getLinkClicksByCountry, fetchUrlData } from '@/api/linkData' // adjust import path
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Loader from "@/components/ui/Loader"
import dayjs from "dayjs"
import { periodOptions } from "@/lib/periodOptions"
import Error from '@/components/ui/Error'
import Image from "next/image"
import {fetchUserUsage} from '@/api/user'
import EditLinkModal from "@/components/dashboard/EditUrlDetails";
import { updateUrlData } from "@/api/linkData";


export default function LinkDetailsPage() {
  const router = useRouter()
  const params = useParams();
  const urlId = params.id;

    const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("14days")
  const [activeTab, setActiveTab] = useState("analytics")
  const [showShareTab, setShowShareTab] = useState(false)
  const [showQrCode,setShowQrCode] = useState(false)

    const updateMutation = useMutation({
    mutationFn: (payload: { name: string; actualUrl: string; expiryDate: string | null }) =>
      updateUrlData({ urlId, payload }),
    onSuccess: async () => {
      // refetch the link details so UI updates
      await qc.invalidateQueries({ queryKey: ["urlData", urlId] });
      setEditOpen(false);
      setSaveError(null);

    },
    onError: (err: any) => {
      setSaveError(typeof err?.message === "string" ? err.message : "Failed to save changes");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['urlData', urlId],
    queryFn: () => fetchUrlData({ urlId }),
    enabled: !!urlId,
  });


    const {data:userUsage,isError:errorUsage,isPending:pendingUsage} = useQuery({
      queryKey:['userUsageData'],
      queryFn:()=>{
        return fetchUserUsage()
      }
    })




  // Fetch click performance data
  const {
    data: clickPerformanceData,
    isLoading: loadingClicks,
    error: errorClicks,
  } = useQuery({
    queryKey: ['clickPerformance', urlId, selectedPeriod],
    queryFn: () => getLinkClickPerformance({ urlId, period: selectedPeriod }),
    enabled: !!urlId && activeTab === "analytics"
  })

  // Fetch device breakdown data
  const {
    data: deviceData,
    isLoading: loadingDevices,
    error: errorDevices,
  } = useQuery({
    queryKey: ['deviceBreakdown', urlId, selectedPeriod],
    queryFn: () => getLinkDeviceBreakDown({ urlId, period: selectedPeriod }),
    enabled: !!urlId && activeTab === "devices"
  })

  // Fetch referrer performance data
  const {
    data: referrerData,
    isLoading: loadingReferrers,
    error: errorReferrers,
  } = useQuery({
    queryKey: ['referrerPerformance', urlId, selectedPeriod],
    queryFn: () => getLinkReferencePerformance({ urlId, period: selectedPeriod }),
    enabled: !!urlId && activeTab === "referrers"
  })

  // Fetch geography data
  const {
    data: geographicalData,
    isLoading: loadingGeography,
    error: errorGeography,
  } = useQuery({
    queryKey: ['clicksByCountry', urlId, selectedPeriod],
    queryFn: () => getLinkClicksByCountry({ urlId, period: selectedPeriod }),
    enabled: !!urlId && activeTab === "geography"
  })


  if (isLoading) return <Loader />
  if(pendingUsage) return <Loader/>

  if (error) return <Error />


  console.log(data)


  const handleCopyLink = (data: string) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL}/${data}`)
    // Would show a toast notification here
  }


const handleWhatsAppClick = (link: string) => {
  const encodedLink = encodeURIComponent(link);
  window.open(`https://web.whatsapp.com/send?text=${encodedLink}`);
};

const handleFacebookClick = (link: string) => {
  const encodedLink = encodeURIComponent(link);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`);
};

const handleTwitterClick = (link: string) => {
  const encodedLink = encodeURIComponent(link);
  window.open(`https://twitter.com/intent/tweet?url=${encodedLink}`);
};

const handleLinkedInClick = (link: string) => {
  const encodedLink = encodeURIComponent(link);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`);
};

const handleRedditClick = (link: string) => {
  const encodedLink = encodeURIComponent(link);
  window.open(`https://www.reddit.com/submit?url=${encodedLink}`);
};


  return (
    <div className="space-y-8">
      {
        showShareTab &&
<div className="absolute z-20 inset-0 flex justify-center items-center bg-black/50">
  <div className="w-full smd:w-[40vw] md:max-w-[700px] bg-muted p-4 px-7 rounded-lg space-y-3">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Share</h1>
      <span
        className=" cursor-pointer p-2 rounded-full bg-card"
        onClick={() => {
          setShowShareTab(false);
        }}
      >
        <X className="w-5 h-5" />
      </span>
    </div>
    <div className="border-b-2 border-t-2 border-[rgba(255, 255, 255, 0.2)] py-3">
      <div>
        <div className="flex gap-6 md:gap-10 justify-center py-6 flex-wrap">
          {/* Whatsapp */}
          <span
            className="h-20 w-20rounded-full flex flex-col gap-2 cursor-pointer items-center"
            onClick={() => {
              handleWhatsAppClick("shrl.me/" + data?.shortUrl);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 object-contain"
              viewBox="0 0 48 48"
            >
              <path
                fill="#fff"
                d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
              ></path>
              <path
                fill="#fff"
                d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
              ></path>
              <path
                fill="#cfd8dc"
                d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
              ></path>
              <path
                fill="#40c351"
                d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="text-sm">Whatsapp</p>
          </span>

          {/* Facebook */}
          <span
            className="h-20 w-20 rounded-full flex flex-col gap-2 cursor-pointer items-center"
            onClick={() => {
              handleFacebookClick("shrl.me/" + data?.shortUrl);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 object-contain"
              viewBox="0 0 48 48"
            >
              <path
                fill="#039be5"
                d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
              ></path>
              <path
                fill="#fff"
                d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
              ></path>
            </svg>
            <p className="text-sm">Facebook</p>
          </span>

          {/* X - Twitter */}
          <span
            className="h-20 w-20 rounded-full flex flex-col gap-2 cursor-pointer items-center"
            onClick={() => {
              handleTwitterClick("shrl.me/" + data?.shortUrl);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 object-contain"
              viewBox="0 0 50 50"
            >
              <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z"></path>
            </svg>
            <p className="text-sm">X</p>
          </span>

          {/* LinkedIn */}
          <span
            className="h-20 w-20 rounded-full flex flex-col gap-2 cursor-pointer items-center"
            onClick={() => {
              handleLinkedInClick("shrl.me/" + data?.shortUrl);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 object-contain"
              viewBox="0 0 48 48"
            >
              <path
                fill="#0078d4"
                d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z"
              ></path>
              <path
                d="M30,37V26.901c0-1.689-0.819-2.698-2.192-2.698c-0.815,0-1.414,0.459-1.779,1.364	c-0.017,0.064-0.041,0.325-0.031,1.114L26,37h-7V18h7v1.061C27.022,18.356,28.275,18,29.738,18c4.547,0,7.261,3.093,7.261,8.274	L37,37H30z M11,37V18h3.457C12.454,18,11,16.528,11,14.499C11,12.472,12.478,11,14.514,11c2.012,0,3.445,1.431,3.486,3.479	C18,16.523,16.521,18,14.485,18H18v19H11z"
                opacity=".05"
              ></path>
              <path
                fill="#fff"
                d="M12,19h5v17h-5V19z M14.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12	c1.521,0,2.458,1.08,2.486,2.499 C17,15.887,16.035,17,14.485,17z M36,36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698	c-1.501,0-2.313,1.012-2.707,1.99C24.957,25.543,25,26.511,25,27v9h-5V19h5v2.616C25.721,20.5,26.85,19,29.738,19	c3.578,0,6.261,2.25,6.261,7.274L36,36L36,36z"
              ></path>
            </svg>
            <p className="text-sm">LinkedIn</p>
          </span>

          {/* Reddit */}
          <span
            className="h-20 w-20 rounded-full flex flex-col gap-2 cursor-pointer items-center"
            onClick={() => {
              handleRedditClick("shrl.me/" + data?.shortUrl);
            }}
          >
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="200" height="200" viewBox="0 0 100 100" className="h-14 w-14 object-contain">
<path fill="#c7ede6" d="M87.215,56.71C88.35,54.555,89,52.105,89,49.5c0-6.621-4.159-12.257-10.001-14.478 C78.999,35.015,79,35.008,79,35c0-11.598-9.402-21-21-21c-9.784,0-17.981,6.701-20.313,15.757C36.211,29.272,34.638,29,33,29 c-7.692,0-14.023,5.793-14.89,13.252C12.906,43.353,9,47.969,9,53.5C9,59.851,14.149,65,20.5,65c0.177,0,0.352-0.012,0.526-0.022 C21.022,65.153,21,65.324,21,65.5C21,76.822,30.178,86,41.5,86c6.437,0,12.175-2.972,15.934-7.614C59.612,80.611,62.64,82,66,82 c4.65,0,8.674-2.65,10.666-6.518C77.718,75.817,78.837,76,80,76c6.075,0,11-4.925,11-11C91,61.689,89.53,58.727,87.215,56.71z"></path><path fill="#fff" d="M33.5,79h-10c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h10c0.276,0,0.5,0.224,0.5,0.5 S33.777,79,33.5,79z"></path><path fill="#fff" d="M36.5,79h-1c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h1c0.276,0,0.5,0.224,0.5,0.5 S36.777,79,36.5,79z"></path><path fill="#fff" d="M41.491,81H32.5c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h8.991c0.276,0,0.5,0.224,0.5,0.5 S41.767,81,41.491,81z"></path><path fill="#fff" d="M30.5,81h-1c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h1c0.276,0,0.5,0.224,0.5,0.5 S30.777,81,30.5,81z"></path><path fill="#fff" d="M27.5,81h-2c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h2c0.276,0,0.5,0.224,0.5,0.5 S27.777,81,27.5,81z"></path><path fill="#fff" d="M33.5,83h-2c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h2c0.276,0,0.5,0.224,0.5,0.5 S33.776,83,33.5,83z"></path><path fill="#fff" d="M36.5,74c-0.177,0-0.823,0-1,0c-0.276,0-0.5,0.224-0.5,0.5c0,0.276,0.224,0.5,0.5,0.5 c0.177,0,0.823,0,1,0c0.276,0,0.5-0.224,0.5-0.5C37,74.224,36.776,74,36.5,74z"></path><path fill="#fff" d="M36.5,76c-0.177,0-4.823,0-5,0c-0.276,0-0.5,0.224-0.5,0.5c0,0.276,0.224,0.5,0.5,0.5 c0.177,0,4.823,0,5,0c0.276,0,0.5-0.224,0.5-0.5C37,76.224,36.776,76,36.5,76z"></path><path fill="#fff" d="M41.5,78c-0.177,0-2.823,0-3,0c-0.276,0-0.5,0.224-0.5,0.5c0,0.276,0.224,0.5,0.5,0.5 c0.177,0,2.823,0,3,0c0.276,0,0.5-0.224,0.5-0.5C42,78.224,41.776,78,41.5,78z"></path><g><path fill="#fff" d="M70.5,18h-10c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h10c0.276,0,0.5,0.224,0.5,0.5 S70.776,18,70.5,18z"></path><path fill="#fff" d="M74.5,18h-2c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h2c0.276,0,0.5,0.224,0.5,0.5 S74.776,18,74.5,18z"></path><path fill="#fff" d="M79.5,20h-10c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h10c0.276,0,0.5,0.224,0.5,0.5 S79.777,20,79.5,20z"></path><path fill="#fff" d="M67.5,20h-1c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h1c0.276,0,0.5,0.224,0.5,0.5 S67.776,20,67.5,20z"></path><path fill="#fff" d="M64.47,20H62.5c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h1.97c0.276,0,0.5,0.224,0.5,0.5 S64.746,20,64.47,20z"></path><path fill="#fff" d="M73.5,16h-5c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h5c0.276,0,0.5,0.224,0.5,0.5 S73.777,16,73.5,16z"></path><path fill="#fff" d="M70.5,22h-2c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h2c0.276,0,0.5,0.224,0.5,0.5 S70.776,22,70.5,22z"></path></g><g><path fill="#fdfcef" d="M86.5,77.5c0,0,1.567,0,3.5,0s3.5-1.567,3.5-3.5c0-1.781-1.335-3.234-3.055-3.455 C90.473,70.366,90.5,70.187,90.5,70c0-1.933-1.567-3.5-3.5-3.5c-1.032,0-1.95,0.455-2.59,1.165 c-0.384-1.808-1.987-3.165-3.91-3.165c-2.209,0-4,1.791-4,4c0,0.191,0.03,0.374,0.056,0.558C76.128,68.714,75.592,68.5,75,68.5 c-1.228,0-2.245,0.887-2.455,2.055C72.366,70.527,72.187,70.5,72,70.5c-1.933,0-3.5,1.567-3.5,3.5s1.567,3.5,3.5,3.5s7.5,0,7.5,0 V78h7V77.5z"></path><path fill="#472b29" d="M88.25,73C88.112,73,88,72.888,88,72.75c0-1.223,0.995-2.218,2.218-2.218 c0.034,0.009,0.737-0.001,1.244,0.136c0.133,0.036,0.212,0.173,0.176,0.306c-0.036,0.134-0.173,0.213-0.306,0.176 c-0.444-0.12-1.1-0.12-1.113-0.118c-0.948,0-1.719,0.771-1.719,1.718C88.5,72.888,88.388,73,88.25,73z"></path><circle cx="81.5" cy="77.5" r=".5" fill="#472b29"></circle><path fill="#472b29" d="M90,78h-3.5c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5H90c1.654,0,3-1.346,3-3 c0-1.496-1.125-2.768-2.618-2.959c-0.134-0.018-0.255-0.088-0.336-0.196s-0.115-0.244-0.094-0.377C89.975,70.314,90,70.16,90,70 c0-1.654-1.346-3-3-3c-0.85,0-1.638,0.355-2.219,1c-0.125,0.139-0.321,0.198-0.5,0.148c-0.182-0.049-0.321-0.195-0.36-0.379 C83.58,66.165,82.141,65,80.5,65c-1.93,0-3.5,1.57-3.5,3.5c0,0.143,0.021,0.28,0.041,0.418c0.029,0.203-0.063,0.438-0.242,0.54 c-0.179,0.102-0.396,0.118-0.556-0.01C75.878,69.155,75.449,69,75,69c-0.966,0-1.792,0.691-1.963,1.644 c-0.048,0.267-0.296,0.446-0.569,0.405C72.314,71.025,72.16,71,72,71c-1.654,0-3,1.346-3,3s1.346,3,3,3h7.5 c0.276,0,0.5,0.224,0.5,0.5S79.776,78,79.5,78H72c-2.206,0-4-1.794-4-4s1.794-4,4-4c0.059,0,0.116,0.002,0.174,0.006 C72.588,68.82,73.711,68,75,68c0.349,0,0.689,0.061,1.011,0.18C76.176,65.847,78.126,64,80.5,64c1.831,0,3.466,1.127,4.153,2.774 C85.333,66.276,86.155,66,87,66c2.206,0,4,1.794,4,4c0,0.048-0.001,0.095-0.004,0.142C92.739,70.59,94,72.169,94,74 C94,76.206,92.206,78,90,78z"></path><path fill="#472b29" d="M84.5,77c-0.159,0-0.841,0-1,0c-0.276,0-0.5,0.224-0.5,0.5c0,0.276,0.224,0.5,0.5,0.5 c0.159,0,0.841,0,1,0c0.276,0,0.5-0.224,0.5-0.5C85,77.224,84.776,77,84.5,77z"></path></g><g><path fill="#fdfcef" d="M33.5,34.5V35h3v-0.5c0,0,4.242,0,5.5,0c2.485,0,4.5-2.015,4.5-4.5 c0-2.333-1.782-4.229-4.055-4.455C42.467,25.364,42.5,25.187,42.5,25c0-2.485-2.015-4.5-4.5-4.5c-1.438,0-2.703,0.686-3.527,1.736 C34.333,19.6,32.171,17.5,29.5,17.5c-2.761,0-5,2.239-5,5c0,0.446,0.077,0.87,0.187,1.282C24.045,23.005,23.086,22.5,22,22.5 c-1.781,0-3.234,1.335-3.455,3.055C18.364,25.533,18.187,25.5,18,25.5c-2.485,0-4.5,2.015-4.5,4.5s2.015,4.5,4.5,4.5s9.5,0,9.5,0 H33.5z"></path><path fill="#472b29" d="M29.5,17c-3.033,0-5.5,2.467-5.5,5.5c0,0.016,0,0.031,0,0.047C23.398,22.192,22.71,22,22,22 c-1.831,0-3.411,1.261-3.858,3.005C18.095,25.002,18.048,25,18,25c-2.757,0-5,2.243-5,5s2.243,5,5,5h15.5 c0.276,0,0.5-0.224,0.5-0.5S33.776,34,33.5,34H18c-2.206,0-4-1.794-4-4s1.794-4,4-4c0.117,0,0.23,0.017,0.343,0.032l0.141,0.019 c0.021,0.003,0.041,0.004,0.062,0.004c0.246,0,0.462-0.185,0.495-0.437C19.232,24.125,20.504,23,22,23 c0.885,0,1.723,0.401,2.301,1.1c0.098,0.118,0.241,0.182,0.386,0.182c0.078,0,0.156-0.018,0.228-0.056 c0.209-0.107,0.314-0.346,0.254-0.573C25.054,23.218,25,22.852,25,22.5c0-2.481,2.019-4.5,4.5-4.5 c2.381,0,4.347,1.872,4.474,4.263c0.011,0.208,0.15,0.387,0.349,0.45c0.05,0.016,0.101,0.024,0.152,0.024 c0.15,0,0.296-0.069,0.392-0.192C35.638,21.563,36.779,21,38,21c2.206,0,4,1.794,4,4c0,0.117-0.017,0.23-0.032,0.343l-0.019,0.141 c-0.016,0.134,0.022,0.268,0.106,0.373c0.084,0.105,0.207,0.172,0.34,0.185C44.451,26.247,46,27.949,46,30c0,2.206-1.794,4-4,4 h-5.5c-0.276,0-0.5,0.224-0.5,0.5s0.224,0.5,0.5,0.5H42c2.757,0,5-2.243,5-5c0-2.397-1.689-4.413-4.003-4.877 C42.999,25.082,43,25.041,43,25c0-2.757-2.243-5-5-5c-1.176,0-2.293,0.416-3.183,1.164C34.219,18.76,32.055,17,29.5,17L29.5,17z"></path><path fill="#472b29" d="M28,24c-1.403,0-2.609,0.999-2.913,2.341C24.72,26.119,24.301,26,23.875,26 c-1.202,0-2.198,0.897-2.353,2.068C21.319,28.022,21.126,28,20.937,28c-1.529,0-2.811,1.2-2.918,2.732 C18.01,30.87,18.114,30.99,18.251,31c0.006,0,0.012,0,0.018,0c0.13,0,0.24-0.101,0.249-0.232c0.089-1.271,1.151-2.268,2.419-2.268 c0.229,0,0.47,0.042,0.738,0.127c0.022,0.007,0.045,0.01,0.067,0.01c0.055,0,0.11-0.02,0.156-0.054 C21.962,28.537,22,28.455,22,28.375c0-1.034,0.841-1.875,1.875-1.875c0.447,0,0.885,0.168,1.231,0.473 c0.047,0.041,0.106,0.063,0.165,0.063c0.032,0,0.063-0.006,0.093-0.019c0.088-0.035,0.148-0.117,0.155-0.212 C25.623,25.512,26.712,24.5,28,24.5c0.208,0,0.425,0.034,0.682,0.107c0.023,0.007,0.047,0.01,0.07,0.01 c0.109,0,0.207-0.073,0.239-0.182c0.038-0.133-0.039-0.271-0.172-0.309C28.517,24.04,28.256,24,28,24L28,24z"></path><path fill="#472b29" d="M41.883,25.5c-1.326,0-2.508,0.897-2.874,2.182c-0.038,0.133,0.039,0.271,0.172,0.309 C39.205,27.997,39.228,28,39.25,28c0.109,0,0.209-0.072,0.24-0.182C39.795,26.748,40.779,26,41.883,26 c0.117,0,0.23,0.014,0.342,0.029c0.012,0.002,0.023,0.003,0.035,0.003c0.121,0,0.229-0.092,0.246-0.217 c0.019-0.137-0.077-0.263-0.214-0.281C42.158,25.516,42.022,25.5,41.883,25.5L41.883,25.5z"></path></g><g><circle cx="31" cy="47" r="5.3" fill="#fff"></circle><path fill="#472b29" d="M31,42.4c2.536,0,4.6,2.063,4.6,4.6s-2.064,4.6-4.6,4.6s-4.6-2.063-4.6-4.6S28.464,42.4,31,42.4 M31,41c-3.314,0-6,2.687-6,6s2.686,6,6,6s6-2.687,6-6S34.314,41,31,41L31,41z"></path><circle cx="74" cy="47" r="5.3" fill="#fff"></circle><path fill="#472b29" d="M74,42.4c2.536,0,4.6,2.063,4.6,4.6s-2.064,4.6-4.6,4.6s-4.6-2.063-4.6-4.6S71.464,42.4,74,42.4 M74,41c-3.314,0-6,2.687-6,6s2.686,6,6,6s6-2.687,6-6S77.314,41,74,41L74,41z"></path><ellipse cx="52.5" cy="54" fill="#fff" rx="24.8" ry="16.3"></ellipse><path fill="#472b29" d="M52.5,38.4c13.289,0,24.1,6.998,24.1,15.6S65.789,69.6,52.5,69.6S28.4,62.602,28.4,54 S39.211,38.4,52.5,38.4 M52.5,37C38.417,37,27,44.611,27,54s11.417,17,25.5,17S78,63.389,78,54S66.583,37,52.5,37L52.5,37z"></path><path fill="#472b29" d="M63.648,65.891c-0.103,0-0.198-0.063-0.235-0.165c-0.047-0.13,0.021-0.273,0.15-0.32 c2.902-1.049,5.403-2.518,7.233-4.249c0.102-0.095,0.26-0.09,0.354,0.01c0.095,0.1,0.091,0.259-0.01,0.353 c-1.88,1.778-4.441,3.284-7.407,4.356C63.705,65.886,63.677,65.891,63.648,65.891z"></path><path fill="#472b29" d="M72.658,59.666c-0.051,0-0.102-0.015-0.146-0.047c-0.112-0.08-0.138-0.236-0.058-0.349 C73.646,57.604,74.25,55.83,74.25,54c0-1.689-0.518-3.335-1.537-4.894c-0.076-0.116-0.043-0.271,0.072-0.346 c0.115-0.075,0.271-0.043,0.346,0.072c1.074,1.641,1.619,3.38,1.619,5.168c0,1.937-0.636,3.808-1.889,5.562 C72.813,59.63,72.736,59.666,72.658,59.666z"></path><path fill="#472b29" d="M34.179,46.522c-0.066,0-0.132-0.026-0.182-0.078c-0.095-0.1-0.09-0.259,0.01-0.353 c1.88-1.778,4.441-3.284,7.408-4.356c0.129-0.047,0.273,0.02,0.32,0.15c0.047,0.13-0.021,0.273-0.15,0.32 c-2.902,1.049-5.404,2.518-7.234,4.249C34.303,46.499,34.241,46.522,34.179,46.522z"></path><path fill="#472b29" d="M32.226,58.891c-0.081,0-0.161-0.04-0.209-0.113c-1.074-1.641-1.619-3.38-1.619-5.168 c0-1.936,0.636-3.807,1.889-5.562c0.08-0.112,0.236-0.138,0.349-0.058c0.112,0.08,0.138,0.236,0.058,0.349 c-1.192,1.668-1.796,3.441-1.796,5.271c0,1.689,0.517,3.335,1.537,4.894c0.076,0.116,0.043,0.271-0.072,0.346 C32.321,58.878,32.273,58.891,32.226,58.891z"></path><circle cx="71.5" cy="29.5" r="3.8" fill="#fff"></circle><path fill="#472b29" d="M71.5,26.4c1.709,0,3.1,1.391,3.1,3.1s-1.391,3.1-3.1,3.1s-3.1-1.391-3.1-3.1 S69.791,26.4,71.5,26.4 M71.5,25c-2.485,0-4.5,2.015-4.5,4.5s2.015,4.5,4.5,4.5s4.5-2.015,4.5-4.5S73.985,25,71.5,25L71.5,25z"></path><g><circle cx="44" cy="51" r="3.5" fill="#ee3e54"></circle><path fill="#472b29" d="M44,55c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S46.206,55,44,55z M44,48 c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S45.654,48,44,48z"></path></g><g><circle cx="61" cy="51" r="3.5" fill="#ee3e54"></circle><path fill="#472b29" d="M61,55c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S63.206,55,61,55z M61,48 c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S62.654,48,61,48z"></path></g><g><path fill="#472b29" d="M52.5,38c-0.053,0-0.105-0.008-0.158-0.026c-0.262-0.087-0.403-0.37-0.316-0.632l4-12 c0.084-0.25,0.347-0.394,0.604-0.325l11.25,3c0.267,0.071,0.426,0.345,0.354,0.612c-0.071,0.266-0.343,0.427-0.612,0.354 l-10.796-2.879l-3.851,11.554C52.904,37.868,52.709,38,52.5,38z"></path></g><g><path fill="#472b29" d="M52.437,64.363c-2.779,0-5.537-0.812-8.197-2.436c-0.235-0.144-0.31-0.452-0.166-0.687 s0.451-0.31,0.688-0.166c5.054,3.086,10.266,3.084,15.484-0.004c0.236-0.14,0.544-0.062,0.686,0.176 c0.141,0.238,0.062,0.544-0.176,0.685C58.013,63.552,55.214,64.363,52.437,64.363z"></path></g></g>
</svg>
            <p className="text-sm">Reddit</p>
          </span>
        </div>
      </div>

      <div className="p-3 bg-card rounded-md flex justify-between items-center my-8">
        <span className="text-sm">shrl.me/{data?.shortUrl}</span>
        <span
          className="bg-gradient-to-r from-primary to-accent px-3 py-1 rounded-sm cursor-pointer font-[500] transition-all hover:scale-105 text-white"
          onClick={() => {
            handleCopyLink(data?.shortUrl);
          }}
        >
          Copy
        </span>
      </div>
    </div>
  </div>
</div>

      }

      {
        showQrCode &&
        <div className="absolute z-20 inset-0 flex justify-center items-center bg-black/50">
          <div className="w-[40vw] max-w-[600px] bg-muted p-4 px-7 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                              <h1 className="text-3xl font-bold">QrCode </h1>
              <span className="text-lg font-semibold">{userUsage.data.qrcodes.limit - userUsage.data.qrcodes.used} Left</span>
              </div>
              <span className=" cursor-pointer p-2 rounded-full bg-card" onClick={() => { setShowQrCode(false) }}>
                <X className="w-5 h-5" />
              </span>
            </div>
            <div className="border-b-2 border-t-2 border-[rgba(255, 255, 255, 0.2)] py-5 flex justify-center items-center">
              {
                data?.qrImageUrl ?
                <div className="rounded-lg">
                  <Image width={300} height={300} alt="Qr Code Image" src={data?.qrImageUrl} className="rounded-xl"/>
                </div>:
                <div className=" flex flex-col gap-3 h-[300px] justify-center">
                  No Qr Code found
                  <div className="flex justify-center flex-col items-center">
                    <Button className="block" type="submit">Create QR</Button>
                  </div>
                </div>
              }
            </div>


          </div>
        </div>
      }
      {/* Professional Header */}
      <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/50 border p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Go back</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight uppercase text-slate-900 dark:text-slate-100 mb-2">
                {data?.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Detailed analytics and performance metrics</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => { handleCopyLink(data?.shortUrl) }} className="bg-white/50 dark:bg-slate-800/50">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-slate-800/50" onClick={()=>{setShowQrCode(true)}}>
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-slate-800/50" onClick={() => { setShowShareTab(true) }}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/50 dark:bg-slate-800/50"
              onClick={() => setEditOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <EditLinkModal
          open={editOpen}
          onClose={() => {
            setSaveError(null);
            setEditOpen(false);
          }}
          initial={{
            name: data?.name ?? "",
            actualUrl: data?.actualUrl ?? "",
            expiryDate: data?.expiryDate ?? null,
          }}
          saving={updateMutation.isPending}
          errorMsg={saveError}
          onSave={async (form) => {
            setSaveError(null);
            await updateMutation.mutateAsync(form);
          }}
        />

        {/* Subtle decorative elements */}
        <div className="absolute top-4 right-4 opacity-5 dark:opacity-10">
          <Zap className="h-24 w-24" />
        </div>
      </div>

      {/* Clean Information Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Short URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-600">shrl.me/{data?.shortUrl}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { handleCopyLink(data?.shortUrl) }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                Original URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-sm truncate font-medium" title={data.originalUrl}>
                  {data.actualUrl}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                Expiry Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm truncate font-medium" title={data.originalUrl}>
                  {dayjs(data.expiryDate).format('DD MMM YYYY')}
                </span>
                <div className="h-8 w-8 flex-shrink-0 flex items-center">
                  {
                    data.expiryDate && dayjs(data.expiryDate).isAfter(dayjs()) ?
                      <>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                        </span>
                      </> :
                      <>
                        <span className="relative flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                      </>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                Total Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="text-2xl truncate font-medium" title={data.originalUrl}>
                  {data.trackingCount}
                </span>
                {
                  data.cutoff !== null && (
                    data.cutoff < 0 ? (
                      <span className="text-red-500 flex gap-2 items-center text-xs">
                        <TrendingDown className="h-4 w-4" />
                        {parseFloat(data.cutoff).toFixed(2)}% this week
                      </span>
                    ) : (
                      <span className="text-emerald-500 flex gap-2 items-center text-xs">
                        <TrendingUp className="h-4 w-4" />
                        +{parseFloat(data.cutoff).toFixed(2)}% this week
                      </span>
                    )
                  )
                }

              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* Modern Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-center">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <TabsTrigger
              value="analytics"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              📊 Analytics
            </TabsTrigger>
            <TabsTrigger
              value="devices"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              📱 Devices
            </TabsTrigger>
            <TabsTrigger
              value="referrers"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              🔗 Sources
            </TabsTrigger>
            <TabsTrigger
              value="geography"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              🌍 Geography
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="analytics" className="space-y-6">
          {loadingClicks ? (
            <Loader />
          ) : errorClicks ? (
            <p>Failed to load click performance data.</p>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>📈 Click Performance</CardTitle>
                  <div className="flex gap-2">
                    {periodOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={selectedPeriod === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <LinkAnalyticsChart data={clickPerformanceData} period={selectedPeriod} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          {loadingDevices ? (
            <Loader />
          ) : errorDevices ? (
            <p>Failed to load device breakdown data.</p>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>📱 Device Breakdown</CardTitle>
                  <div className="flex gap-2">
                    {periodOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={selectedPeriod === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DeviceBreakdownChart data={deviceData} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="referrers" className="space-y-6">
          {loadingReferrers ? (
            <Loader />
          ) : errorReferrers ? (
            <p>Failed to load referrer data.</p>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>🔗 Traffic Sources</CardTitle>
                  <div className="flex gap-2">
                    {periodOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={selectedPeriod === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ReferrerBreakdown data={referrerData} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          {loadingGeography ? (
            <Loader />
          ) : errorGeography ? (
            <p>Failed to load geography data.</p>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>🌍 Geographical Distribution</CardTitle>
                  <div className="flex gap-2">
                    {periodOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={selectedPeriod === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <GeographicalDistribution data={geographicalData} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Professional Tags and Status Section */}
      <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center gap-2">⚙️ Link Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
              <Badge
                variant={data.expiryDate && dayjs(data.expiryDate).isAfter(dayjs()) ? "default" : "secondary"}
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
              >
                {data.expiryDate && dayjs(data.expiryDate).isAfter(dayjs()) ? "🟢 Active" : "🔴 Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Created:</span>
              <Badge
                variant="outline"
                className="border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                📅 {dayjs(data.createdAt).format('DD MMM YYYY')}
              </Badge>
            </div>
          </div>
          <div>
            {/* <span className="text-sm font-medium text-muted-foreground mb-3 block">Tags:</span> */}
            <div className="flex flex-wrap gap-3">
              {/* {linkDetails.tags.map((tag, index) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    #{tag}
                  </Badge>
                ))} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}
