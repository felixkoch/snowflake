// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ClientCredentials } from 'simple-oauth2'


export default async (req, res) => {
  const config = {
    client: {
      id: process.env.APALEO_CLIENT_ID,
      secret: process.env.APALEO_CLIENT_SECRET,
      
    },
    auth: {
      tokenHost: process.env.APALEO_IDENTITY_URL,
      tokenPath: "/connect/token"
    }
  };

  const client = new ClientCredentials(config);
 
  const tokenParams = {
    scope: 'reservations.read',
  };
 
  try {
    const accessToken = await client.getToken(tokenParams, {json: true});
    console.log(accessToken)
    console.log(accessToken.token.access_token)

    const response = await fetch('https://api.apaleo.com/booking/v1/reservations',{
      headers: {
        //'Content-Type': 'application/json',
        'authorization': "Bearer "+accessToken.token.access_token,
      },
    })

    const data = await response.json()

    console.log(data)




  } catch (error) {
    console.log('Access Token error', error.message);
  }



  res.status(200).json({ name: 'John Doe' })
}
