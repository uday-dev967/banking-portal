# Banking-Portal

Given two files `app.js` and a database file `bankingPortal.db` consisting of three tables `user`, `transactions`.

Write APIs to perform operations on the tables  only after authentication of the user.

The columns of the tables are given below,

**user Table**

| Columns    | Type    |
| ---------- | ------- |
| id   | INTEGER |
| name | TEXT    |
| email | INTEGER |
| password | TEXT |

**TRANSACTION Table**

| Columns        | Type    |
| -------------  | ------- |
| id             | INTEGER |
| user_id        | TEXT    |
| withdraw_amount| INTEGER |
| deposit_amount | INTEGER |
| date_time      | DATEtIME|




### API 1

#### Path: `/login/`

#### Method: `POST`

**Request**

```
{
  "username": "udaychakravarthi22@gmail.com",
  "password": "uday@2023"
}
```

- **Scenario 1**

  - **Description**:

    If an unregistered user tries to login

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Body**
      ```
      Invalid user
      ```

- **Scenario 2**

  - **Description**:

    If the user provides an incorrect password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Body**
      ```
      Invalid password
      ```

- **Scenario 3**

  - **Description**:

    Successful login of the user

  - **Response**

    Return the JWT Token

    ```
    {
      "jwtToken": "ak2284ns8Di32......"
    }
    ```

### Authentication with Token

- **Scenario 1**

  - **Description**:

    If the token is not provided by the user or an invalid token

  - **Response**
    - **Status code**
      ```
      401
      ```
    - **Body**
      ```
      Invalid JWT Token
      ```

- **Scenario 2**
  After successful verification of token proceed to next middleware or handler

### API 2
### PATH : `/users/`
### METHOD : POST
```
{    
    "name": "uday",
    "password": "uday@2023",
    "role":"customer",
    "email":"udaychakravarthi22@gmail.com"
}
```



<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**
