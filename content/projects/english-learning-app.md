---
title: "English Learning App for Kids"
description: "Fun English learning app for kids -- scalable AWS cloud infrastructure supporting 500K+ users"
draft: false
aliases:
  - "/projects/tofygo/"
tags: ["TypeScript", "AWS", "Cloud Architecture", "AI/ML", "Mobile App", "Full Stack"]
showToc: false
weight: 201
---

# English Learning App at Scale

## Introduction

A fun and engaging English learning app designed for learners aged 8 and above. Whether preparing for the TOEFL Young Students Series or simply improving English skills, the app makes learning feel like play -- with interactive city exploration, badge earning, gamified lessons, and real skill-building aligned to standardized test curricula.

As the lead Full Stack Developer, I designed and built the entire cloud infrastructure from scratch, managed end-to-end CI/CD pipelines, led a 3-member engineering team, and developed both frontend and backend features alongside AI-powered content delivery systems.

## Cloud Architecture (Designed & Built From Scratch)

Independently architected a scalable AWS infrastructure capable of supporting 500-600K users within the client's budget constraints:

### Core Services:
- **AWS ECS**: Containerized application deployment with auto-scaling
- **AWS Lambda**: Serverless functions for AI model inference and content processing
- **Amazon S3**: Static asset storage, user-generated content, and media delivery
- **Amazon SQS**: Asynchronous message queuing for background job processing
- **VPC + ALB**: Private networking with Application Load Balancer for traffic distribution
- **AWS Secrets Manager**: Secure credential management across all services
- **Route 53**: DNS management and domain routing
- **CloudFront**: Global CDN for low-latency content delivery
- **CloudWatch**: Monitoring, logging, and alerting across the entire stack

## AI & Agentic Systems Integration

- **AI Orchestration**: Connected Claude via APIs to internal databases, compliance guardrails, and custom workflows using agent orchestration platforms
- **RAG Pipelines**: Designed custom Retrieve-Augmented Generation pipelines for TOEFL-specific educational content delivery
- **Sub-Agent Hierarchies**: Implemented multi-agent systems where specialized sub-agents handle different aspects of content generation, assessment, and personalization

## Key Features Built

- **CMS Panel**: Full content management system ensuring technical content and operational requirements were met
- **Comprehensive Testing**: Backend test suite using Vitest for software quality assurance
- **End-to-End CI/CD**: Automated deployment workflows from code commit to production
- **Team Leadership**: Led 3-member engineering team, conducted direct client meetings, performed R&D on TOEFL content integration

## Technologies Used

**Frontend & Backend:** TypeScript (full-stack)
**Cloud Infrastructure:** AWS (SQS, S3, ECS, VPC, Secrets Manager, ALB, Route 53, CloudFront, CloudWatch), Docker
**AI/ML:** Claude API, RAG pipelines, multi-agent orchestration
**Testing:** Vitest
**CI/CD:** Custom pipeline management and deployment workflows
