# Sidra Content Factory

منصة إنتاج محتوى مدعومة بالذكاء الاصطناعي لمصنع سدرة

## Overview

مشروع قائم بذاته يوفر "غرفة عمليات" متكاملة لإنشاء المحتوى في خطوتين رئيسيتين:
1. **توليد الفكرة** - اقتراح 5 أفكار محتوى بناءً على موضوع عام
2. **صياغة المحتوى** - كتابة النص مع نبرة صوت وسياق ثقافي محدد

## Features

- 🚀 نظام توليد الأفكار بالذكاء الاصطناعي
- ✍️ مساعد كتابة المحتوى مع سياقات ثقافية متعددة
- 🌐 واجهة عربية بالكامل بدعم RTL
- 📊 إدارة منصات التواصل الاجتماعي (فيسبوك كمنصة رئيسية)
- ⚙️ لوحة تحكم للإعدادات
- 🔐 نظام توثيق JWT

## Tech Stack

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL
- **Auth**: JWT
- **Deployment**: Docker + GitHub Actions

## Quick Start

### Installation

```bash
# تثبيت الاعتماديات
npm run setup

# تشغيل بيئة التطوير
npm run dev
```

### Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/sidra_factory
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
sidra-content-factory/
├── frontend/          # Next.js frontend
├── backend/           # NestJS backend
├── database/          # Database migrations and seeds
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Ideation
- `POST /api/ideation/generate` - توليد 5 أفكار محتوى
- `POST /api/ideation/select` - اختيار فكرة للمتابعة

### Copywriting
- `POST /api/copywriting/compose` - صياغة المحتوى
- `PUT /api/copywriting/approve` - اعتماد المحتوى

## Deployment

```bash
# بناء ونشر الحاويات
npm run docker:build
npm run docker:up
```

## License

MIT