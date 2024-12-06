const express =require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors =require('cors')
require('dotenv').config()
const port =process.env.PORT || 5000
const app =express()

// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwr0f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01`;

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

    const campCollection =client.db('campDB').collection('camp')
    const donatedCollections =client.db('donateDB').collection('donatedCollection')

    app.get('/newcamp', async(req, res)=>{
        const cursor= campCollection.find()
        const result =await cursor.toArray()
        res.send(result)
    })

    app.get('/newcamp6', async (req, res) => {
    try {
        const currentDate = new Date(); 
        
        // filter data
        const cursor = campCollection.find({ deadline: { $gt: currentDate.toISOString().split('T')[0] } });

        // get 6 data
        const result = await cursor.limit(6).toArray();

        res.send(result); 
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).send({ error: "Something went wrong while fetching campaigns." });
    }
});

// get single data api
app.get('/allCamp/:id', async(req, res)=>{
const id =req.params.id
const query ={_id: new ObjectId(id)}
const result =await campCollection.findOne(query)
res.send(result)
})

    // post campdata
    app.post('/newcamp', async(req, res)=>{
        const newCamp =req.body
        console.log(newCamp)
        const result =await campCollection.insertOne(newCamp)
        res.send(result)

    })
    
    //post my donated data
    app.post('/allDonation', async(req, res)=>{
      const donatedData =req.body
      const result =await donatedCollections.insertOne(donatedData)
      res.send(result)
    }) 
    // read for donated data
    app.get('/allDonation', async(req, res)=>{
      const cursor= donatedCollections.find()
      const result =await cursor.toArray()
      res.send(result)
    })
// get data by user name
app.get(`/allDonation/:email`,async(req, res)=>{
  const email =req.params.email
  const query ={userEmail:email}
  const allEmail =donatedCollections.find(query)
  const result =await allEmail.toArray()
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


app.get('/', (req, res)=>{
    res.send('Simple crud is running')
})

app.listen(port, ()=>{
    console.log(`Simple crud is running on port:${port}`)
})