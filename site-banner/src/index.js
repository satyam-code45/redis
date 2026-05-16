import express from "express";
import Redis from "ioredis"

const app = express();

app.use(express.json());


const url_redis = process.env.REDIS_URL || 'redis://localhost:6379'
const redis = new Redis(url_redis)

const BANNERKEY = "app:banner";

app.post("/banner" , async (req, res) => {
    await redis.set(BANNERKEY, req.body.message || "Welcome to the localhost redis!");
    res.json({success: true})
})

app.get("/banner", async (req, res) => {
    const message = await redis.get(BANNERKEY) || "Welcome to the localhost redis!"

    res.json({message : message})
})

app.delete("/banner", async(req,res) => {
    await redis.del(BANNERKEY);
    res.json({
        success: true
    })
})

app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BANNERKEY);

    res.json({exists: exists})
})

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
    
})