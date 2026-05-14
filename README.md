🔗 URL Shortener + Analytics Platform (Bitly Clone)

A high-performance URL shortening and link analytics platform inspired by Bitly, designed to handle massive traffic, provide real-time analytics, and offer a clean dashboard UI for link management. The system is optimized using Redis caching, scalable database design, and efficient backend APIs to support high throughput redirection and detailed click insights.

This project demonstrates real-world engineering practices including caching strategies, analytics tracking, system design, scalable architecture, API optimization, and dashboard visualization.

🚀 Features
✨ URL Shortening Core
Generate short links from long URLs
Custom alias support (optional)
Automatic expiry support for links
Unique short code generation with collision handling
Redirect service optimized for ultra-fast lookups


📊 Advanced Analytics Dashboard

Track and visualize:

Total clicks per link
Click trends (daily/weekly/monthly)
Device breakdown (Mobile/Desktop/Tablet)
Browser and OS insights
Country & location analytics (Geo distribution)
Referrer tracking (Direct, Social, Search, etc.)
Link expiry monitoring


⚡ High Throughput Optimization
Redis caching for frequently accessed short URLs
Cache-aside strategy to reduce DB load
Fast redirect response time (optimized for low latency)
Efficient database indexing for analytics queries
Bulk analytics aggregation for scalable reporting


🖥️ Frontend Dashboard
Link management UI (create, edit, delete)
Real-time analytics charts & metrics
Search + filters for large datasets
Smooth UI transitions and modern design system
Loading skeletons & optimized API calls




🏗️ Tech Stack
Backend
Node.js + Express.js
Sequelize ORM
PostgreSQL / MySQL
Redis (Caching + Performance layer)
JWT Authentication
Frontend
React.js
TanStack Query (React Query)
Tailwind CSS
Framer Motion
Recharts (Analytics Graphs)
Infrastructure / Tools
Docker-ready architecture
REST APIs
Postman API testing
Scalable schema design
Analytics aggregation pipelines
📌 System Architecture Overview

The platform follows a scalable design pattern:

🔁 Redirect Flow (Optimized for Speed)
User visits short link: shurl.me/abc123
Backend checks Redis cache:
If found → instant redirect (low latency)
If not found → fetch from DB → store in Redis → redirect
Analytics event is recorded asynchronously

This ensures high throughput redirection, while avoiding heavy database reads.

⚡ Caching Strategy (Redis)

To support millions of redirects/day, Redis caching is implemented using a Cache-Aside Pattern:

Cache-Aside Flow
Check Redis first (GET shortCode)
If present → return original URL
If absent → query DB → update Redis → return
Benefits

✅ Reduces database load significantly
✅ Enables low-latency redirects
✅ Handles high concurrency efficiently
✅ Improves scalability under traffic spikes

📊 Analytics Data Tracking

Every redirect generates an analytics event such as:

IP Address
Timestamp
Device Type
Browser + OS
Country/Region
Referrer
Link ID

Analytics are stored in a structured schema to support:

Efficient aggregation queries
Fast dashboard insights
Week-over-week comparisons
Trend graphs
🗂️ Database Schema Highlights
Key Tables
users → user accounts
urls → short link mappings
click_logs → raw click tracking
analytics_daily → aggregated daily analytics
devices / countries / referrers → breakdown tables
Indexing for Performance

Indexes are created on:

shortCode
urlId
createdAt
userId

This ensures faster query execution even with large datasets.

📈 Dashboard Insights (Frontend)

The frontend provides a professional analytics UI similar to Bitly:

Metrics Displayed
Total clicks
Active links
Expired links
Click trends chart
Country-wise clicks chart
Device breakdown chart
Referrer performance
Expiry timeline monitoring
UI Enhancements
Animated charts and smooth transitions
Loading skeletons for better UX
Paginated + searchable link table
Responsive design for mobile + desktop
🔥 Performance Highlights

This project focuses heavily on scalability:

Redis caching reduces DB hits for redirects
Redirect API optimized for constant-time lookup
Aggregated analytics queries reduce computation cost
Efficient query patterns using Sequelize raw queries + grouping
Supports high traffic spikes without degrading performance
