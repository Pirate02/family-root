import 'dotenv/config'

import  express  from "express";
import authRouter from './routes/auth.js'
import familyRouter from './routes/family.js'
import cors from 'cors'

const PORT = process.env.PORT || 3000

const app = express();

app.use(cors())
app.use(express.json())

app.use('/auth',authRouter);
app.use('/families', familyRouter)


app.get("/health",(_,res)=>{
  res.json({status: "ok"})
})


app.listen(PORT, ()=>{

  console.log(`api is running at port ${PORT}!`);

})
