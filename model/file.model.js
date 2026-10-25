import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
    fileName : {
        type : String,
        required : true
    },
    fileURL : {
        type : String,
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    }
})

const File = mongoose.model("File", fileSchema)
export default File