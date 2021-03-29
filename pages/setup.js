import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import getAccessToken from "../src/getAccessToken"

export default function Setup() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Setup completed!
        </Typography>
      </Box>
    </Container>
  )
}

export async function getServerSideProps(ctx) {
  try {
    const host = ctx.req.headers["x-forwarded-host"] || ctx.req.headers.host

    const accessToken = await getAccessToken()

    let response = await fetch("https://webhook.apaleo.com/v1/subscriptions", {
      headers: {
        //'Content-Type': 'application/json',
        authorization: "Bearer " + accessToken,
      },
    })

    if (!response.ok) {
      console.log(response)
      throw "Fehler"
    }

    if (response.status === 200) {
      const subscriptions = await response.json()

      await Promise.all(
        subscriptions.map(async (subscription) => {
          const response = await fetch(
            "https://webhook.apaleo.com/v1/subscriptions/" + subscription.id,
            {
              method: "DELETE",
              headers: {
                authorization: "Bearer " + accessToken,
              },
            }
          )
          if (!response.ok) {
            throw "Fehler"
          }
        })
      )
    }

    response = await fetch("https://webhook.apaleo.com/v1/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        endpointUrl: "https://" + host + "/api/webhook",
        topics: ["Reservation", "Folio"],
      }),
    })

    if (!response.ok) {
      console.log(response)
      throw "Fehler"
    }

    response = await fetch(
      "https://integration.apaleo.com/integration/v1/ui-integrations",
      {
        headers: {
          //'Content-Type': 'application/json',
          authorization: "Bearer " + accessToken,
        },
      }
    )

    if (!response.ok) {
      console.log(response)
      throw "Fehler"
    }

    if (response.status === 200) {
      const integrations = await response.json()

      await Promise.all(
        integrations.uiIntegrations.map(async (integration) => {
          const response = await fetch(
            `https://integration.apaleo.com/integration/v1/ui-integrations/${integration.target}/${integration.id}`,
            {
              method: "DELETE",
              headers: {
                authorization: "Bearer " + accessToken,
              },
            }
          )
          if (!response.ok) {
            console.log(response)
            throw "Fehler"
          }
        })
      )
    }

    response = await fetch(
      "https://integration.apaleo.com/integration/v1/ui-integrations/AccountMenuApps",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
          code: "MYSNOWAPP",
          label: "Snowflake",
          sourceUrl: "https://" + host,
          sourceType: "Public",
        }),
      }
    )

    if (!response.ok) {
      console.log(response)
      throw "Fehler"
    }

    return {
      props: {}, // will be passed to the page component as props
    }
  } catch (e) {
    console.log(e)
    return {
      notFound: true,
    }
  }
}
