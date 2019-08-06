# chores-server

A back-end server to the [chores-react](https://github.com/Demanin/chores-react) project.

# Installation

You will need [PostgreSQL](https://www.postgresql.org/) in order to run the server.

The SQL for creating the database is available upon request.

You will need to define the following environment variables.

- `DB_USER`: The username for the PostgreSQL database.
- `DB_PASSWORD`: The password for the PostgreSQL database.
- `DB_DATABASE`: The name of the PostgreSQL database.
- `DB_HOST`: The hostname of the PostgreSQL database.
- `DB_PORT`: The port number of the PostgreSQL database.

# Running

Use `npm start` to run the server. Unless specified otherwise, the server will start on port 5000.
