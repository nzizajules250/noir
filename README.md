# NOIR Streaming

A React + Tailwind movie-streaming front end with a black-and-red visual system.

## Project structure

```text
src/
  components/       Shared UI: navigation, footer, cards, notifications, toast
  contexts/         Authentication, library, and toast state
  data/             Movie, show, notification, and profile data
  pages/            One file per routed screen
  services/         Browser-persistence adapter, ready to swap for an API
  App.jsx           Router, protected routes, and application shell
  main.jsx          React entry point
  styles.css        Global styles and specialised visual effects
```

## Screens

- Home
- Movies
- TV Shows
- Contact
- Login and Sign Up
- Profile
- Waitlist
- Payment plans
- Video player

## Functional behaviour

- URL-based routes with a not-found screen
- Protected profile, billing, waitlist, and player routes
- Sign-in/sign-up/sign-out flow
- Watchlist and playback progress persisted in browser storage
- Movie filtering and text search
- Persistent subscription-plan choice
- Dismissible notifications and animated toast feedback

## Production integrations

The project is fully functional as a front-end demo using browser storage. To make it live, replace the storage adapter with a server API and connect the payment buttons to a provider such as Stripe using server-side keys. Streaming playback similarly needs a licensed video host and signed playback URLs; those credentials are intentionally not hard-coded into the client.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```
