export default async function createTableTimeSlices(snowflake) {
  const dbResult = await snowflake.execute(`CREATE OR REPLACE TABLE timeslices (
    reservationId VARCHAR(255) REFERENCES reservations(id),
    "FROM" TIMESTAMP_TZ,
    "TO" TIMESTAMP_TZ,
    serviceDate DATE,
    ratePlanId VARCHAR(255),
    ratePlanCode VARCHAR(255),
    ratePlanIsSubjectToCityTax BOOLEAN,
    unitGroupId VARCHAR(255),
    unitGroupCode VARCHAR(255),
    unitId VARCHAR(255),
    unitName VARCHAR(255),
    baseGrossAmount NUMBER(20,2),
    baseNetAmount NUMBER(20,2),
    baseVatType VARCHAR(255),
    baseVatPercent NUMBER(20,2),
    baseCurrency VARCHAR(255),
    totalGrossAmount NUMBER(20,2),
    totalGrossCurrency VARCHAR(255)

  )`)

  console.log(dbResult)
}
