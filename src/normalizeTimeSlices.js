export default function normalizeTimeSlices(reservation) {
  let timeSlices = []
  reservation.timeSlices.forEach((slice) => {
    const row = [
      reservation.id,
      slice.from,
      slice.to,
      slice.serviceDate,

      slice.ratePlan.id,
      slice.ratePlan.code,
      slice.ratePlan.isSubjectToCityTax,
      slice.unitGroup.id,
      slice.unitGroup.code,
      slice?.unit?.id,
      slice?.unit?.name,

      slice.baseAmount.grossAmount,
      slice.baseAmount.netAmount,
      slice.baseAmount.vatType,
      slice.baseAmount.vatPercent,
      slice.baseAmount.currency,

      slice.totalGrossAmount.amount,
      slice.totalGrossAmount.currency,
    ]

    timeSlices.push(row)
  })

  return timeSlices
}
