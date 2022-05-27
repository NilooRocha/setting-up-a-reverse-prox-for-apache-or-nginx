# Configurazione dei server di prova per il reverse proxy

## Prerequisiti

* [NodeJS](https://nodejs.org/en/)
* [Ubuntu 20.04](https://ubuntu.com/download)

Installare NodeJS  :

```sh
sudo apt update
```

```sh
sudo apt install nodejs
```

```sh
sudo apt install npm
```

Dopo aver clonato questa repository, entrare nella directory `cd /reverse-proxy/server`, e lanciare il comando `npm install`, per poter installare le configurazioni necessarie al funzionamento dei server.

## Primo server

Il primo server, che è un server che risponde un JS ON con il contenuto di un [carrello della spesa](https://dummyjson.com/docs/carts) generato randomicamente, per avviarlo devi entrare nella directory `/reverse-proxy/server` e lanciare:

```sh
node serverCart.js
# output:
# Server is listening on port: 3001
```

Per verificare se funziona, andare nel browser vau su `http://localhost:3001`, si otterrà una response simile a:

```json
{
  "id": 1,
  "products": [
    {
      "id": 59,
      "title": "Spring and summershoes",
      "price": 20,
      "quantity": 3,
      "total": 60,
      "discountPercentage": 8.71,
      "discountedPrice": 55
    },
    // more products ...
  ],
  "total": 2328,
  "discountedTotal": 1941,
  "userId": 97,
  "totalProducts": 5,
  "totalQuantity": 10
}
   
```

## Secondo server

Il secondo server invece risponde un JSON con il contenuto di un [utente](https://dummyjson.com/docs/users) generato randomicamente, per avviarlo devi entrare nella directory `/reverse-proxy/server` e lanciare:

```sh
node serverCustomer.js
# output:
# Server is listening on port: 3002
```

Per verificare se funziona, andare nel browser vau su `http://localhost:3002`, si otterrà una response simile a:

```json
{
  "id": 1,
  "firstName": "Terry",
  "lastName": "Medhurst",
  "maidenName": "Smitham",
  "age": 50,
  "gender": "male",
  "email": "atuny0@sohu.com",
  "phone": "+63 791 675 8914",
  "username": "atuny0",
  "password": "9uQFF1Lh",
  "birthDate": "2000-12-25",
  "image": "https://robohash.org/hicveldicta.png?size=50x50&set=set1",
  "bloodGroup": "A−",
  "height": 189,
  "weight": 75.4,
  "eyeColor": "Green",
  "hair": {
    "color": "Black",
    "type": "Strands"
  },
  // more user info ...
  "ein": "20-9487066",
  "ssn": "661-64-2976",
  "userAgent": "Mozilla/5.0 ..."
}

   
```
