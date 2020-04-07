var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Student         = require("./models/studen"),
    Transactions    = require("./models/transactions"),
    Items           = require("./models/f_items"),
    C_Items         = require("./models/conveno_items"),
    L_Items         = require("./models/libitems"),
    Fee_Items       = require("./models/fee_items");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://RFIDpayments:Ff6RfZyRN5arkgvz@payments-ukurt.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// *******************ROUTES*************************
//Home page
app.get("/",function(req,res){
    res.render("home");
});

// ROUTE TO NEW STUDENT FORM
app.get("/newstudent",function(req,res){
    res.render("newstudent",{x:0});
});

//NEW STUDENT POST PROCESSING TAKES PLACE HERE
app.post("/new",function(req,res)
{
    var n=req.body.sname;
    var r=req.body.RFID;
    var d=req.body.DOB;
    var c=req.body.Course;
    var u=req.body.USN;
    if(d.length==0 || n.length == 0 || c.length==0 )
        {
            console.log("err");
            res.render("newstudent",{x:1});
        }
        else
        {
            Student.create(
            {
                RFID:r,
                name: n,
                USN: u,
                Course: c,
                DOB:d,
                Balance:100,
            },
            function(err,data)
            {
                if(err)
                {   console.log(err);
                    res.render("newstudent",{x:1});
                }
                
                else
                {
                    console.log("ok");
                    res.render("newstudent",{x:0});
                }
            });
        }
});
// ROUTE TO NEW TRANSACTION FORM
app.get("/newtransaction",function(req,res){
    res.render("newtransaction",{x:1});
});

