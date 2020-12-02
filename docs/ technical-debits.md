## Technical Debits

**Note: the numbers do not mean a priority order**

1. Do not commit envs.
1. Have a place to store the envs.

1. Currently the container is responsible for generating the deps and running the app, I must separate this responsibility.

1. Reflect whether the variables passed to mysql.setupConnectionPool should be passed to the Mysql constructor?

1. Validate that the main env for the operation of the application is set, if it does not issue a fatal error and terminate the process.

1. Add a Logger (winston?)

1. Add indexes to the database

1. Add unique keys

1. Create a category table

1. Add pagination in the list of products and restaurants

1. Add schema validation (middleware) and remove some 

1. Ensure that mysql was started before starting the application

1. Create entities (restaurant, product), for greater consistency of data models in transaction in the application

1. Add unit tests

1. add more integrations test

1. Create a more robust production docker environment

1. Think about the possibility of adding factories responsible for instating service

1. remove responsibility from route validations