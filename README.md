# Maaz Siddiqui Portfolio

A Vite + React + TypeScript single‑page portfolio with SSR support for AWS Amplify.

## Requirements
- Node.js 18+
- npm

## Install
```bash
npm install
```

## Development
```bash
npm run dev
```

## SSR (Vite)
Run the SSR dev server:
```bash
npm run dev:ssr
```

Build SSR bundles:
```bash
npm run build:ssr
```

Preview the production SSR build:
```bash
npm run preview:ssr
```

## Where to edit content
- Hero/skills layout: `src/App.tsx`
- Projects: `src/Projects/ProjectsSection.tsx`
- Experience/Resume: `src/Experience/ExperienceSection.tsx`
- Theme/animations: `src/App.css`, `src/index.css`

## Deploying to AWS Amplify (SSR)
1) Push the repo to GitHub.
2) In Amplify Console, create a new app and connect the repo.
3) Use the following build settings (add `amplify.yml` in the repo root):

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build:ssr
  artifacts:
    baseDirectory: dist/client
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

4) Enable SSR (Compute) in Amplify Hosting and set the start command to:
```bash
npm run preview:ssr
```

## Updating the site
If Amplify is connected to the repo with auto‑build enabled, any push to the main branch will trigger a new build and deploy automatically.
