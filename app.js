const express = require("express");
const jwt = require("jsonwebtoken");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(express.json());
let db = null;
const dbpath = path.join(__dirname, "bankingPortal.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server is running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeDBAndServer();

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "udaynikhwify", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.email = payload.email;
        next();
      }
    });
  }
};

// # API FOR CREATING NEW USER

app.post("/users", async (request, response) => {
  const { email, name, password, role } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE name = '${name}';`;
  const dbuser = await db.get(selectUserQuery);
  if (dbuser === undefined) {
    const createNewUserQuery = `INSERT INTO user (name, email, password, role)
                VALUES 
                (
                '${name}', 
                '${email}',
                '${hashedPassword}', 
                '${role}'
                );`;
    const dbResponse = await db.run(createNewUserQuery);
    const id = dbResponse.lastID;
    response.send(`User created successfully`);
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

// ### API FOR LOGIN

app.post("/login/", async (request, response) => {
  const { password, email } = request.body;
  const checkNewUserQuery = `SELECT * FROM user WHERE email = '${email}';`;
  const dbUser = await db.get(checkNewUserQuery);
  if (dbUser !== undefined) {
    const isCorrectPassword = await bcrypt.compare(password, dbUser.password);
    if (isCorrectPassword) {
      const payload = { email: email };
      const jwtToken = jwt.sign(payload, "udaynikhwify");
      response.send({ jwtToken, role: dbUser.role });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  } else {
    response.status(400);
    response.send("Invalid user");
  }
});

// ### API FOR TRANSACTION RECORD

app.post(
  "/user/make-transaction/",
  authenticateToken,
  async (request, response) => {
    let { email } = request;
    console.log(email);
    const getUserIdQuery = `select id from user where email='${email}';`;
    const getUserId = await db.get(getUserIdQuery);
    console.log(getUserId.id);
    const { withdraw_amount, deposit_amount, balance } = request.body;
    //console.log(tweet);

    const currentDate = new Date();
    console.log(currentDate.toISOString().replace("T", " "));

    const postRequestQuery = `insert into transactions(withdraw_amount,deposit_amount,balance , user_id, transaction_date_time) values ("${withdraw_amount}","${deposit_amount}", "${balance}", ${getUserId.id}, '${currentDate}');`;

    const responseResult = await db.run(postRequestQuery);
    const id = responseResult.lastID;
    response.send("Created a Transaction");
  }
);

//GET ### STATES BY ID API
app.get("/user/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const getTransQuery = `
            SELECT
              *
            FROM
             transactions
            WHERE
             user_id = ${id};`;
  const stateArray = await db.all(getTransQuery);
  response.send(stateArray);
});

app.get("/banker/:email", authenticateToken, async (request, response) => {
  const { email } = request.params;
  const getUserIdQuery = `select id from user where email='${email}';`;
  const getUserId = await db.get(getUserIdQuery);
  const getTransQuery = `
            SELECT
              *
            FROM
             transactions
            WHERE
             user_id = ${getUserId.id};`;
  const stateArray = await db.all(getTransQuery);
  response.send(stateArray);
});

app.get(
  "/banker/all-users-transactions",
  authenticateToken,
  async (request, response) => {
    const getTransQuery = `
            SELECT
              *
            FROM
             transactions`;
    const stateArray = await db.all(getTransQuery);
    response.send(stateArray);
  }
);
