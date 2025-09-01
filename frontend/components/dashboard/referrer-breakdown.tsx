"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface ReferrerBreakdownProps {
  data: {
    totalClicks: number;
    referenceStats: Array<{
      reference: string;
      clicks: number;
      percentage: number;
    }>;
  }
}

// Social media platform colors and icons
const platformStyles = {
  facebook: { color: "#1877F2", icon: "📘" },
  twitter: { color: "#1DA1F2", icon: "🐦" },
  instagram: { color: "#E4405F", icon: "📷" },
  youtube: { color: "#FF0000", icon: "📺" },
  linkedin: { color: "#0A66C2", icon: "💼" },
  reddit: { color: "#FF4500", icon: "🤖" },
  snapchat: { color: "#FFFC00", icon: "👻" },
  tiktok: { color: "#000000", icon: "🎵" },
  google: { color: "#4285F4", icon: "🔍" },
  discord: { color: "#5865F2", icon: "🎮" },
  telegram: { color: "#0088CC", icon: "✈️" },
  whatsapp: { color: "#25D366", icon: "💬" },
}

export function ReferrerBreakdown({ data }: ReferrerBreakdownProps) {
  if (!data || !data.referenceStats || data.referenceStats.length === 0) return null;

  // Map API data to your expected format
  const mappedData = data.referenceStats.map(ref => ({
    name: ref.reference.charAt(0).toUpperCase() + ref.reference.slice(1), // Capitalize
    value: ref.percentage,
    logo: ref.reference.toLowerCase(),
    url: `https://www.${ref.reference.toLowerCase()}.com` // Constructed URL, or '' if you prefer
  }));

  const total = mappedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {mappedData.map((referrer, index) => {
          const platform = platformStyles[referrer.logo as keyof typeof platformStyles];
          const percentage = (referrer.value / total) * 100;

          return (
            <div
              key={referrer.name}
              className="group relative overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:border-slate-700"
            >
              <div className="flex items-center gap-4 p-6">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg text-xl shadow-sm"
                    style={{ backgroundColor: platform?.color + "15" }}
                  >
                    {platform?.icon || "🌐"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-lg text-gray-900 dark:text-gray-100">{referrer.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{referrer.url}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-gray-900 dark:text-gray-100">
                          {referrer.value.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {referrer.value > 0
                            ? Math.round((referrer.value / 100) * data.totalClicks) + " clicks"
                            : "No clicks"}
                        </div>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0 rounded-lg" asChild>
                  <a href={referrer.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${referrer.name}`}>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-6 border">
        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">🏆 Top Referrer</h4>
        <div className="flex items-center gap-4">
          <div className="text-3xl">
            {platformStyles[mappedData[0]?.logo as keyof typeof platformStyles]?.icon || "🌐"}
          </div>
          <div>
            <div className="font-bold text-xl">{mappedData[0]?.name}</div>
            <div className="text-lg text-muted-foreground">{mappedData[0]?.value.toFixed(2)}% of all traffic</div>
          </div>
        </div>
      </div>
    </div>
  );
}
