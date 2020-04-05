var mongoose=require("mongoose");
var studentSchema = new mongoose.Schema({
    RFID:{ type: String, index: { unique: true } },
    name: String,
    USN: { type: String, index: { unique: true } },
    Course: String,
    DOB:String,
    Balance:Number,
    transactions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transactions"
    }]
});
var Stu =mongoose.model("Student",studentSchema);
module.exports=Stu;