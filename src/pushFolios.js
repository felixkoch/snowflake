export default async function pushFolios(snowflake, folios) {
  let dbResult
  let rows = []

  folios.forEach((folio) => {
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
      //folio.folioWarnings,
      //folio.allowedActions,
      //folio.relatedInvoices,
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
      status
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    rows
  )

  console.log(dbResult)
}