import  mongoose  from "mongoose"

const connectionDB = async () =>{
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('DB connected successfully');
    } catch (error) {
        console.log('Error connecting to MongoDB',error.message);
        process.exit(1);
    }
}


export default connectionDB