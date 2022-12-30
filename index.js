const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

//pass: zhUrTlO8QoEuyxWh
//user: SocialMedia




const uri = "mongodb+srv://DB_USER:DB_PASS@cluster0.vqco1yi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run(){
    try{

        const usersCollection = client.db('medditSocialMediaDb').collection('users');
        const postsCollection = client.db('medditSocialMediaDb').collection('posts');

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.post('/userpost', async (req, res) => {
            const user = req.body;
            const result = await postsCollection.insertOne(user);
            res.send(result);
        })


        app.get('/userpost/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await postsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/userposts', async (req, res) => {
            const query = {}
            const posts = await postsCollection.find(query).toArray();
            res.send(posts)
        })

        app.get('/sortedposts', async (req, res) => {
            const posts = await postsCollection.find({}).sort({ likes: -1 }).limit(3).toArray();
            res.send(posts)
        })


        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const userInfo = await usersCollection.find(query).toArray();
            res.send(userInfo);
        })

        app.patch('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };

            const updatedName = req.body.name;
            const updatedEmail = req.body.email;
            const updatedUniversity = req.body.university;
            const updatedAddress = req.body.address;
            const updatedImage = req.body.image;

            const updateDoc = {
                $set: {
                    name: updatedName,
                    email: updatedEmail,
                    university: updatedUniversity,
                    address: updatedAddress,
                    image: updatedImage
                },
            };
            const result = await usersCollection.updateOne(query, updateDoc);
            res.send(result);
        })
    }
    finally{

    }

}

run().catch(console.log);

app.get('/', (req, res) => {
    res.send('Meddit social media server running');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})