const express = require( 'express' )
const app = express()
const port = 3002
const axios = require( 'axios' )

app.get( '/', ( req, res ) => {
  axios.get( `https://dummyjson.com/carts/${ Math.floor( Math.random() * 20 ) + 1
    }` ).then( resp => {
      res.header( "Access-Control-Allow-Origin", "*" );
      res.send( resp.data )
    } );
} )

app.listen( port, () => {
  console.log( `Server is listening on port: ${ port }` )
} )