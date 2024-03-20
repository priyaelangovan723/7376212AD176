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
app.post('/add/auth', function (request, response) {
    db.collection('Auth').insertOne(request.body).then(function () {
        response.status(201).json({
            "status": "entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({
            "status": "entry not added"
        })
    })
})
app.post('/add/products', function (request, response) {
    db.collection('Products').insertOne(request.body).then(function () {
        response.status(201).json({
            "status": "entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({
            "status": "entry not added"
        })
    })
})
const axiosfn = () => {
    axios.post("http://20.244.56.144/products/register", { "companyName": "goMart", "ownerName": "Priyadharshini", "rollNo": "212AD176", "ownerEmail": "priyadharshini10.ad21@bitsathy.ac.in", "accessCode": "qaNXGH" })
        .then(response => {
            data = response.data
            console.log("Response data:", response.data)
            console.log(data.clientID)
            console.log(data.clientSecret)
            axios.post("http://127.0.0.1:8000/add", data).then(response => {
                console.log(response.data)
            })
        })
        .catch(error => {
            console.log("Error:", error.message)
            if (error.message == "Request failed with status code 409") {
                console.log("checked")
                data = {
                    "companyName": "goMart", "ownerName": "Priyadharshini", "rollNo": "7376212AD176", "ownerEmail": "priyadharshini.ad21@bitsathy.ac.in", "accessCode": "qaNXGH"
                }


            }
        }
        )
}
app.post('/signup', function (request, response) {
    const user1 = db.collection('Registry').findOne({ "ownerEmail": request.body.ownerEmail }).then(function (result) {
        console.log(user1)

        return result
    })
    let ownerEmail
    const userfn = () => {
        user1.then((a) => {
            if (a == null) {
                console.log("a is null")
                axiosfn()
            }

            else {
                response.json({
                    "status": "You've already registered, Please Login"
                })
            }

        })



    }
    userfn()
}
)
const authfn = () => {
    axios.post("http://20.244.56.144/products/auth", {

        "companyName": "goMart",
        "clientID": "9828f94b-066f-43ba-a1cc-683ec9fc7e79",
        "clientSecret": "kkVuvKYNjPYNwKJI",
        "ownerName": "Priyadharshini",
        "ownerEmail": "priyadharshini10.ad21@bitsathy.ac.in",
        "rollNo": "212AD176"
    })
        .then(response => {
            data = response.data
            console.log("Response data:", response.data)
            console.log(data.token_type)
            console.log(data.access_token)
            axios.post("http://127.0.0.1:8000/add/auth", data).then(response => {
                console.log(response.data)
            })
        })
        .catch(error => {
            console.log("Error:", error.message)
            if (error.message == "Request failed with status code 409") {
                console.log("checked")
                data = {
                    "companyName": "goMart", "ownerName": "Priyadharshini", "rollNo": "7376212AD176", "ownerEmail": "priyadharshini.ad21@bitsathy.ac.in", "accessCode": "qaNXGH"
                }


            }
        }
        )
}
app.post('/auth', function (request, response) {
    const user1 = db.collection('Registry').findOne({ "ownerEmail": request.body.ownerEmail }).then(function (result) {
        console.log(user1)

        return result
    })
    let ownerEmail
    const tokenfn = () => {
        user1.then((a) => {
            if (a == null) {
                console.log("a is null")

            }

            else {
                authfn()
                response.json({
                    "status": "You've already registered, Please Login"
                })
            }

        })



    }
    tokenfn()
}
)

const productfn = () => {
    axios.get("http://20.244.56.144/products/companies/AMZ/categories/Laptop/products?top=10&minPrice=1&maxPrice=10000")
        .then(response => {
            data = response.data
            console.log("Response data:", response.data)
            console.log(data.productName)
            console.log(data.price)
            axios.post("http://127.0.0.1:8000/add/auth", data).then(response => {
                console.log(response.data)
            })
        })
        .catch(error => {
            console.log("Error:", error.message)
            if (error.message == "Request failed with status code 409") {
                console.log("checked")
                data = {
                    "companyName": "goMart", "ownerName": "Priyadharshini", "rollNo": "7376212AD176", "ownerEmail": "priyadharshini.ad21@bitsathy.ac.in", "accessCode": "qaNXGH"
                }


            }
        }
        )
}

app.get('/get-entries', function (request, response) {
    const products = db.collection('Products').findOne({ "productName": request.body.productName }).then(function (result) {
        return result

    })
    const getfn = () => {
        products.then((a) => {
            if (a == null) {
                productfn()
            }
            else {
                const entries = []
                db.collection('Products')
                    .find()
                    .forEach(entry => entries.push(entry))
                    .then(function () {
                        response.status(200).json(entries)
                    }).catch(function () {
                        response.status(404).json({
                            "status": "Could not fetch documents"
                        })
                    })
            }

        }

        )


    }

    getfn()
})