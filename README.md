<div align="center">

<br />

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/00-social-banner.png">
    <img alt="Failure Forensics Platform Banner" src="docs/screenshots/00-social-banner.png">
  </picture>
</p>

# 🔍 Failure Forensics

**Production-Grade AI Pipeline Observability Platform**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-F97316?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)

[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.16-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-22B5BF?style=flat-square)](https://recharts.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.98-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

---

<div align="left">

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🎯 Industry Verticals](#-industry-verticals)
- [🔌 Integrations](#-integrations)
- [📊 Screenshots](#-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [📈 Performance](#-performance)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)
- [📝 License](#-license)

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="200">
        <br />
        <kbd><kbd>⚡</kbd></kbd>
        <h3><b>Real-Time Monitoring</b></h3>
        <p><sub>Live trace ingestion every 2-5s with rolling windows & P95/P99 latency percentiles</sub></p>
        <br />
      </td>
      <td align="center" width="200">
        <br />
        <kbd><kbd>🎯</kbd></kbd>
        <h3><b>Root Cause Analysis</b></h3>
        <p><sub>AI-powered failure diagnosis with 75-95% confidence scoring & actionable recommendations</sub></p>
        <br />
      </td>
      <td align="center" width="200">
        <br />
        <kbd><kbd>🚨</kbd></kbd>
        <h3><b>Incident Detection</b></h3>
        <p><sub>Auto-detected incidents with severity classification & timeline tracking</sub></p>
        <br />
      </td>
      <td align="center" width="200">
        <br />
        <kbd><kbd>💰</kbd></kbd>
        <h3><b>Cost Tracking</b></h3>
        <p><sub>Real token cost calculation using actual 2024 LLM pricing (OpenAI, Anthropic)</sub></p>
        <br />
      </td>
    </tr>
    <tr>
      <td align="center" width="200">
        <br />
        <kbd><kbd>🔍</kbd></kbd>
        <h3><b>Trace Explorer</b></h3>
        <p><sub>Full-text search across traces with filters & detailed waterfall views</sub></p>
        <br />
      </td>
      <td align="center" width="200">
        <br />
        <kbd><kbd>👥</kbd></kbd>
        <h3><b>Human Review</b></h3>
        <p><sub>Label traces as Correct/Incorrect/Needs Review with inline comments</sub></p>
        <br />
      </td>
      <td align="center" width="200">
        <br />
        <kbd><kbd>📊</kbd></kbd>
        <h3><b>Evaluation Datasets</b></h3>
        <p><sub>Convert failures to test cases with promote/discard workflow</sub></p>
        <br />
      </td>
      <td align="center" width="200">
        <br />
        <kbd><kbd>📈</kbd></kbd>
        <h3><b>Advanced Analytics</b></h3>
        <p><sub>Failure heatmaps, latency percentiles, radar charts & trend analysis</sub></p>
        <br />
      </td>
    </tr>
  </table>
</div>

---

## 🏗️ Architecture

```
Data Ingestion Service
    ↓ (Traces every 2-5s)
Real-Time Data Hook
    ↓                 ↓
Metrics Engine      Incident Detection
    ↓                 ↓
Live Dashboard      Incident Management
Trace Explorer
    ↓
Root Cause Analysis → Human Review → Eval Dataset
Analytics Engine
    ↓
Pipeline Comparison + Failure Heatmap
```

### Core Services

| Service | Purpose | Key Capabilities |
|---------|---------|-----------------|
| **DataIngestionService** | Real-time trace generation | Normal distribution latency, industry-specific failure rates (2-11%), OpenTelemetry-compatible IDs |
| **MetricsService** | Real-time statistics | P50/P90/P95/P99 percentiles, cost aggregation, throughput measurement, pipeline grouping |
| **IncidentDetectionService** | Auto incident detection | Threshold alerts (>10% failure, >5s P95), severity classification, timeline generation |
| **useRealTimeData** | React hook integration | Live subscription, pause/resume controls, 100-trace rolling window, auto-cleanup |

---

## 🚀 Quick Start

### ⚙️ Prerequisites

- Node.js **≥ 18.0** (Recommended: 20.x LTS)
- npm **≥ 9.0** or pnpm **≥ 8.0**
- Git **≥ 2.40**

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ZaheerAbbasOrakzai/ai-failure-forensic-tool.git

# Navigate to project
cd ai-failure-forensic-tool

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:3000**

### 🏗️ Build for Production

```bash
# Type-check first
npm run typecheck

# Create optimized production build
npm run build
```

### 📁 Project Structure

```
ai-failure-forensic-tool/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── Header.tsx           # Top bar with breadcrumbs
│   │   ├── CommandPalette.tsx   # ⌘K global search
│   │   └── ui.tsx               # Card, Badge, Button, StatCard
│   ├── pages/               # Route pages
│   │   ├── LiveDashboard.tsx    # Real-time monitoring
│   │   ├── Dashboard.tsx        # Overview analytics
│   │   ├── TraceExplorer.tsx    # Trace browsing
│   │   ├── TraceDetail.tsx      # Waterfall & span details
│   │   ├── Incidents.tsx        # Incident management
│   │   ├── RootCauseAnalysis.tsx
│   │   ├── Reviews.tsx          # Human review queue
│   │   ├── EvalDataset.tsx      # Evaluation dataset
│   │   ├── Analytics.tsx        # Charts & heatmaps
│   │   ├── Integrations.tsx     # Connected services
│   │   └── SDKDocs.tsx          # Code examples & API
│   ├── services/            # Business logic layer
│   ├── hooks/               # Custom React hooks
│   ├── data/                # Mock data & fixtures
│   ├── types/               # TypeScript type definitions
│   ├── lib/                 # Utilities (cn, etc.)
│   ├── App.tsx              # Root component & routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind + custom animations
└── ...
```

---

## 🎯 Industry Verticals

| 🏥 Healthcare | 💹 Financial Services | ⚖️ Legal Tech | 🛒 E-Commerce | 💻 SaaS / Tech |
|--------------|----------------------|--------------|---------------|----------------|
| **99.9% SLA** | **99.99% SLA** | **99.5% SLA** | **99.0% SLA** | **99.0% SLA** |
| 6% failure rate | 2% failure rate | 11% failure rate | 9% failure rate | 4% failure rate |

---

## 🔌 Integrations

### 🤖 LLM Providers

| Provider | Models Supported | Pricing Integrated |
|----------|------------------|-------------------|
| **OpenAI** | GPT-4 Turbo, GPT-4o, GPT-3.5 Turbo, Embeddings | ✅ 2024 actual pricing |
| **Anthropic** | Claude 3 Opus, Claude 3 Sonnet | ✅ 2024 actual pricing |
| **AWS Bedrock** | Multi-model support | ✅ Coming soon |

### 💸 Cost Calculation

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| GPT-4 Turbo | $10.00 | $30.00 |
| GPT-4o | $5.00 | $15.00 |
| GPT-3.5 Turbo | $0.50 | $1.50 |
| Claude 3 Opus | $15.00 | $75.00 |
| Claude 3 Sonnet | $3.00 | $15.00 |

---

## 📊 Screenshots

<div align="center">

### 🎬 Live Dashboard

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/01-live-dashboard.png">
  <img alt="Live Dashboard - Real-time monitoring with live trace feed, latency charts & incident alerts" src="docs/screenshots/01-live-dashboard.png" width="100%" style="border-radius: 12px; border: 1px solid rgba(249,115,22,0.2); box-shadow: 0 0 40px rgba(249,115,22,0.12);">
</picture>

<sub>Real-time monitoring with live trace feed, latency charts & incident alerts</sub>

<br />
<br />

### 🔍 Trace Waterfall View

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/02-trace-waterfall-view.png">
  <img alt="Trace Waterfall View - Detailed trace analysis with waterfall timing, error detection & metadata inspection" src="docs/screenshots/02-trace-waterfall-view.png" width="100%" style="border-radius: 12px; border: 1px solid rgba(59,130,246,0.2); box-shadow: 0 0 40px rgba(59,130,246,0.12);">
</picture>

<sub>Detailed trace analysis with waterfall timing, error detection & metadata inspection</sub>

<br />
<br />

### 📈 Analytics Dashboard

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/03-analytics-dashboard.png">
  <img alt="Analytics Dashboard - Comprehensive analytics with latency percentiles, trend lines & system quality radar" src="docs/screenshots/03-analytics-dashboard.png" width="100%" style="border-radius: 12px; border: 1px solid rgba(34,197,94,0.2); box-shadow: 0 0 40px rgba(34,197,94,0.12);">
</picture>

<sub>Comprehensive analytics with latency percentiles, trend lines & system quality radar</sub>

</div>

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Core** | React 18.2, TypeScript 5.7, Vite 6.3 |
| **Styling** | Tailwind CSS 4.1, clsx, tailwind-merge |
| **Charts** | Recharts 2.15 (Area, Bar, Pie, Radar, Line) |
| **Animations** | Framer Motion 11.16, CSS Keyframes |
| **Icons** | Lucide React 0.294 |
| **Routing** | React Router 6.30 |
| **Data** | Supabase JS 2.98 (optional) |
| **Drag & Drop** | @dnd-kit/core + sortable |

---

## 📈 Performance

| Metric | Target | Actual |
|--------|--------|--------|
| **Bundle Size (Total)** | < 1.2 MB | ~786 KB |
| **Bundle Size (Gzipped)** | < 300 KB | ~212 KB |
| **Initial Load (3G)** | < 3s | < 2s |
| **Real-time Updates** | N/A | 2-5 second intervals |
| **Time to Interactive** | < 4s | < 2.5s |

---

## 🔒 Security

| Feature | Status | Details |
|---------|--------|---------|
| **RBAC Access Control** | ✅ | Admin, Engineer, Reviewer, Viewer roles |
| **PII Redaction** | ✅ | Automatic sensitive data masking |
| **Audit Logging** | ✅ | All actions timestamped & attributed |
| **SOC 2 Compliance** | ✅ | Integration status monitored |
| **Input Validation** | ✅ | TypeScript + runtime validations |

---

## 🌐 Browser Support

| Chrome ≥ 90 | Firefox ≥ 88 | Safari ≥ 14 | Edge ≥ 90 |
|:------------:|:------------:|:-----------:|:----------:|
| ✅ Primary | ✅ Supported | ✅ Supported | ✅ Supported |

---

## 🤝 Contributing

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feat/amazing-feature`)
3. Make changes with **comprehensive comments**
4. Ensure build passes: `npm run build`
5. Run type checks: `npm run typecheck`
6. **Commit** changes: `git commit -m 'feat: add amazing feature'`
7. **Push** to branch: `git push origin feat/amazing-feature`
8. Open a **Pull Request**

---

## 👤 About the Author

<div align="center">
  <br />
  <a href="https://github.com/ZaheerAbbasOrakzai">
    <img src="https://avatars.githubusercontent.com/u/ZaheerAbbasOrakzai" alt="Zaheer Abbas" width="100" height="100" />
  </a>
  <h3><b>Zaheer Abbas</b></h3>
  <p>
    <i>AI & Deep Learning Engineer • Full-Stack Developer • Systems Architect</i>
  </p>

  [![GitHub](https://img.shields.io/badge/GitHub-ZaheerAbbasOrakzai-181717?style=for-the-badge&logo=github)](https://github.com/ZaheerAbbasOrakzai)

</div>

> *"Bridging theoretical deep learning rigor with battle-tested enterprise software architectures."*

---

## 📝 License

**MIT License** - See LICENSE file for details.

Copyright (c) 2024 Zaheer Abbas

---

<div align="center">

**Made with** ❤️ **using React, TypeScript, Vite & Tailwind CSS**

⭐️ **If you found this useful, please star it on GitHub!** ⭐️

</div>
