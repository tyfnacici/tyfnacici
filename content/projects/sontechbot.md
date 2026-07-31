---
title: "SonTechBot Automation Platform"
description: "Enterprise automation platform integrating Trendyol Fast Market with ERP systems and license management"
draft: false
tags: ["Electron.js", "TailwindCSS", "MSSQL", "OAuth", "JWT", "ERP Integration", "Desktop App"]
showToc: false
weight: 203
cover:
    image: "projects/sontechbot/screenshot-01.png"
---

### 🔗 [SonTech Bilişim](https://sontechbilisim.com/)

# SonTechBot: Enterprise E-Commerce Automation Platform

## Introduction

An enterprise-grade automation platform developed for SonTech Bilişim that bridges Trendyol Fast Market (Türkiye's leading e-commerce marketplace) with internal ERP systems, the company website, and a software license management system. The application streamlines product listing, order processing, inventory synchronization, and business operations across multiple platforms from a single unified interface.

## Architecture Overview

```
+-------------------+     +------------------+     +-----------------+
|  Trendyol Fast    |<--->|   SonTechBot      |<--->|    ERP System   |
|    Market API     |     |  (Electron.js)    |     |    (MSSQL)      |
+-------------------+     +--------+---------+     +-----------------+
                                 |
                    +------------v----------------+
                    |   Company Website          |
                    |   License Management       |
                    +----------------------------+
```

## Key Features

- **Trendyol Fast Market Integration**: Automated product listing, price updates, stock synchronization, and order management through Trendyol's API
- **ERP System Synchronization**: Real-time bidirectional sync between marketplace data and the company's MSSQL-based ERP system
- **Software License Management**: Built-in license tracking, activation, and renewal management for SonTech's software products
- **Unified Dashboard**: Single interface to monitor all connected platforms -- orders, inventory levels, financial summaries, and operational metrics at a glance
- **Authentication & Security**: OAuth 2.0 for Trendyol API access, JWT-based session management for the desktop application

## Technologies Used

**Electron.js:** Cross-platform desktop application framework enabling native OS integration (file system access, notifications, system tray) while leveraging web technologies for the UI.

**TailwindCSS:** Utility-first CSS framework for rapid, consistent UI development with a professional enterprise aesthetic.

**MSSQL:** Direct database connectivity to the company's ERP system for real-time data synchronization without intermediary API layers.

**OAuth 2.0 + JWT:** Industry-standard authentication protocols ensuring secure API access and session management across all integrated platforms.

## Business Impact

- Eliminated manual data entry between Trendyol, ERP, and internal systems
- Reduced order processing time from hours to minutes through automated workflows
- Provided real-time visibility into inventory levels across all sales channels
- Streamlined software license management for SonTech's product portfolio

![](/projects/sontechbot/screenshot-01.png)
![](/projects/sontechbot/screenshot-02.png)
