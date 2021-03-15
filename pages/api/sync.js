import getAccessToken from "../../src/getAccessToken"
import connectSnowflake from "../../src/connectSnowflake"
import syncFolios from "../../src/syncFolios"
import syncReservations from "../../src/syncReservations"

export default async (req, res) => {
  try {
    const accessToken = await getAccessToken()

    const snowflake = await connectSnowflake()

    await snowflake.execute("CREATE DATABASE IF NOT EXISTS apaleo ")

    await syncReservations(snowflake, accessToken)
    await syncFolios(snowflake, accessToken)

    res.status(200).end()
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}
