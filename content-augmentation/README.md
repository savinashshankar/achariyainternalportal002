# Achariya Content Augmentation Service

**Automated Multi-Modal Content Generation Pipeline**

This standalone microservice automatically generates 7 types of educational content from source materials uploaded to Google Drive.

## 🎯 What It Does

Upload a PDF/Word/Video to Google Drive → Get 7 ready-to-use content formats:

1. **AI Avatar Video** (HeyGen)
2. **Audio Narration** (Gemini 2.0)
3. **Slide Deck** (Google Slides)
4. **Infographics** (Canva API)
5. **Explainer Video** (Pictory/HeyGen)
6. **Whiteboard Animation** (VideoScribe)
7. **Interactive Simulator** (Gemini + Templates)

## 🏗️ Architecture

- **Standalone Service** - Does not modify existing LMS codebase
- **Event-Driven** - Triggered by Google Drive webhooks
- **Parallel Processing** - All 7 formats generated simultaneously
- **Quality Gates** - Fidelity scoring ensures content accuracy
- **Auto-Publishing** - Approved content automatically appears in LMS

## 📁 Project Structure

```
content-augmentation/
├── functions/          # Cloud Functions (webhooks, orchestration)
├── workers/            # Content generators (one per format)
├── core/               # Shared utilities (API clients, scoring)
├── api/                # Admin dashboard (FastAPI)
├── database/           # Schema & migrations
├── config/             # Configuration & settings
├── tests/              # Unit & integration tests
└── docs/               # Setup guides & documentation
```

## 🚀 Quick Start

See [docs/SETUP.md](docs/SETUP.md) for complete setup instructions.

## 📊 Status

**Phase**: Initial Setup  
**Version**: 0.1.0  
**Status**: In Development
