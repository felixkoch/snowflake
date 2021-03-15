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
    warnings ARRAY,
    allowedActions ARRAY,
    relatedInvoices ARRAY,
    status VARCHAR(255)

  )`)

  console.log(dbResult)

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

  console.log(data.folios.length)

  let rows = []
  data.folios.forEach((folio) => {
    let row = [
      folio.id,
      folio.created,
      folio.updated,
      folio.type,
      folio?.debitor?.title,
      folio?.debitor?.firstName,
      folio?.debitor?.name,
      folio?.debitor?.address?.addressLine1,
      folio?.debitor?.address?.addressLine2,
      folio?.debitor?.address?.postalCode,
      folio?.debitor?.address?.city,
      folio?.debitor?.address?.countryCode,
      folio?.debitor?.company?.name,
      folio?.debitor?.company?.taxId,
      folio?.debitor?.reference,
      folio.closingDate,
      folio.isMainFolio,
      folio.isEmpty,
      folio?.reservation?.id,
      folio?.reservation?.bookingId,
      folio?.company?.id,
      folio?.company?.code,
      folio?.company?.name,
      folio?.company?.canCheckOutOnAr,
      folio?.balance?.amount,
      folio?.balance?.currency,
      folio.checkedOutOnAccountsReceivable,
      folio.folioWarnings,
      folio.allowedActions,
      folio.relatedInvoices,
      folio.status,
    ]

    rows.push(row)
  })

  dbResult = await snowflake.execute(
    `INSERT OVERWRITE INTO folios (
      id,
      created,
      updated,
      type,
      debitorTitle,
      debitorFirstName,
      debitorName,
      debitorAddressLine1,
      debitorAddressLine2,
      debitorPostalCode,
      debitorCity,
      debitorCountryCode,
      debitorCompanyName,
      debitorCompanyTaxId,
      debitorReference,
      closingDate,
      isMainFolio,
      isEmpty,
      reservationId,
      bookingId,
      companyId,
      companyCode,
      companyName,
      companyCanCheckOutOnAr,
      balanceAmount,
      balanceCurrency,
      checkedOutOnAccountsReceivable,
      warnings,
      allowedActions,
      relatedInvoices,
      status
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    rows
  )

  console.log(dbResult)
}