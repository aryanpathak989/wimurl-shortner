export type UrlItem = {
  id: number;
  name:string;
  shortUrl: string;
  actualUrl: string;
  createdAt: string; // ISO timestamp
  expiryDate: string | null; // can be null
  clicks: number;
  isExpired: boolean;
  shortUrlFull: string;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type UrlResponse = {
  data: {
    urls: UrlItem[];
    pagination: Pagination;
  };
};

type UrlDetailsResponse = {
  success: boolean;
  data: {
    id: number;
    user_id: number;
    name: string;
    shortUrl: string;
    actualUrl: string;
    expiryDate: string;      // ISO date string
    createdAt: string;       // ISO datetime string
    updatedAt: string;       // ISO datetime string
    trackingCount: number;
    cutoff: number;
  };
};

