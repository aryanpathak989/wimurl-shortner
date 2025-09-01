"use client"

import { Globe, MapPin, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface GeographicalDistributionProps {
  data: {
    totalClicks: number
    countries: Array<{
      country: string
      clicks: number
      percentage: number
    }>
  }
}
// Country flag emojis
const countryFlags = {
  US: "🇺🇸",
  GB: "🇬🇧",
  CA: "🇨🇦",
  DE: "🇩🇪",
  FR: "🇫🇷",
  AU: "🇦🇺",
  JP: "🇯🇵",
  XX: "🌍", // Others
}

const countryNameToCode: Record<string, string> = {
  UK: "GB",
  USA: "US",
  India: "IN",
  Unknown: "XX",
  // add more if needed
}

export function GeographicalDistribution({ data }: GeographicalDistributionProps) {
  if (!data || !data.countries) return null;

  // Map countries to expected shape
  const mappedData = data.countries.map(country => ({
    country: country.country,
    value: country.percentage,
    code: countryNameToCode[country.country] || "XX",
  }));

  const total = mappedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8">
      {/* World Map Placeholder */}
      <div className="relative h-[200px] rounded-lg bg-slate-50 dark:bg-slate-800 border flex items-center justify-center overflow-hidden">
        <div className="text-center text-muted-foreground">
          <Globe className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm font-medium">🗺️ Interactive World Map</p>
          <p className="text-xs">Coming Soon</p>
        </div>
      </div>

      {/* Country List */}
      <div className="space-y-4">
        <h4 className="font-bold text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Countries & Regions
        </h4>

        <div className="grid gap-4">
          {mappedData.map((country, index) => {
            const percentage = (country.value / total) * 100;
            const flag = countryFlags[country.code as keyof typeof countryFlags] || "🌍";

            return (
              <div
                key={country.country}
                className="group relative overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:border-slate-700"
              >
                <div className="flex items-center gap-4 p-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-2xl">
                      {flag}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            {country.country}
                            {index === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {Math.round((country.value / 100) * data.totalClicks)} clicks
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{country.value}%</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</div>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 text-center shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <div className="text-3xl font-bold text-blue-600">{mappedData.length - 1}</div>
          <div className="text-sm text-muted-foreground">🌍 Countries</div>
        </div>
        <div className="rounded-lg border bg-white p-6 text-center shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <div className="text-xl font-bold">{mappedData[0]?.country}</div>
          <div className="text-sm text-muted-foreground">🏆 Top Country</div>
        </div>
        <div className="rounded-lg border bg-white p-6 text-center shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <div className="text-3xl font-bold text-purple-600">{mappedData[0]?.value}%</div>
          <div className="text-sm text-muted-foreground">📊 Top Share</div>
        </div>
      </div>
    </div>
  );
}

