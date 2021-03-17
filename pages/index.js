import Head from "next/head"

import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"

export default function Home() {
  const onClick = () => {
    console.log("onClick")

    if (crossOriginIsolated) {
      console.log("yes")
    } else {
      console.log("no")
    }

    window.parent.postMessage(
      JSON.stringify({
        type: "notification",
        title: "apaleo",
        content: "rocks",
        notificationType: "success",
      }),
      "*"
    )
  
    
    console.log('danach')
  }

  return (
    <Box>
      <Box bgcolor="#f5f5f5" p={2}>
        <Typography variant="h4">Snowflake Connector</Typography>
      </Box>
      <Box mt={5} mx={2}>
        <Button variant="contained" color="primary" onClick={onClick}>
          Sync with Snowflake
        </Button>
      </Box>
    </Box>
  )
}
