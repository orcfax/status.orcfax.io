# Orcfax Status Dashboard

A Status Dashboard for the Orcfax Oracle Network hosted at [status.orcfax.io](https://status.orcfax.io).

Uses the [status-index](https://github.com/orcfax/status-index) to index and sync status data for display on the dashboard.

## Features

- **Network Status Monitoring**: Real-time monitoring of the Orcfax network status
- **Incident Tracking**: View active and past incidents affecting the network
- **Network Updates**: Stay informed about the latest network changes and announcements
- **Validator Dashboard**: Monitor validator licenses and ITN participation
- **RSS Feed Integration**: Multiple feed formats for automated monitoring

## RSS Feeds

The dashboard provides RSS feeds to help you stay updated with the latest network status:

- RSS 2.0: `/rss.xml`
- Atom: `/atom.xml`
- JSON Feed: `/rss.json`

## Local Development

To get started locally:

1. Clone the repository and navigate to the root directory
2. Run `pnpm install` to install all dependencies
3. Run `pnpm run dev -- --open` to start the development server and open the app

## Technology Stack

- Built with SvelteKit + DaisyUI + TailwindCSS
- RSS feed generation using Feed.js
- PocketBase for backend data storage
