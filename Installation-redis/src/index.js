import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';


const app = express();

const url_redis = process.env.REDIS_URL || 'redis://localhost:6379'
const redis = new Redis(url_redis)

const url_mongo = process.env.MONGO_URL || 'mongodb://localhost:27017/mongo_redis'

app.get('/redis', async (req,res) => {
    const reply = await redis.ping();
    console.log(reply);
    
    res.json({
        redis: reply
    })
})

app.get('/mongo', async (req,res) => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(url_mongo)
    }
    res.json({
        mongo: "connected",
        database: mongoose.connection.name
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    
})