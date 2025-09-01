export type LinkProAnalyticsResponse = {
    totalLinks: number;
    totalClicks: number;
    ctr: string; // e.g., "1.50"
    ctrLabel: string; // e.g., "Average"
    activeUser: number;
    urls: {
      id: number;
      name:string;
      shortUrl: string;
      actualUrl: string;
      createdAt: string; // ISO date string
      expiryDate: string | null;
      clicks: number;
      isExpired: boolean;
      chartData:{
        clicks:number
      }[]
    }[];
    weeklyClicks: {
      date: string; // YYYY-MM-DD format
      clicks: number;
    }[];
    deviceBreakdown: {
      device: string; // e.g., "desktop", "mobile"
      count: number;
    }[];
    change: {
      totalLinks: string; // as string percentage e.g., "300.00"
      totalClicks: string;
      activeUser: string;
    };
  }; 
