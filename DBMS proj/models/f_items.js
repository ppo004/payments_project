var mongoose=require("mongoose");

var itemsSchema = new mongoose.Schema({
    FID:Number,
    Fname: String,
    Fcost: Number,
    
});
var Items =mongoose.model("Items",itemsSchema);
module.exports=Items;