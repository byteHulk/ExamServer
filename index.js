const fs = require("fs")
const express = require("express")
const { handleMongo } = require("./mongod")

const http = require("http")
const https = require("https")
const { query } = require("express")

const localPath = "./https/4562431_www.huangbowen.cn"
// Configuare https
const httpsOption = {
  key: fs.readFileSync(`${localPath}.key`),
  cert: fs.readFileSync(`${localPath}.pem`),
}
// Create service
let app = express()

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  )
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By", " 3.2.1")
  if (req.method == "OPTIONS") res.send(200)
  else next()
})

app.use(function (request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url)
  next()
})

http.createServer(app).listen(80)
https.createServer(httpsOption, app).listen(443)

app.get("/getExamLists", function (req, res) {
  handleMongo("papers", req.path, {}, res)
})

app.post("/getQuestion", function (req, res, next) {
  if (!req.query.field) {
    return next("缺少参数field！")
  }
  if (!req.query.quesNum) {
    return next("缺少参数quesNum！")
  }
  handleMongo("papers", req.path, req.query, res, next)
})

app.post("/getAns", function (req, res, next) {
  if (!req.query.field) {
    return next("缺少参数field！")
  }

  if (!req.query.quesNum) {
    return next("缺少参数quesNum！")
  }

  if (!req.query.ans) {
    return next("缺少参数ans！")
  }
  console.log(req.query)
  handleMongo("papers", req.path, req.query, res, next)
})

app.use(function (err, req, res, next) {
  res.status(401).json({ status: false, Message: err })
})

app.use(function (request, response) {
  response.statusCode = 404
  response.end("404")
})
