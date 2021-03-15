import { Snowflake } from "snowflake-promise"

export default async function connectSnowflake() {
  const snowflake = new Snowflake({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    database: "apaleo",
    schema: "public",
  })

  await snowflake.connect()

  return snowflake
}
