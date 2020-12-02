# Restaurant API

This is an api responsible for managing restaurants and their products.
It was implemented using the standard REST architecture, it has basic CRUD operations

## Requirements

- git
- yarn 1.21.1+
- docker 19.03.13+
- docker-compose 1.24.1+

## How to run

Ensure you are in the project's root directory

Run the application and generate your dependencies
```sh
 ./scripts/development.sh
```
**Important**: If the application does not start correctly when you run the 
script for the first time, stop with ctrl + C and run the script again

Run unit and integration tests, ensure that app is running
```sh
 ./scripts/tests.sh
```

## Project structure

```
├── database
│   ├── a-restaurant
│   └── b-product
├── dist
├── docs
├── scripts
├── src
│   └── app
│       ├── configs
│       ├── errors
│       │   └── types
│       ├── modules
│       ├── repositories
│       ├── routes
│       │   └── errors
│       └── services
├── __tests__
│   ├── assets
│   ├── integration
│   │   └── routes
│   └── unit
└── tmp
```

### Folders description

**database**: Contains scripts for creating the db structure

**dist**: Where ts transpiled output is generated

**docs**: Auxiliary documentation

**scripts**: Contains automation scripts to assist in development

**src**: Application and serve source code

**src/app**: Contains application code

**src/app/configs**: Auxiliary configuration files, example (multerConfig)

**src/app/errors**: Application-specific errors

**src/app/modules**: Auxiliary modules that expose friendly interfaces to interact with lib, example (mysql.ts)

**src/app/repositories**: Contains the logic that bridges the persistence/query of data and application, example (external api, cache, dbs)

**src/app/routes**: Contains http layer logic

**src/app/services**: Contains business logic and intermediates between repositories and routes

**src/__tests__**: App tests

**tmp**: Local storage of images

## API Routes

### Get all restaurants
GET /restaurant
```
curl --request GET \
  --url http://localhost:3000/restaurants
```

### Get restaurant by id
GET /resturant/:id
```
curl --request GET \
  --url http://localhost:3000/restaurants/${restaurantId}
```

### Create a restaurant
POST /restaurant
```
curl --request POST \
  --url http://localhost:3000/restaurants \
  --header 'Content-Type: application/json' \
  --data '{
	"name":"Ali da esquina",
	"address":"Av logo ali, 92",
	"businessHours":"das 7h ás 19h"
}'
```

### Update a restaurant
PATCH /restaurant/:id
```
curl --request PATCH \
  --url http://localhost:3000/restaurants/${restaurantID} \
  --header 'Content-Type: application/json' \
  --data '{
	"photo": "asdasd.com/photo",
	"name": "atualizadao",
	"address": "atualizadinho, 92",
	"businessHours": "férias"
}'
```

### Delete a restaurant
DELETE /restaurant/:id
```
curl --request DELETE \
  --url http://localhost:3000/restaurants/${restaurantID}
```

### Update restaurant to add photo
PATCH /restaurant/:id/avatar
```
curl --request PATCH \
  --url http://localhost:3000/restaurants/${restaurantID}/avatar \
  --header 'Content-Type: multipart/form-data' \
  --header 'content-type: multipart/form-data; boundary=---011000010111000001101001' \
  --form photo=
```

[TODO] GET /restaurant/:id/product

[TODO] POST /restaurant/:id/product

[TODO] PATCH /restaurant/:id/product/:id

[TODO] DELETE /restaurant/:id/product/:id




