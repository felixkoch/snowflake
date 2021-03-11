import snowflake from "snowflake-sdk"

export default async (req, res) => {
  var connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    database: "apaleo",
    schema: "public"
  })

  /*
  connection.connect(function (err, conn) {
    if (err) {
      console.error("Unable to connect: " + err.message)
    } else {
      console.log("Successfully connected to Snowflake.")
      // Optional: store the connection ID.
      const connection_ID = conn.getId()

      console.log(connection_ID)
    }
  })
  */

  const conn = await connection.connect()

  console.log("Successfully connected to Snowflake.")
  // Optional: store the connection ID.
  const connection_ID = conn.getId()

  console.log(connection_ID)

  /*
  var statement = connection.execute({
    sqlText: "create database apaleo if not exists",
    complete: function (err, stmt, rows) {
      if (err) {
        console.error(
          "Failed to execute statement due to the following error: " +
            err.message
        )
      } else {
        console.log("Successfully executed statement: " + stmt.getSqlText())
      }
    },
  })
*/
  var statement = connection.execute({
    sqlText: `CREATE TABLE Persons (
      ID int NOT NULL PRIMARY KEY,
      LastName varchar(255) NOT NULL,
      FirstName varchar(255),
      Age int
  );`,
    complete: function (err, stmt, rows) {
      if (err) {
        console.error(
          "Failed to execute statement due to the following error: " +
            err.message
        )
      } else {
        console.log("Successfully executed statement: " + stmt.getSqlText())
      }
    },
  })

  res.status(200).json({ name: "Snow" })
}
