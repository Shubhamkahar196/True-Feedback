import mongoose  from "mongoose";

type ConnectionObject ={
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function connectDb(): Promise<void>{
     if(connection.isConnected){
       console.log("Already connected to db");
      
     }

     try{
       const db = await mongoose.connect(process.env.MONGODB_URL || '')
       
      connection.isConnected= db.connections[0].readyState
      console.log("DB connected successfully")
     }catch(err){
        console.log("Error while connecting to db",err);
        process.exit(1);
     }
}

export default connectDb;