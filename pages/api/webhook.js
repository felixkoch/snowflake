import connectSnowflake from "../../src/connectSnowflake";
import getAccessToken from "../../src/getAccessToken";
import pushFolios from "../../src/pushFolios";
import pushReservations from "../../src/pushReservations";

export default async (req, res) => {

  console.log(req.body)

  const {topic, data} = req.body;

  if(topic === "Reservation")
  {
    await updateReservation(data.entityId)
  }
  else if(topic === "Folio")
  {
    await updateFolio(data.entityId)
  }

  res.status(200).end()
}

async function updateReservation(reservationId)
{
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

  console.log(reservation)

  await pushReservations(snowflake, [reservation])
}

async function updateFolio(folioId)
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

  console.log(folio)

  await pushFolios(snowflake, [folio])
}