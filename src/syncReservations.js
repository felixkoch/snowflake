import insertReservations from "./insertReservations"
import insertTimeSlices from "./insertTimeSlices"
import normalizeTimeSlices from "./normalizeTimeSlices"

export default async function syncReservations(snowflake, accessToken) {
  console.log('syncReservations()')
  let dbResult

  dbResult = await snowflake.execute(`CREATE OR REPLACE TABLE reservations (
    id VARCHAR(255) PRIMARY KEY,
    bookingId VARCHAR(255),
    blockId  VARCHAR(255),
    groupName VARCHAR(255),
    status VARCHAR(255),
    checkInTime TIMESTAMP_TZ,
    checkOutTime TIMESTAMP_TZ,
    cancellationTime TIMESTAMP_TZ,
    noShowTime TIMESTAMP_TZ,
    propertyId VARCHAR(255) REFERENCES properties(id),
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
    childrenAges ARRAY,
    comment VARCHAR(255),
    guestComment VARCHAR(255),
    channelCode VARCHAR(255),
    source VARCHAR(255),
    primaryGuestTitle VARCHAR(255),
    primaryGuestGender VARCHAR(255),
    primaryGuestFirstName VARCHAR(255),
    primaryGuestMiddleInitial VARCHAR(255),
    primaryGuestLastName VARCHAR(255),
    primaryGuestEmail VARCHAR(255),
    primaryGuestPhone VARCHAR(255),
    primaryGuestAddressLine1 VARCHAR(255),
    primaryGuestAddressLine2 VARCHAR(255),
    primaryGuestPostalCode VARCHAR(255),
    primaryGuestCity VARCHAR(255),
    primaryGuestCountryCode VARCHAR(255),
    primaryGuestNationalityCountryCode VARCHAR(255),
    primaryGuestIdentificationNumber VARCHAR(255),
    primaryGuestIdentificationIssueDate DATE,
    primaryGuestIdentificationType VARCHAR(255),
    primaryGuestCompanyName VARCHAR(255),
    primaryGuestCompanyTaxId VARCHAR(255),
    primaryGuestPreferredLanguage VARCHAR(255),
    primaryGuestBirthDate DATE,
    primaryGuestBirthPlace VARCHAR(255),


    paymentAccountNumber VARCHAR(255),
    paymentAccountHolder VARCHAR(255),
    paymentAccountExpiryMonth VARCHAR(255),
    paymentAccountExpiryYear VARCHAR(255),
    paymentAccountPaymentMethod VARCHAR(255),
    paymentAccountPayerEmail VARCHAR(255),
    paymentAccountPayerReference VARCHAR(255),
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
    travelPurpose VARCHAR(255),
    balanceAmount NUMBER(20,2),
    balanceCurrency VARCHAR(255),
    corporateCode VARCHAR(255),
    allFoliosHaveInvoice BOOLEAN,
    hasCityTax BOOLEAN,
    commissionAmount NUMBER(20,2),
    commissionCurrency VARCHAR(255),
    beforeCommissionAmount NUMBER(20,2),
    beforeCommissionCurrency VARCHAR(255),
    promoCode VARCHAR(255)
  )`)

  console.log(dbResult)

  const response = await fetch(
    "https://api.apaleo.com/booking/v1/reservations?expand=timeSlices",
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

  await insertReservations(snowflake, data.reservations)

  let timeSlices = []
  data.reservations.forEach(reservation => {
    timeSlices= [...timeSlices, ...normalizeTimeSlices(reservation)]
  })

  await insertTimeSlices(snowflake, timeSlices)

}