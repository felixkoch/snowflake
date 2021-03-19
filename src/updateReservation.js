import insertTimeSlices from "./insertTimeSlices"
import normalizeTimeSlices from "./normalizeTimeSlices"

export default async function updateReservation(snowflake, reservation) {
  console.log("updateReservation()")

  let dbResult

  const row = [
    reservation.bookingId,
    reservation.blockId,
    reservation.groupName,
    reservation.status,
    reservation.checkInTime,
    reservation.checkOutTime,
    reservation.cancellationTime,
    reservation.noShowTime,
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
    reservation.childrenAges,
    reservation.comment,
    reservation.guestComment,
    reservation.channelCode,
    reservation.source,
    reservation.primaryGuest.title,
    reservation.primaryGuest.gender,
    reservation.primaryGuest.firstName,
    reservation.primaryGuest.middleInitial,
    reservation.primaryGuest.lastName,
    reservation.primaryGuest.email,
    reservation.primaryGuest.phone,
    reservation.primaryGuest?.address?.addressLine1,
    reservation.primaryGuest?.address?.addressLine2,
    reservation.primaryGuest?.address?.postalCode,
    reservation.primaryGuest?.address?.city,
    reservation.primaryGuest?.address?.countryCode,
    reservation.primaryGuest.nationalityCountryCode,
    reservation.primaryGuest.identificationNumber,
    reservation.primaryGuest.identificationIssueDate,
    reservation.primaryGuest.identificationType,
    reservation.primaryGuest?.company?.name,
    reservation.primaryGuest?.company?.taxId,
    reservation.primaryGuest?.preferredLanguage,
    reservation.primaryGuest?.birthDate,
    reservation.primaryGuest?.birthPlace,

    reservation.paymentAccount?.accountNumber,
    reservation.paymentAccount?.accountHolder,
    reservation.paymentAccount?.expiryMonth,
    reservation.paymentAccount?.expiryYear,
    reservation.paymentAccount?.paymentMethod,
    reservation.paymentAccount?.payerEmail,
    reservation.paymentAccount?.payerReference,
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
    reservation.travelPurpose,
    reservation.balance.amount,
    reservation.balance.currency,
    reservation.corporateCode,
    reservation.allFoliosHaveInvoice,
    reservation.hasCityTax,

    reservation?.commission?.commissionAmount?.amount,
    reservation?.commission?.commissionAmmount?.currency,
    reservation?.commission?.beforeCommission?.amount,
    reservation?.commission?.beforeCommission?.currency,
    reservation.promoCode,
    reservation.id,
  ]

  dbResult = await snowflake.execute(
    `UPDATE reservations
      SET bookingId = ?,
      blockId = ?,
      groupName = ?,
      status = ?,
      checkInTime = ?,
      checkOutTime = ?,
      cancellationTime = ?,
      noShowTime = ?,
      propertyId = ?,
      propertyCode = ?,
      propertyName = ?,
      ratePlanId = ?,
      ratePlanCode = ?,
      ratePlanIsSubjectToCityTax = ?,
      unitGroupId = ?,
      unitGroupCode = ?,
      unitId = ?,
      unitName = ?,
      totalGrossAmount = ?,
      totalGrossCurrency = ?,
      arrival = ?,
      departure = ?,
      created = ?,
      modified = ?,
      adults = ?,
      childrenAges = ?,
      comment = ?,
      guestComment = ?,
      channelCode = ?,
      source = ?,
      primaryGuestTitle = ?,
      primaryGuestGender = ?,
      primaryGuestFirstName = ?,
      primaryGuestMiddleInitial = ?,
      primaryGuestLastName = ?,
      primaryGuestEmail = ?,
      primaryGuestPhone = ?,
      primaryGuestAddressLine1 = ?,
      primaryGuestAddressLine2 = ?,
      primaryGuestPostalCode = ?,
      primaryGuestCity = ?,
      primaryGuestCountryCode = ?,
      primaryGuestNationalityCountryCode = ?,
      primaryGuestIdentificationNumber = ?,
      primaryGuestIdentificationIssueDate = ?,
      primaryGuestIdentificationType = ?,
      primaryGuestCompanyName = ?,
      primaryGuestCompanyTaxId = ?,
      primaryGuestPreferredLanguage = ?,
      primaryGuestBirthDate = ?,
      primaryGuestBirthPlace = ?,


      paymentAccountNumber = ?,
      paymentAccountHolder = ?,
      paymentAccountExpiryMonth = ?,
      paymentAccountExpiryYear = ?,
      paymentAccountPaymentMethod = ?,
      paymentAccountPayerEmail = ?,
      paymentAccountPayerReference = ?,
      paymentAccountIsVirtual = ?,
      paymentAccountIsActive = ?,

      guaranteeType = ?,

      cancellationFeeId = ?,
      cancellationFeeCode = ?,
      cancellationFeeDueDateTime = ?,
      cancellationFeeAmount = ?,
      cancellationFeeCurrency = ?,
      
      noShowFeeId = ?,
      noShowFeeCode = ?,
      noShowFeeAmount = ?,
      noShowFeeCurrency = ?,

      travelPurpose = ?,

      balanceAmount = ?,
      balanceCurrency = ?,

      corporateCode = ?,

      allFoliosHaveInvoice = ?,
      hasCityTax = ?,

      commissionAmount = ?,
      commissionCurrency = ?,
      beforeCommissionAmount = ?,
      beforeCommissionCurrency = ?,
      promoCode = ?
      WHERE id = ?
    `,
    [row]
  )

  console.log(dbResult)

  dbResult = await snowflake.execute(`DELETE FROM timeslices WHERE reservationId = ?`, [reservation.id])

  console.log(dbResult)
  
  await insertTimeSlices(snowflake, normalizeTimeSlices(reservation))

}
