const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Server is one Mirza")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4fvtstz.mongodb.net/?retryWrites=true&w=majority`;

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
        const doctorCollection = client.db('hospitalDB').collection('doctor')
        const appointmentCollection = client.db('hospitalDB').collection('appointment')

        app.get('/doctors', async (req, res) => {
            const result = await doctorCollection.find().toArray();
            res.send(result)
        })


        app.get('/doctors/:category', async (req, res) => {
            const category = req.params.category;
            const filter = { category: parseInt(category) }
            // console.log(filter);
            const result = await doctorCollection.find(filter).toArray()
            res.send(result)
        })


        app.get('/appointmentdetails/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await doctorCollection.findOne(filter)
            res.send(result)
        })

        app.post('/appointmentData', async (req, res) => {
            const details = req.body;
            const result = await appointmentCollection.insertOne(details)
            res.send(result);
        })
        app.get('/appointmentData', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await appointmentCollection.find(query).toArray();
            res.send(result)
        })

        app.patch("/update/:id", async (req, res) => {
            const id = req.params.id;
            const details = req.body;
            const filter = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    status: details.status
                }
            }
            const result = await appointmentCollection.updateOne(filter, update)
            res.send(result)
        })
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await appointmentCollection.deleteOne(filter)
            res.send(result)
        })

   
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("Al-Shefa hospital server is running on", port ,"port");
})
