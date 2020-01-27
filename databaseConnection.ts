import mongoose from "mongoose"

const DATABASE_URI: string = `mongodb://127.0.0.1:27017/dart`;

const connectionOptions: object = {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}

export class DatabaseConnection {
    constructor () {
        mongoose.connect(DATABASE_URI, connectionOptions)
            .then(() => {
                console.log("Database connection successful")
            })
            .catch((error: any) => {
                console.log(`Database connection failed : \r\n ${error}`)
            })
    }
}
