const express = require("express")
require('dotenv').config()
const routes = require("./routes")
const database = require("./database")

const app = express();
database();

app.use("/auth",routes.authRoute)


app.listen(process.env.PORT,()=>{
    console.log("App Started")
})