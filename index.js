const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

// midleware 
app.use(cors());
app.use(express.json());
// 0cUWMG3lD1zdbfYa
// furniture


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.1bkvw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const furnitureItem = client.db("furniture").collection("items");

        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = furnitureItem.find(query);
            const items = await cursor.toArray();

            res.send(items)
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('this server is running')
})
app.listen(port, () => {
    console.log("Project is run: ", port)
})