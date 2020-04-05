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


mongoose.connect("mongodb://localhost/student",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Home page
app.get("/",function(req,res){
    res.render("home");
});

// New Student form page
app.get("/newstudent",function(req,res){
    res.render("newstudent");
});

//New transaction form page
app.get("/newtransaction",function(req,res){
    res.render("newtransaction");
});

//new transaction post
app.post("/newt",function(req,res){
    var it=req.body.item;
    var i=req.body.ID;
    var t=req.body.Time;
    var q=req.body.quantity;
    var r=req.body.RFID;
    var totalcost;
    console.log(it);
    if(it=="Food"){
    Items.findOne({FID:i},function (err,foundItem){
        totalcost=foundItem.Fcost * q;
        Student.findOne({RFID:r},function(err,foundUser){
            var bal=foundUser.Balance;
            if(bal-totalcost<50){
                res.render("low");
            }
            else {  foundUser.Balance = bal-totalcost;
                foundUser.save(function(err,data){
                if(err) console.log(err);
                else 
                res.redirect("newtransaction");
            })
                }
        });
     });
     
}   else if(it=="Library"){
    L_Items.findOne({LID:i},function (err,foundItem){
        totalcost=foundItem.Lcost * q;
        Student.findOne({RFID:r},function(err,foundUser){
            var bal=foundUser.Balance;
            if(bal-totalcost<50){
                res.render("low");
            }
            else {  foundUser.Balance = bal-totalcost;
                foundUser.save(function(err,data){
                if(err) console.log(err);
                else 
                res.redirect("newtransaction");
            })
                }
        });
     });
    }
    else if(it=="Fee_Dept"){
     Fee_Items.findOne({FeeID:i},function (err,foundItem){
        totalcost=foundItem.Feecost * q;
        Student.findOne({RFID:r},function(err,foundUser){
            var bal=foundUser.Balance;
            if(bal-totalcost<50){
                res.render("low");
            }
            else {  foundUser.Balance = bal-totalcost;
                foundUser.save(function(err,data){
                if(err) console.log(err);
               else res.redirect("newtransaction");
            })
                }
        });
     });
    }
    else{
     C_Items.findOne({CID:i},function (err,foundItem){
        totalcost=foundItem.Ccost * q;
        Student.findOne({RFID:r},function(err,foundUser){
            var bal=foundUser.Balance;
            if(bal-totalcost<50){
                res.render("low");
            }
            else {  foundUser.Balance = bal-totalcost;
                    foundUser.save(function(err,data){
                    if(err) console.log(err);
                    else res.redirect("newtransaction");
                })
                    }
        });
     });
    }it=req.body.item;
//create new transaction 
    Transactions.create({
    quantity: q,    
    Time:t,
    ID:i,
    Category:it,
},function(err,post){
    //link the new transation to the student using his or her rfid
Student.findOne({RFID:r},function a (err,foundUser){
    if(err) console.log("Student not found");
    else {
        foundUser.transactions.push(post);
        foundUser.save(function(err,data){
            if(err) console.log(err);
            
        })
    }
})
});
//link the item bought by the student for the above transaction
if(it=="Library"){
    L_Items.findOne({LID:i},function(err,foundItem){
        if(err) console.log(err);
        else {  var post=foundItem._id;
                Transactions.findOne({Time:t,Category:it},function(err,foundUser){
                if(err) console.log(err);
                else {
                        foundUser.items.push(post);
                        foundUser.save(function(err,data){
                        if(err) console.log(err);
                        else{
                            console.log(data);
                            // res.redirect("newtransaction");
                        }
                    })
                }
            })
        
        }
    }); 
}
else if(it=="Food"){
    
    Items.findOne({FID:i},function(err,foundItem){
        if(err) console.log(err);
        else {
        
            var post=foundItem._id;
            //push the object id of the item to the transaction
            Transactions.findOne({Time:t,Category:it},function(err,foundUser){
                if(err) console.log(err);
                else {
                    
                    foundUser.items.push(post);
                    foundUser.save(function(err,data){
                        if(err) console.log(err);
                        else{
                            console.log(data);
                            
                            // res.redirect("newtransaction");
                        }
                    })
                }
            })
        
        }
    }); 
}   
 
else if(it=="Fee_Dept"){
    Fee_Items.findOne({FeeID:i},function(err,foundItem){
        if(err) console.log(err);
        else {  var post=foundItem._id;
                Transactions.findOne({Time:t,Category:it},function(err,foundUser){
                if(err) console.log("Error");
                else {
                        foundUser.items.push(post);
                        foundUser.save(function(err,data){
                        if(err) console.log(err);
                        else{
                            console.log(data);
                            // res.redirect("newtransaction");
                        }
                    })
                }
            })
        
        }
    }); 
}
else {
    C_Items.findOne({CID:i},function(err,foundItem){
        if(err) console.log(err);
        else {  var post=foundItem._id;
                Transactions.findOne({Time:t,Category:it},function(err,foundUser){
                if(err) console.log(err);
                else {
                        foundUser.items.push(post);
                        foundUser.save(function(err,data){
                        if(err) console.log(err);
                        else{
                                console.log(data);
                                // res.redirect("newtransaction");
                            }
                    })
                }
            })
        
        }
    }); 
} 

    
    // res.render("bill",{q:q,food:food,t:t,cost:cost});
});//END OF TRANSACTION PAGE


//save details of the new student
app.post("/new",function(req,res){
    
    var n=req.body.sname;
    var r=req.body.RFID;
    var d=req.body.DOB;
    var c=req.body.Course;
    var u=req.body.USN;
    Student.create({
    RFID:r,
    name: n,
    USN: u,
    Course: c,
    DOB:d,
    Balance:100,
},function(err,data){
    if(err) { console.log(err);
        res.redirect("newstudent");
    }
    else {
        console.log("ok");
        res.redirect("newstudent");
    }
});
});
//form page for new item to be added
app.get("/newitem",function(req,res){
    res.render("newitem");
});
//post to new item
app.post("/newItem",function(req,res){
    
    var n=req.body.Iname;
    var f=req.body.ID;
    var c=req.body.cost;
if(req.body.item=="Food"){
    Items.create({
        FID:f,
        Fname: n,
        Fcost: c,
});
}
else if(req.body.item=="Conveno"){
    C_Items.create({
        CID:f,
        Cname: n,
        Ccost: c,
});
}
else if(req.body.item=="Fee_Dept"){
    Fee_Items.create({
        FeeID:f,
        Feename: n,
        Feecost: c,
});
}
else{
    L_Items.create({
        LID:f,
        Lname: n,
        Lcost: c,
});
}
res.redirect("newitem");

});
app.get("/recharge",function(req,res){
    res.render("recharge");
});
app.post("/rechargebal",function(req,res){
    var b=req.body.Recharge;
    var r=req.body.RFIDno;
    Student.findOne({RFID:r},function(err,found){
        if(err) console.log(err);
        else{
            var bal= found.Balance;
            bal = bal + parseInt(b);
            found.Balance=bal;
            console.log(typeof(found.Balance));
            found.save(function(err,data)
            {
                if(err) console.log(err);
                else res.redirect("recharge");

            })
            }


    });
});
app.get("/update_item_data",function(req,res){
    res.render("update_item_data");
})
app.post("/update_it",function(req,res){
    var a = req.body.opt;
    var cost = req.body.cost;
    var item = req.body.item;
    var i=req.body.ID;
    console.log(item);
    if(item=="Fee_Dept"){
    Fee_Items.findOne({FeeID:i},function(err,foundItem){
        if(err) console.log(err);
        else {  
       foundItem.Feecost = parseInt(cost) ;
       foundItem.save(function(err,data){
           if(err) console.log(err);
       });
        }
    }); 
}
else if(item=="Food"){
    Items.findOne({FID:i},function(err,foundItem){
        if(err) console.log(err);
        else {  
            console.log(cost);
            console.log("1"+foundItem.Fcost);
        foundItem.Fcost = parseInt(cost);
        foundItem.save(function(err,data){
            if(err) console.log(err);
        });
        console.log("2"+foundItem.Fcost);
        }
    }); 
}
else if(item=="Library"){
    L_Items.findOne({LID:i},function(err,foundItem){
        if(err) console.log(err);
        else {  
        foundItem.Lcost= parseInt(cost);
        foundItem.save(function(err,data){
            if(err) console.log(err);
        });
        }
    }); 
}
else{
    C_Items.findOne({CID:i},function(err,foundItem){
        if(err) console.log(err);
        else {  
        foundItem.Ccost= parseInt(cost);
        foundItem.save(function(err,data){
            if(err) console.log(err);
        });
        }
    }); 
}


res.redirect("/update_item_data");
});
app.get("/update_student_data",function(req,res){
    res.render("update_student_data");
});
app.post("/update_stu",function(req,res){
    var r = req.body.RFID;
    var u = req.body.USN;
    var opt =req.body.opt;
    var item =req.body.item;
    var val = req.body.val;
    console.log(val);
    if(opt=="delete"){
            console.log("To be done");
    }
    else{
        if(item=="new_Name"){
            Student.findOne({RFID:r},function(err,foundStudent){
                if(err) console.log(err);
                foundStudent.name=val;
                foundStudent.save(function(err,data){
                    if(err) console.log(err);
                })
            });
        }
        else if(item=="new_USN"){
            Student.findOne({RFID:r},function(err,foundStudent){
                if(err) console.log(err);
                foundStudent.USN=val;
                foundStudent.save(function(err,data){
                    if(err) console.log(err);
                })
            });
        }
        else if(item=="new_RFID"){
            Student.findOne({USN:u},function(err,foundStudent){
                if(err) console.log(err);
                foundStudent.RFID=val;
                foundStudent.save(function(err,data){
                    if(err) console.log(err);
                })
            });
        }
        else if(item=="new_Course"){
            Student.findOne({RFID:r},function(err,foundStudent){
                if(err) console.log(err);
                foundStudent.Course=val;
                foundStudent.save(function(err,data){
                    if(err) console.log(err);
                })
            });
        }
        else{
            Student.findOne({RFID:r},function(err,foundStudent){
                if(err) console.log(err);
                foundStudent.DOB=val;
                foundStudent.save(function(err,data){
                    if(err) console.log(err);
                })
            });
        }
    }   res.redirect("update_student_data");
});

app.listen(9600,function(){
    console.log("Server start");
});