## Installation


Go into backend and frontend and install to get deps:
```bash
$ npm install
```

Ensure you have version 11.5 of PostgreSQL running on port 54320 with default postgres user with password of "password" and a database table created called testdb4. Use a docker command like this to run immediately: 

```bash
docker run -d --name my_postgres -e PGPASSWORD=password -e POSTGRES_PASSWORD=password -p 54320:5432 postgres:11.5
```

You will still need to generate this database every time your container goes down if you aren't using a mount with the -v option




## Running the app

```bash
# backend
$ npm run start:dev

# frontend
$ npm run start
```

App is default running frontend on 4200, backend on 5000
