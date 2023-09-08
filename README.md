# to-do-list

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## go to the server folder
```
cd backend
```

## install dependencies for the server
```
npm install
```

## add a file with information about the database. The file name should be db.js. This file should be located in the folder backend.
## Sample file contents

```
const { Pool } = require("pg");

const pool = new Pool({
  user: "username_in_the_database",
  host: "localhost",
  database: "name_of_your_database",
  password: "password",
  port: 5432,
});
module.exports = pool;
```

## run server

```
node server.js
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
