import 'dotenv/config'

import  express  from "express";
import prisma from './db.js';



const app = express();


app.get("/health",(_,res)=>{
  res.json({status: "ok"})
})


app.get("/families", async (req,res)=>{

  try {
    
    res.status(200).json(await prisma.family.findMany())
  } catch (err) {
    res.status(500).json({error: "Internal server error !"})
    console.log(err)

    
  }

})




app.listen(3000, ()=>{

  console.log("api is running at port 3000 !")

})
