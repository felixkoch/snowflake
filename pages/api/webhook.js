import connectSnowflake from "../../src/connectSnowflake";
import getAccessToken from "../../src/getAccessToken";
import pushFolios from "../../src/pushFolios";
import insertReservations from "../../src/insertReservations";
import updateReservation from "../../src/updateReservation";

export default async (req, res) => {

  console.log(req.body)

  const {topic, data} = req.body;

  if(topic === "Reservation")
  {
    await processReservation(data.entityId)
  }
  else if(topic === "Folio")
  {
    await processFolio(data.entityId)
  }

  res.status(200).end()
}

async function processReservation(reservationId)
{
  console.log('updateReservation()')

  const accessToken = await getAccessToken()
  const snowflake = await connectSnowflake()

  const response = await fetch(
    "https://api.apaleo.com/booking/v1/reservations/"+reservationId,
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

  const reservation = await response.json()

  console.log('#############')
  const dbResult = await snowflake.execute(`SELECT id FROM reservations WHERE id = ?` ,[reservation.id])
  console.log(dbResult)
  if(dbResult.length === 0)
  {
    await insertReservations(snowflake, [reservation])
  }
  else
  {
    await updateReservation(snowflake, reservation)
  }
 
}

async function processFolio(folioId)
{
  const accessToken = await getAccessToken()
  const snowflake = await connectSnowflake()

  const response = await fetch(
    "https://api.apaleo.com/finance/v1/folios/"+folioId,
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

  const folio = await response.json()

  await pushFolios(snowflake, [folio])
}