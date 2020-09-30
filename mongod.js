const MongoClient = require("mongodb").MongoClient
const assert = require("assert") //用于调试信息
const dbName = "softExam"
const url = "mongodb://localhost:27017" //连接地址，斜杠"/myproject"表示数据库，若不存在则自动创建
module.exports = {
  handleMongo: (coll, fun, query, res,next) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (
      err,
      client
    ) {
      console.log("Connected successfully to server")

      const db = client.db(dbName)
      const collection = db.collection(coll)

      if (fun === "/getExamLists") {
        collection
          .find(query, { projection: { field: 1, title: 1 } })
          .toArray(function (err, docs) {
            res.send(docs)
          })
      }

      if (fun === "/getQuestion") {
        collection
          .find(
            { field: query.field, "question_list.quesNum": Number(query.quesNum) },
            { projection: { "question_list.$": 1 } }
          )
          .toArray(function (err, docs) {
            let {analysis, ans,...param} = docs[0].question_list[0]
            // console.log(param)
            res.send(param)
          })
      }

      if (fun === "/getAns") {
        collection
          .find(
            { field: query.field, "question_list.quesNum": Number(query.quesNum) },
            { projection: { "question_list.$": 1 } }
          )
          .toArray(function (err, docs) {
            let {analysis, ans} = docs[0].question_list[0]

            // console.log(query.ans,ans,ans == query.ans,'-----')
            res.send({type:analysis == query.ans ? 1 : 0,ans:analysis,analysis:ans})
          })
      }

      //   findDocuments(db, function () {
      //     client.close()
      //   })
    })

    const findDocuments = function (db, callback) {
      const collection = db.collection("papers")

      collection.find({}).toArray(function (err, docs) {
        console.log("Found the following records")
        console.log(docs.map((e) => e.field))
        callback(docs)
      })
    }

    const insertDocuments = function (db, callback) {
      // Get the documents collection
      const collection = db.collection("papers")
      console.log(collection)
      // Insert some documents
      collection.insertMany(data, function (err, result) {
        // assert.equal(err, null)
        // assert.equal(3, result.result.n)
        // assert.equal(3, result.ops.length)
        console.log(`Inserted ${data.length} documents into the collection`)
        callback(result)
      })
    }
  },
}