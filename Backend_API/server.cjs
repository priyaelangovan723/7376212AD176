const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { connectToDb, getDb } = require('./dbconnection.cjs')
const { MongoDBCollectionNamespace, ObjectId } = require('mongodb')
const bodyparser = require('body-parser')
const url = axios
const app = express()
app.use(bodyparser.json())
app.use(cors())

connectToDb(function (error) {
    if (error) {
        console.log('Could not establish connection')
        console.log(error)
    }
    else {
        const port = process.env.PORT || 8000
        app.listen(port)
        db = getDb()
        console.log(`Listening on port ${port}`)

    }
})
app.get('/', function (request, response) {
    response.send('working fine')
})
app.post('/add', function (request, response) {
    db.collection('Registry').insertOne(request.body).then(function () {
        response.status(201).json({
            "status": "entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({
            "status": "entry not added"
        })
    })
})
app.post('/signup', function (request, response) {
    const user1 = db.collection('Registry').findOne({ "ownerEmail": request.body.ownerEmail }).then(function (result) {
        return result
    })
    let ownerEmail
    const userfn = () => {
        user1.then((a) => {
            axios.post("http://20.244.56.144/products/register", { "companyName": "goMart", "ownerName": "Priyadharshini", "rollNo": "7376212AD176", "ownerEmail": "priyadharshini.ad21@bitsathy.ac.in", "accessCode": "qaNXGH" })
                .then(response => {
                    data = response.data
                    console.log("Response data:", response.data)
                })
                .catch(error => {
                    console.log("Error:", error.message)
                    if (error.message == "Request failed with status code 409") {
                        console.log("checked")
                        data = {
                            "companyName": "goMart", "ownerName": "Priyadharshini", "rollNo": "7376212AD176", "ownerEmail": "priyadharshini.ad21@bitsathy.ac.in", "accessCode": "qaNXGH"
                        }
                        axios.post("http://127.0.0.1:8000/add", data).then(response => {
                            console.log(response.data)
                        })

                    }
                }
                )

        })
    }
}

)

// axios.post("http://20.244.56.144/products/register", )

// console.log(data)


