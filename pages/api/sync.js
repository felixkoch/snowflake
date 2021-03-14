import { Snowflake } from "snowflake-promise"
import getAccessToken from "../../src/getAccessToken"

export default async (req, res) => {
  try {
    let dbResult
    const accessToken = await getAccessToken()

    const snowflake = new Snowflake({
      account: process.env.SNOWFLAKE_ACCOUNT,
      username: process.env.SNOWFLAKE_USERNAME,
      password: process.env.SNOWFLAKE_PASSWORD,
      database: "apaleo",
      schema: "public",
    })

    await snowflake.connect()

    dbResult = await snowflake.execute("CREATE DATABASE IF NOT EXISTS apaleo ")

    console.log(dbResult)

    dbResult = await snowflake.execute(`CREATE OR REPLACE TABLE reservations (
      id VARCHAR(255) PRIMARY KEY,
      bookingId VARCHAR(255),
      status VARCHAR(255),
      checkInTime TIMESTAMP_TZ,
      checkOutTime TIMESTAMP_TZ,
      propertyId VARCHAR(255),
      propertyCode VARCHAR(255),
      propertyName VARCHAR(255),
      ratePlanId VARCHAR(255),
      ratePlanCode VARCHAR(255),
      ratePlanIsSubjectToCityTax BOOLEAN,
      unitGroupId VARCHAR(255),
      unitGroupCode VARCHAR(255),
      unitId VARCHAR(255),
      unitName VARCHAR(255),
      totalGrossAmount NUMBER(20,2),
      totalGrossCurrency VARCHAR(255),
      arrival TIMESTAMP_TZ,
      departure TIMESTAMP_TZ,
      created TIMESTAMP_TZ,
      modified TIMESTAMP_TZ,
      adults NUMBER,
      channelCode VARCHAR(255),
      primaryGuestFirstName VARCHAR(255),
      primaryGuestMiddleInitial VARCHAR(255),
      primaryGuestLastName VARCHAR(255),
      primaryGuestEmail VARCHAR(255),
      primaryGuestPhone VARCHAR(255),
      primaryGuestAddressLine1 VARCHAR(255),
      primaryGuestPostalCode VARCHAR(255),
      primaryGuestCity VARCHAR(255),
      primaryGuestCountryCode VARCHAR(255),
      paymentAccountNumber VARCHAR(255),
      paymentAccountHolder VARCHAR(255),
      paymentAccountExpiryMonth VARCHAR(255),
      paymentAccountExpiryYear VARCHAR(255),
      paymentAccountPaymentMethod VARCHAR(255),
      paymentAccountPayerEmail VARCHAR(255),
      paymentAccountIsVirtual BOOLEAN,
      paymentAccountIsActive BOOLEAN,
      guaranteeType VARCHAR(255),
      cancellationFeeId VARCHAR(255),
      cancellationFeeCode VARCHAR(255),
      cancellationFeeDueDateTime TIMESTAMP_TZ,
      cancellationFeeAmount NUMBER(20,2),
      cancellationFeeCurrency VARCHAR(255),
      noShowFeeId VARCHAR(255),
      noShowFeeCode VARCHAR(255),
      noShowFeeAmount NUMBER(20,2),
      noShowFeeCurrency VARCHAR(255),
      balanceAmount NUMBER(20,2),
      balanceCurrency VARCHAR(255),
      allFoliosHaveInvoice BOOLEAN,
      hasCityTax BOOLEAN
    )`)

    console.log(dbResult)

    const response = await fetch(
      "https://api.apaleo.com/booking/v1/reservations",
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

    const data = await response.json()

    console.log(data.reservations.length)

    let rows = []
    data.reservations.forEach((reservation) => {
      let row = [
        reservation.id,
        reservation.bookingId,
        reservation.status,
        reservation.checkInTime,
        reservation.checkOutTime,
        reservation.property.id,
        reservation.property.code,
        reservation.property.name,
        reservation.ratePlan.id,
        reservation.ratePlan.code,
        reservation.ratePlan.isSubjectToCityTax,
        reservation.unitGroup.id,
        reservation.unitGroup.code,
        reservation?.unit?.id,
        reservation?.unit?.name,
        reservation.totalGrossAmount.amount,
        reservation.totalGrossAmount.currency,
        reservation.arrival,
        reservation.departure,
        reservation.created,
        reservation.modified,
        reservation.adults,
        reservation.channelCode,
        reservation.primaryGuest.firstName,
        reservation.primaryGuest.middleInitial,
        reservation.primaryGuest.lastName,
        reservation.primaryGuest.email,
        reservation.primaryGuest.phone,
        reservation.primaryGuest?.address?.addressLine1,
        reservation.primaryGuest?.address?.postalCode,
        reservation.primaryGuest?.address?.city,
        reservation.primaryGuest?.address?.countryCode,
        reservation.paymentAccount?.accountNumber,
        reservation.paymentAccount?.accountHolder,
        reservation.paymentAccount?.expiryMonth,
        reservation.paymentAccount?.expiryYear,
        reservation.paymentAccount?.paymentMethod,
        reservation.paymentAccount?.payerEmail,
        reservation.paymentAccount?.isVirtual,
        reservation.paymentAccount?.isActive,
        reservation.guaranteeType,
        reservation.cancellationFee.id,
        reservation.cancellationFee.code,
        reservation.cancellationFee.dueDateTime,
        reservation.cancellationFee.fee.amount,
        reservation.cancellationFee.fee.currency,
        reservation.noShowFee.id,
        reservation.noShowFee.code,
        reservation.noShowFee.fee.amount,
        reservation.noShowFee.fee.currency,
        reservation.balance.amount,
        reservation.balance.currency,
        reservation.allFoliosHaveInvoice,
        reservation.hasCityTax,
      ]

      rows.push(row)
    })

    console.time("dbsave")
    dbResult = await snowflake.execute(
      `INSERT OVERWRITE INTO reservations (id,
        bookingId,
        status,
        checkInTime,
        checkOutTime,
        propertyId,
        propertyCode,
        propertyName,
        ratePlanId,
        ratePlanCode,
        ratePlanIsSubjectToCityTax,
        unitGroupId,
        unitGroupCode,
        unitId,
        unitName,
        totalGrossAmount,
        totalGrossCurrency,
        arrival,
        departure,
        created,
        modified,
        adults,
        channelCode,
        primaryGuestFirstName,
        primaryGuestMiddleInitial,
        primaryGuestLastName,
        primaryGuestEmail,
        primaryGuestPhone,
        primaryGuestAddressLine1,
        primaryGuestPostalCode,
        primaryGuestCity,
        primaryGuestCountryCode,
        paymentAccountNumber,
        paymentAccountHolder,
        paymentAccountExpiryMonth,
        paymentAccountExpiryYear,
        paymentAccountPaymentMethod,
        paymentAccountPayerEmail,
        paymentAccountIsVirtual,
        paymentAccountIsActive,
        guaranteeType,
        cancellationFeeId,
        cancellationFeeCode,
        cancellationFeeDueDateTime,
        cancellationFeeAmount,
        cancellationFeeCurrency,
        noShowFeeId,
        noShowFeeCode,
        noShowFeeAmount,
        noShowFeeCurrency,
        balanceAmount,
        balanceCurrency,
        allFoliosHaveInvoice,
        hasCityTax
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      rows
    )
    console.timeEnd("dbsave")

    console.log(dbResult)

    await syncFolios(snowflake, accessToken)

    res.status(200).end()
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function syncFolios(snowflake, accessToken) {
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
    reservationId VARCHAR(255),
    bookingId VARCHAR(255)

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
      folio?.reservation?.bookingId
    ]

    rows.push(row)
  })

  console.log(rows)

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
      bookingId
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    rows
  )

  console.log(dbResult)
}
