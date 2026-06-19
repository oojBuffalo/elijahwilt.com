# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3314)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/postcss`

## Architecture

This is a Next.js App Router project. All routes live in `app/`:
- `app/layout.tsx` - Root layout with Geist font configuration
- `app/page.tsx` - Home page
- `app/globals.css` - Global styles and Tailwind theme configuration

Path alias `@/*` maps to the project root.

## Tailwind v4 Notes

Tailwind v4 uses CSS-based configuration via `@theme` directives in `globals.css`. Custom theme tokens (colors, fonts) are defined there rather than in a `tailwind.config.js` file.
