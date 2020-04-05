var mongoose=require("mongoose");

var C_itemsSchema = new mongoose.Schema({
    CID:Number,
    Cname: String,
    Ccost: Number,
    
});
var C_items =mongoose.model("C_items",C_itemsSchema);
module.exports=C_items;