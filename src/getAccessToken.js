import { ClientCredentials } from "simple-oauth2"

export default async function getAccessToken() {
  const config = {
    client: {
      id: process.env.APALEO_CLIENT_ID,
      secret: process.env.APALEO_CLIENT_SECRET,
    },
    auth: {
      tokenHost: process.env.APALEO_IDENTITY_URL,
      tokenPath: "/connect/token",
    },
  }

  const client = new ClientCredentials(config)

  const tokenParams = {
    scope: "reservations.read integration:ui-integrations.manage folios.read reports.read",
  }

  const accessToken = await client.getToken(tokenParams, { json: true })

  return accessToken.token.access_token
}
