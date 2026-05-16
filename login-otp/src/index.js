import express from "express";
import Redis from "ioredis";


const app = express();

app.use(express.json());


const url_redis = process.env.REDIS_URL || 'redis://localhost:6379'
const redis = new Redis(url_redis)

function otpKey(phone) {
    return `otp:${phone}`;
}

app.post('/otp', async (req,res) => {
    const {phone} = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await redis.set(otpKey(phone), otp, 'EX', 30);

    res.json({message: 'Otp Sent', otp})
})

app.post('/otp/verify', async(req, res) => {
    const {phone, otp} = req.body;

    const savedOtp = await redis.get(otpKey(phone));

    if(!savedOtp){
        return res.status(400).json({message: 'OTP expired or not found!'});
    }

    if(savedOtp !== otp){
        return res.status(400).json({message: 'Invalid Otp!'});
    }

    await redis.del(otpKey(phone));

    res.json({message: 'Otp verified successfully'})
});

app.get('/otp/:phone/ttl', async (req,res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));

    res.json({ttl});

})


app.listen(3000, ()=>{
    console.log("server running on port 3000!");
    
})