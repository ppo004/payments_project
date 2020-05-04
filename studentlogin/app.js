var express                             = require("express"),
    app                                 = express(),
    bodyParser                          = require("body-parser"),
    Student         = require("./models/studen"),
    Transactions    = require("./models/transactions"),
    Items           = require("./models/f_items"),
    C_Items         = require("./models/conveno_items"),
    L_Items         = require("./models/libitems"),
    Fee_Items       = require("./models/fee_items"),
    mongoose                            = require("mongoose");
    const uri = "mongodb+srv://RFIDpayments:Ff6RfZyRN5arkgvz@payments-ukurt.mongodb.net/test?retryWrites=true&w=majority";
    mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true});
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");
app.get("/",function(req,res){
    res.render("home");
    console.log("hello");
});
app.post("/",function(req,res){
    var f_obj,fee_obj,c_obj,l_obj;
    var rfid,bal;
    var usn=req.body.USN;
    var count,id,i,j=0,k=0,l=0,m=0;
    Student.findOne({USN:usn},function(err,foundUser)
    {  
       if(err){
           console.log(err);
       }
       else{
                bal=foundUser.Balance;
                rfid=foundUser.RFID;
        Transactions.find({RFID:rfid},function(err,foundTransaction){
            count=foundTransaction.length;
            id=foundTransaction.ID;
            console.log(foundTransaction);
        
            res.render("transactions",{data:foundTransaction,count:count,bal:bal});
        });

       }  
    });
});

app.listen(9760,function(){
    console.log("Server start");
});
// {"_id":{"$oid":"5eaed2c5e69dff028022916f"},"items":[{"$oid":"5e8c9cc24589d722903095dc"}],"quantity":{"$numberInt":"1"},"Time":{"$date":{"$numberLong":"1588515525547"}},"Category":"Food","ID":{"$numberInt":"1"},"RFID":"abcd","__v":{"$numberInt":"1"}}