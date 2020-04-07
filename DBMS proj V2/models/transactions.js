var mongoose=require("mongoose");

var transactionSchema = new mongoose.Schema({
    name:String,
    quantity: Number,
    Time: Date,
    Category:String,
    transaction_cost:Number,
    items:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"L_items",
        ref:"Items",
        ref:"Fee_items",
        ref:"C_items",
    }]
});
var Transactions = mongoose.model("Transactions",transactionSchema);
module.exports=Transactions;