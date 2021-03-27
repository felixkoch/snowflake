# Apaleo Snowflake Connector

This app extracts data (e.g. inventory, reservations, folio) from [apaleo](https://apaleo.com) (via API calls and webhooks) and synchronises it with the [Snowflake](https://snowflake.com) data warehouse (cloud data plattform).

The aim of the project is to make the data obtained in apaleo accessible to a business intelligence software (e.g. Microsoft Power BI) and to evaluate it with regard to KPI and data-driven insights.

## Warning

This app is a proof of concept. There is no authentication in this app.

## Getting Started

This app is written with the [next.js](https://nextjs.org/) React Framwork.

In order for the apaleo webhooks and UI integration to work, it must be accessible (even in development) via an SSL encrypted public endpoint on port 443.

You can use ngrok [ngrok](https://ngrok.com/) to get an SSL encrypted public URL and tunnel to your development system.

## Power BI Playground

If you want to experiment with some apaleo data and Power BI, you can use the `hackathon.pbix` in the repository. The data, measures, KPIs and reports shown are stored there for offline usage.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