// NEW TRANSACTION POST PROCESSING TAKES PLACE HERE
app.post("/newt",function(req,res){
    var it=req.body.item;
    var i=req.body.ID;
    var t= new Date();
    var q=req.body.quantity;
    var r=req.body.RFID;
    var totalcost;
    console.log("RFID LEN "+r.length);
    if(i.toString().length==0 || q.toString().length==0 ||  r.length==0)
    {
        res.render("newtransaction",{x:2});
    }
    else{
    //BELOW CODE IS TO UPDATE STUDENT BALANCE
        if(it=="Food")
        {
            Items.findOne({FID:i},function (err,foundItem)
            {
                if(foundItem==null) res.render("newtransaction",{x:2});
                else
                {
                    totalcost=foundItem.Fcost * q;
                    Student.findOne({RFID:r},function(err,foundUser)
                    {   
                        var bal = foundUser.Balance;
                        if(foundUser==null) res.render("newtransaction",{x:2});
                        else if(bal-totalcost<50)
                            res.render("newtransaction",{x:3});
                        else
                        {  
                            foundUser.Balance = bal-totalcost;
                            foundUser.save(function(err,data)
                                {
                                    if(err) console.log(err);
                                    else res.render("newtransaction",{x:1});
                                });
                        }
                    });
                }
            });
        
        }   
        else if(it=="Library")
        {
            L_Items.findOne({LID:i},function (err,foundItem)
            {
                if(foundItem==null) res.render("newtransaction",{x:2});
                else
                {
                    totalcost=foundItem.Lcost * q;
                    Student.findOne({RFID:r},function(err,foundUser)
                    {
                        var bal = foundUser.Balance;
                        if(foundUser==null) res.render("newtransaction",{x:2});
                        else if(bal-totalcost<50)
                            res.render("newtransaction",{x:3});
                        else
                        {  
                            foundUser.Balance = bal-totalcost;
                            foundUser.save(function(err,data)
                                {
                                    if(err) console.log(err);
                                    else res.render("newtransaction",{x:1});
                                });
                        }
                    });
                }
            });
        }
        else if(it=="Fee_Dept")
        {
            Fee_Items.findOne({FeeID:i},function (err,foundItem)
            {
                if(foundItem==null) res.render("newtransaction",{x:2});
                else
                {
                    totalcost=foundItem.Feecost * q;
                    Student.findOne({RFID:r},function(err,foundUser)
                    {
                        var bal = foundUser.Balance;
                        if(foundUser==null) res.render("newtransaction",{x:2});
                        else if(bal-totalcost<50)
                            res.render("newtransaction",{x:3});
                        else
                        {  
                            foundUser.Balance = bal-totalcost;
                            foundUser.save(function(err,data)
                                {
                                    if(err) console.log(err);
                                    else res.render("newtransaction",{x:1});
                                });
                        }
                    });
                }       
            });
        }
        else{
            C_Items.findOne({CID:i},function (err,foundItem)
            {
                if(foundItem==null) res.render("newtransaction",{x:2});
                else
                {
                    totalcost=foundItem.Ccost * q;
                    Student.findOne({RFID:r},function(err,foundUser)
                    {
                        var bal = foundUser.Balance;
                        if(foundUser==null) res.render("newtransaction",{x:2});
                        else if(bal-totalcost<50)
                            res.render("newtransaction",{x:3});
                        else
                        {  
                            foundUser.Balance = bal-totalcost;
                            foundUser.save(function(err,data)
                                {
                                    if(err) console.log(err);
                                    else res.render("newtransaction",{x:1});
                                });
                        }
                    });
                }
            });
        }
        it=req.body.item;

    //BELOW CODE IS TO CREATE NEW TRANSACTION 
        Transactions.create(
        {
            quantity: q,    
            Time:t,
            Category:it, 
        },function(err,post)
            {
                //link the new transation to the student using his or her rfid
                Student.findOne({RFID:r},function a (err,foundUser)
                {
                    console.log("RFID " +r);
                    if(err) console.log("Student not found");
                    else if(foundUser==null) 
                    {
                        res.render("newtransaction",{x:2});
                    }
                    else
                    {
                        foundUser.transactions.push(post);
                        foundUser.save(function(err,data)
                        {
                            if(err) console.log(err);
                
                        })
                    }
                })
            });
    //link the item bought by the student for the above transaction
        if(it=="Library")
        {
            L_Items.findOne({LID:i},function(err,foundItem)
            {
                if(err) console.log(err);
                else
                { 
                    if(foundItem==null) res.render("newtransaction",{x:2});
                    else
                    { 
                        var post=foundItem._id;
                        totalcost = q*foundItem.Lcost;
                        Transactions.findOne({Time:t,Category:it},function(err,foundUser)
                        {
                            if(err) console.log(err);
                            else if(foundUser==null) console.log("Null boy");
                            else
                            {
                                foundUser.name = foundItem.Lname;
                                foundUser.items.push(post);
                                foundUser.transaction_cost = totalcost;
                                foundUser.save(function(err,data)
                                {
                                    if(err) console.log(err);
                                    else
                                    {
                                        console.log(data);
                                    }
                                })
                            }   
                        })
                    }
                }
            }); 
        }
        else if(it=="Food")
        {
            Items.findOne({FID:i},function(err,foundItem)
            {
                if(err) console.log(err);
                else
                {
                    if(foundItem==null) res.render("newtransaction",{x:2});
                    else
                    {
                        var post=foundItem._id;
                        totalcost = q * foundItem.Fcost;
                        //push the object id of the item to the transaction
                        Transactions.findOne({Time:t,Category:it},function(err,foundUser)
                        {
                            if(err) console.log(err);
                            else if(foundUser==null) console.log("Null boy");
                            else
                            {
                                foundUser.name = foundItem.Fname;
                                foundUser.items.push(post);
                                foundUser.transaction_cost = totalcost;
                                foundUser.save(function(err,data)
                                {
                                    if(err) console.log(err);
                                    else console.log(data);
                                })
                            }
                        })
                    }
                }
            }); 
        }   
    
        else if(it=="Fee_Dept")
        {
            Fee_Items.findOne({FeeID:i},function(err,foundItem)
            {
                if(err) console.log(err);
                else
                {
                    var post=foundItem._id;
                    totalcost = q * foundItem.Feecost;
                    if(foundItem==null) res.render("newtransaction",{x:2});
                    else
                    {
                        Transactions.findOne({Time:t,Category:it},function(err,foundUser)
                        {
                            if(err) console.log("Error");
                            else if(foundUser==null) console.log("Null boy");
                            else
                            {
                                    foundUser.name = foundItem.Feename;
                                    foundUser.items.push(post);
                                    foundUser.transaction_cost = totalcost;
                                    foundUser.save(function(err,data)
                                    {
                                        if(err) console.log(err);
                                        else    console.log(data);
                                    })
                            }
                        })
                    }
                }
            }); 
        }
        else
        {
            C_Items.findOne({CID:i},function(err,foundItem)
            {
                if(err) console.log(err);
                else
                {  
                    if(foundItem==null) res.render("newtransaction",{x:2});
                    else
                    {
                        var post=foundItem._id;
                        totalcost = q * foundItem.Ccost;
                        Transactions.findOne({Time:t,Category:it},function(err,foundUser)
                        {
                            if(err) console.log(err);
                            else if(foundUser==null) console.log("Null boy");
                            else
                            {
                                if(foundItem==null) res.render("newtransaction",{x:2});
                                else
                                {
                                    foundUser.name = foundItem.Cname;
                                    foundUser.items.push(post);
                                    foundUser.transaction_cost = totalcost;
                                    foundUser.save(function(err,data)
                                    {
                                        if(err) console.log(err);
                                        else    console.log(data);
                                    })
                                }
                            }
                        })
                    }
                }
            }); 
        } 
    //END OF TRANSACTION FORM PROCESS PAGE
    }
});



