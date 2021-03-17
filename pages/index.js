import React, { useState } from "react"

import Head from "next/head"

import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"

export default function Home() {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
      })

      window.parent.postMessage(
        JSON.stringify({
          type: "notification",
          title: "Snowflake Connector",
          content:
            "Reservations and Folios successfully synced with Snowflake.",
          notificationType: "success",
        }),
        "*"
      )
      setLoading(false)
    } catch (e) {
      console.log(e)
      window.parent.postMessage(
        JSON.stringify({
          type: "notification",
          title: "Snowflake Connector",
          content: "Something went wrong.",
          notificationType: "error",
        }),
        "*"
      )
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box bgcolor="#f5f5f5" p={2}>
        <Typography variant="h4">Snowflake Connector</Typography>
      </Box>
      <Box mt={5} mx={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={onClick}
          disabled={loading}
        >
          {loading ? "syncing..." : "Sync with Snowflake"}
        </Button>
      </Box>
    </Box>
  )
}
