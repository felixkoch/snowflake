export default async function insertTimeSlices(snowflake, timeSlices) {
  let dbResult

  dbResult = await snowflake.execute(
    `INSERT INTO timeSlices (
    reservationId,
    "FROM",
    "TO",
    serviceDate,
    ratePlanId,
    ratePlanCode,
    ratePlanIsSubjectToCityTax,
    unitGroupId,
    unitGroupCode,
    unitId,
    unitName,
    baseGrossAmount,
    baseNetAmount,
    baseVatType,
    baseVatPercent,
    baseCurrency ,
    totalGrossAmount,
    totalGrossCurrency
  )
  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    timeSlices
  )

}