//FORM PAGE FOR NEW ITEM
app.get("/newitem",function(req,res){
    res.render("newitem",{x:0});
});

// ROUTE TO NEW TRANSACTION FORM
app.post("/newItem",function(req,res)
{
    var n=req.body.Iname;
    var f=req.body.ID;
    var c=req.body.cost;
    if(n.length==0 || f.toString().length==0 || c.toString().length==0 )
    {
        res.render("newitem",{x:1});
    }
    else {
        if(req.body.item=="Food")
        {
            Items.create(
            {
                FID:f,
                Fname: n,
                Fcost: c,
            });
        }
        else if(req.body.item=="Conveno")
        {
            C_Items.create(
            {
                CID:f,
                Cname: n,
                Ccost: c,
            });
        }
        else if(req.body.item=="Fee_Dept")
        {
            Fee_Items.create(
            {
                FeeID:f,
                Feename: n,
                Feecost: c,
            });
        }
        else
        {
            L_Items.create(
            {
                LID:f,
                Lname: n,
                Lcost: c,
            });
        }
        res.render("newitem",{x:0});
    }
});
//TO RECHARGE THE BALANCE OF THE STUDENT
app.get("/recharge",function(req,res){
    res.render("recharge",{x:0});
});
// ROUTE TO RECHARGE FORM PROCESS
app.post("/rechargebal",function(req,res)
{
    var b=req.body.Recharge;
    var r=req.body.RFIDno;
    if(r.length==0 || b.toString().length==0 || typeof(parseInt(b))=="string")
    {   
        res.render("recharge",{x:1});
    }
    else{
        Student.findOne({RFID:r},function(err,found)
        {
            if(err) console.log(err);
            else if(found==null) res.render("recharge",{x:1});
            else
            {
                var bal= found.Balance;
                bal = bal + parseInt(b);
                found.Balance=bal;
                found.save(function(err,data)
                {
                    if(err) console.log(err);
                    else res.render("recharge",{x:0});
                })
            }
        });
    }
});
//TO UPDATE THE ITEM DATA
app.get("/update_item_data",function(req,res){
    res.render("update_item_data",{x:0});
});
app.post("/update_it",function(req,res)
{
    var a = req.body.opt;
    var cost = req.body.cost;
    var item = req.body.item;
    var i = req.body.ID;
    if(cost.toString().length==0 || i.toString().length==0)
    {
        res.render("update_item_data",{x:1});
    }
    else{
        if(a=="update")
        {   
            if(item=="Fee_Dept")
            {
                Fee_Items.findOne({FeeID:i},function(err,foundItem)
                {
                    if(err) console.log(err);
                    else if(foundItem==null) res.render("update_item_data",{x:1});
                    else
                    {  
                        foundItem.Feecost = parseInt(cost) ;
                        foundItem.save(function(err,data)
                        {
                            if(err) console.log(err);
                        });
                        res.render("update_item_data",{x:0});
                    }
                }); 
            }
            else if(item=="Food")
            {
                Items.findOne({FID:i},function(err,foundItem)
                {
                    if(err) console.log(err);
                    else if(foundItem==null) res.render("update_item_data",{x:1});
                    else
                    {  
                        foundItem.Fcost = parseInt(cost);
                        foundItem.save(function(err,data)
                        {
                        if(err) console.log(err);
                        });
                        res.render("update_item_data",{x:0});
                    }
                }); 
            }
            else if(item=="Library")
            {
                L_Items.findOne({LID:i},function(err,foundItem)
                {
                    if(err) console.log(err);
                    else if(foundItem==null) res.render("update_item_data",{x:1});
                    else
                    {  
                        foundItem.Lcost= parseInt(cost);
                        foundItem.save(function(err,data)
                        {
                        if(err) console.log(err);
                        });
                        res.render("update_item_data",{x:0});
                    }
                }); 
            }
            else
            {
                C_Items.findOne({CID:i},function(err,foundItem)
                {
                    if(err) console.log(err);
                    else if(foundItem==null) res.render("update_item_data",{x:1});
                    else
                    {  
                        foundItem.Ccost= parseInt(cost);
                        foundItem.save(function(err,data)
                        {
                            if(err) console.log(err);
                        });
                        res.render("update_item_data",{x:0});
                    }
                }); 
            }
        }
        else
        {
            if(item=="Food")
            {
                Items.deleteOne({FID:i},function(err)
                {
                    if(err) console.log("Err in item update "+err);
                    else res.render("update_item_data",{x:0});
                });
            }
            else if(item=="Library")
            {
                L_Items.deleteOne({LID:i},function(err)
                {
                    if(err) console.log("Err in item update "+ err);
                    else res.render("update_item_data",{x:0});
                });
            }
            else if(item=="Fee_Dept")
            {
                Fee_Items.deleteOne({FeeID:i},function(err)
                {
                    if(err) console.log("Err in item update "+ err);
                    else res.render("update_item_data",{x:0});
                });
            }
            else
            {
                C_Items.deleteOne({CID:i},function(err)
                {
                    if(err) console.log("Err in item update "+ err);
                    else res.render("update_item_data",{x:0});
                });
            }
        }
        
}
});
//update student page
app.get("/update_student_data",function(req,res){
    res.render("update_student_data",{x:0});
    console.log("opt");
});
//STUDENT UPDATION PROCESS TAKES PLACE HERE
app.post("/update_stu",function(req,res)
{
    var r = req.body.RFID;
    var u = req.body.USN;
    var opt =req.body.opt;
    var item =req.body.item;
    var val = req.body.val;
    
    if(r.length==0 || u.length==0 || val.length==0){
        res.render("update_student_data",{x:1});
    }
    else{
        if(opt=="delete")
        {
            if(item=="new_USN")
            {
                Student.deleteOne({USN:u},function(err)
                {
                    if(err) console.log("Error in delete "+err);
                    else res.render("update_student_data",{x:2});
                });
            }
            else
            {
                Student.deleteOne({RFID:r}, function (err)
                {
                if(err) console.log("Error in delete "+err);
                else res.render("update_student_data",{x:2});
                });
            }
            // res.render("update_student_data",{x:1});
        }
        else
        {
            if(item=="new_Name")
            {
                Student.findOne({RFID:r},function(err,foundStudent)
                {
                    if(err) console.log(err);
                    else if(foundStudent==null) res.render("update_student_data",{x:1});
                    else
                    {
                        foundStudent.name=val;
                        foundStudent.save(function(err,data)
                        {
                            if(err) console.log(err);
                        });
                        res.render("update_student_data",{x:2});
                    }
                });
            }
            else if(item=="new_USN")
            {
                Student.findOne({RFID:r},function(err,foundStudent)
                {
                    if(err) console.log(err);
                    else if(foundStudent==null) res.render("update_student_data",{x:1});
                    else
                    {
                        foundStudent.USN=val;
                        foundStudent.save(function(err,data)
                        {
                            if(err) console.log(err);
                        });
                        res.render("update_student_data",{x:2});
                    }   
                });
            }
            else if(item=="new_RFID")
            {
                Student.findOne({USN:u},function(err,foundStudent)
                {
                    if(err) console.log(err);
                    else if(foundStudent==null) res.render("update_student_data",{x:1});
                    else
                    {
                        foundStudent.RFID=val;
                        foundStudent.save(function(err,data)
                        {
                            if(err) console.log(err);
                        });
                        res.render("update_student_data",{x:2});
                    }
                });
            }
            else if(item=="new_Course")
            {
                Student.findOne({RFID:r},function(err,foundStudent)
                {
                    if(err) console.log(err);
                    else if(foundStudent==null) res.render("update_student_data",{x:1});
                    else
                    {
                        foundStudent.Course=val;
                        foundStudent.save(function(err,data)
                        {
                            if(err) console.log(err);
                        });
                        res.render("update_student_data",{x:2});
                    }
                });
            }
            else
            {
                Student.findOne({RFID:r},function(err,foundStudent)
                {
                    if(err) console.log(err);
                    else if(foundStudent==null) res.render("update_student_data",{x:1});
                    else
                    {
                        foundStudent.DOB=val;
                        foundStudent.save(function(err,data)
                        {
                            if(err) console.log(err);
                        })
                    }
                });
            }
            
        }  
    } 
})
app.listen(9600,function(){
    console.log("Server start");
});