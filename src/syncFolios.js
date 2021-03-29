import insertFolios from "./insertFolios"

export default async function syncFolios(snowflake, accessToken) {
  let dbResult

  dbResult = await snowflake.execute(`CREATE OR REPLACE TABLE folios (
    id VARCHAR(255) PRIMARY KEY,
    created TIMESTAMP_TZ,
    updated TIMESTAMP_TZ,
    type VARCHAR(255),
    debitorTitle VARCHAR(255),
    debitorFirstName VARCHAR(255),
    debitorName VARCHAR(255),
    debitorAddressLine1 VARCHAR(255),
    debitorAddressLine2 VARCHAR(255),
    debitorPostalCode VARCHAR(255),
    debitorCity VARCHAR(255),
    debitorCountryCode VARCHAR(255),
    debitorCompanyName VARCHAR(255),
    debitorCompanyTaxId VARCHAR(255),
    debitorReference VARCHAR(255),
    closingDate DATE,
    isMainFolio BOOLEAN,
    isEmpty BOOLEAN,
    reservationId VARCHAR(255) REFERENCES reservations(id),
    bookingId VARCHAR(255),
    companyId VARCHAR(255),
    companyCode VARCHAR(255),
    companyName VARCHAR(255),
    companyCanCheckOutOnAr BOOLEAN,
    balanceAmount NUMBER(20,2),
    balanceCurrency VARCHAR(255),
    checkedOutOnAccountsReceivable BOOLEAN,
    status VARCHAR(255)

  )`)

  const response = await fetch("https://api.apaleo.com/finance/v1/folios", {
    headers: {
      //'Content-Type': 'application/json',
      authorization: "Bearer " + accessToken,
    },
  })

  if (!response.ok) {
    console.log(response)
    throw "Fehler"
  }

  const data = await response.json()

  await insertFolios(snowflake, data.folios)
}
