export default async function syncProperties(snowflake, accessToken) {
  
  let dbResult
  
  dbResult = await snowflake.execute(`CREATE OR REPLACE TABLE properties (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(255),
    name VARCHAR(255),
    timeZone VARCHAR(255),
    currencyCode VARCHAR(255),
    created TIMESTAMP_TZ,
    houseCount NUMBER

  )`)

  const response = await fetch(
    "https://api.apaleo.com/inventory/v1/properties",
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

  const properties = await response.json()

  let rows = []
  await Promise.all(
    properties.properties.map(async (property) => {
      const response = await fetch(
        `https://api.apaleo.com/reports/v1/reports/property-performance?propertyId=${property.id}&from=2021-03-19&to=2021-03-19`,
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

      const performance = await response.json()

      let row = [
        property.id,
        property.code,
        property.name,
        property.timeZone,
        property.currencyCode,
        property.created,
        performance.houseCount,
      ]
      rows.push(row)
    })
  )


  dbResult = await snowflake.execute(
    `INSERT INTO properties (
      id,
      code,
      name,
      timeZone,
      currencyCode,
      created,
      houseCount
  )
  VALUES(?,?,?,?,?,?,?)`,
    rows
  )

}
