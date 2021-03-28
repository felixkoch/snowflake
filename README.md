# Apaleo Snowflake Connector

This app extracts data (e.g. inventory, reservations, folio) from [apaleo](https://apaleo.com) (via API calls and webhooks) and synchronises it with the [Snowflake](https://snowflake.com) data warehouse (cloud data plattform).

The aim of the project is to make the data obtained in apaleo accessible to a business intelligence software (e.g. Microsoft Power BI) and to evaluate it with regard to KPI and data-driven insights.

## Warning

This app is a proof of concept. There is no authentication in this app.

## Getting Started

This app is written with the [next.js](https://nextjs.org/) React Framwork.

In order for the apaleo webhooks and UI integration to work, it must be accessible (even in development) via an SSL encrypted public endpoint on port 443.

You can use [ngrok](https://ngrok.com/) to get an SSL encrypted public URL and tunnel to your development system.

Create a connected app in apaleo with at least the following scopes: `reservations.read integration:ui-integrations.manage folios.read reports.read`. Note client id and secret.

Rename `.env.local.example` to `.env.local` and enter the apaleo and snowflake credentials.

```bash
npm install # first time
npm run dev
ngrok http 3000 # optional if you use ngrok
```

Open `https://[PUBLICURL]/setup`. If you see "Setup completed!" everything works fine and webhooks are activated.

Open apaleo > account context > app menu > Snowflake. Click on "Sync with Snowflake" button. Your data will now be initially transferred to Snowflake.

## Deployment

The easiest way to deploy this app is with [Vercel](https://vercel.com/) or the [Digitalocean App Platform](https://www.digitalocean.com/products/app-platform/). The [Azure App Service](https://azure.microsoft.com/de-de/services/app-service/) is also possible with a little extra effort. Other deployment options (Node Server or Docker) are described [here](https://nextjs.org/docs/deployment#other-hosting-options).

## Power BI Playground

If you want to experiment with some apaleo data and Power BI, you can use the `hackathon.pbix` in the repository. The data, measures, KPIs and reports shown are stored there for offline usage.

