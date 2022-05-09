const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// midleware 
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.1bkvw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const furnitureItem = client.db("furniture").collection("items");
        const myItems = client.db("furniture").collection("myItems");
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = furnitureItem.find(query);
            const items = await cursor.toArray();

            res.send(items)
        })
        // load single item
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            console.log(query)
            const item = await furnitureItem.findOne(query);
            console.log(item)
            res.send(item);
        })
        // Auth jwt
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expireIn: '1d'
            })
            res.send({ accessToken })
        })
        // increase  & decrease item quantity api
        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upset: true }
            const updateDoc = {
                $set: {
                    quantity: updateInfo.quantity
                }
            }
            const result = await furnitureItem.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        //delte items api
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await furnitureItem.deleteOne(query);
            res.send(result);
        })
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await furnitureItem.deleteOne(query);
            res.send(result);
        })
        // add new item api
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            const result = await furnitureItem.insertOne(newItem);
            res.send(result);
            console.log(result)
        })
        // my Added items from user input
        app.post('/myItems', async (req, res) => {
            const item = req.body;
            const result = await myItems.insertOne(item);
            res.send(result)
        })
        app.get('/myItems', async (req, res) => {
            const query = {};
            const cursor = myItems.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        //delte MyItems api
        app.delete('/myItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myItems.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('smart furniture server is running')
})
app.listen(port, () => {
    console.log("Project is run: ", port)
})