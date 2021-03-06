const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port=process.env.PORT || 5000;
const app =express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(cors()) //different site 
app.use(express.json())//body theke data parse , undefind dekhai
// database connection


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eeci3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect()
        const serviceCollection=client.db('geniusCar').collection('service')
       app.get('/service',async(req,res)=>{
        const query={};
        const cursor=serviceCollection.find(query)
        const services=await cursor.toArray()
        res.send(services)
       })

       app.get('/service/:id',async(req,res)=>{
           const id=req.params.id
           const query={_id:ObjectId(id)}
           const service=await serviceCollection.findOne(query)
           res.send(service)
       })
       //post 
       app.post('/service',async(req,res)=>{
           const newService=req.body
           const result=await serviceCollection.insertOne(newService)
           res.send(result)
       })
       //delete
       app.delete('service/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await serviceCollection.deleteOne(query)
            res.send(result)
       })
    }
    finally{

    }

}

run().catch(console.dir)

//root api
app.get('/',(req,res)=>{
    res.send('Running Genius Server')
})

//listen na korle dekhabe na r pabeo na
app.listen(port,()=>{
    console.log('Listening to port',port)
})