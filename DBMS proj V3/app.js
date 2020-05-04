var express                             = require("express"),
    app                                 = express(),
    bodyParser                          = require("body-parser"),
    mongoose                            = require("mongoose"),
    passport                            = require("passport"),
    LocalStrategy                       = require("passport-local"),
    passportLocalMongoose               = require("passport-local-mongoose"),
    User                                = require("./models/user"),
    indexRoutes                         = require("./routes/index"),
    newItemRoutes                       = require("./routes/new_items"),
    newStudentRoutes                    = require("./routes/new_student"),
    newTransactionRoutes                = require("./routes/new_transaction"),
    rechargeRoutes                      = require("./routes/recharge"),
    updateItemRoutes                    = require("./routes/update_item"),
    updateStudentRoutes                 = require("./routes/update_student");
    // Student                          = require("./models/studen"),
    // Transactions                     = require("./models/transactions"),
    // Items                            = require("./models/f_items"),
    // C_Items                          = require("./models/conveno_items"),
    // L_Items                          = require("./models/libitems"),
    // Fee_Items                        = require("./models/fee_items"),
    const MongoClient                   = require('mongodb').MongoClient;
    const uri = "mongodb+srv://RFIDpayments:Ff6RfZyRN5arkgvz@payments-ukurt.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "Virat Kohli is the best batsmen cricket has ever seen (just my opinion)",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// *******************ROUTES*************************
app.use("/",indexRoutes);
//NEW STUDENT
app.use("/newstudent",newStudentRoutes);
//NEW TRANSACTIONS
app.use("/newtransaction",newTransactionRoutes);
//NEW ITEMS
app.use("/newitem",newItemRoutes);
//RECHARGE
app.use("/recharge",rechargeRoutes);
//UPDATE/DELETE ITEM 
app.use("/update_item_data",updateItemRoutes);
//UPDATE/DELETE STUDENT
app.use("/update_student_data",updateStudentRoutes);
app.get("*",function(req,res){
    res.send("The URL entered is invalid");
});
app.listen(9750,function(){
    console.log("Server start");
});
