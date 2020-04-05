var mongoose=require("mongoose");

var L_itemsSchema = new mongoose.Schema({
    LID:Number,
    Lname: String,
    Lcost: Number,
    
});
var L_items =mongoose.model("L_items",L_itemsSchema);
module.exports=L_items;