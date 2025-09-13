import mongoose, { NumberExpression }  from "mongoose";

type ConnectionObject ={
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function connectDb(): Promise<void>{
     if(connection.isConnected){
       console.log("Already connected to db");
      
     }

     try{

     }catch(err){
        console.log("Error while connecting to db",err);
        process.exit(1);
     }
}