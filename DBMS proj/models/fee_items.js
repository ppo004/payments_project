var mongoose=require("mongoose");

var Fee_itemsSchema = new mongoose.Schema({
    FeeID:Number,
    Feename: String,
    Feecost: Number,
    
});
var Fee_items =mongoose.model("Fee_items",Fee_itemsSchema);
module.exports=Fee_items;