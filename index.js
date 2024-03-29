const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//Middleware

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vlqjil4.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const featuredFoodCollection = client.db("harvestHub").collection("featuredFoods");
        //const requestCollection = client.db("harvestHub").collection("request");
        const foodCollection = client.db("harvestHub").collection("food");




        app.get('/featuredFoods', async (req, res) => {
            const cursor = featuredFoodCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //single food details
        app.get('/featuredFoods/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { foodName: 1, foodImage: 1, quantity: 1, expiredDateTime: 1 },
            };
            const result = await featuredFoodCollection.findOne(query, options);
            res.send(result);
        })

        //request related API
        app.post('/featuredFoods', async (req, res) => {
            const requestOrder = req.body;
            console.log(requestOrder);
            const result = await requestCollection.insertOne(requestOrder);
            res.send(result);

        })



        //food related 
        //send new food data to the server
        app.post('/food', async (req, res) => {
            const newFood = req.body;
            console.log(newFood);
            const result = await foodCollection.insertOne(newFood);
            res.send(result);

        })

        app.get('/food', async (req, res) => {

            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/food/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query);
            res.send(result);
        })

        app.delete('/food/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.deleteOne(query);
            res.send(result);
        })

        //read data from the mongodb

        app.get('/food', async (req, res) => {
            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('HarvestHub is running')
})

app.listen(port, () => {
    console.log(`HarvestHub is running on port ${port}`)
})