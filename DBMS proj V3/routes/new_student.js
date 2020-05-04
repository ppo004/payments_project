var express = require("express");
var router  = express.Router();
var Student = require("../models/studen");
var middleware = require("../middleware");
router.get("/",middleware.isLoggedIn,function(req,res){
    res.render("newstudent",{x:2});
});

//NEW STUDENT POST PROCESSING TAKES PLACE HERE
router.post("/",function(req,res)
{
    var n=req.body.sname;
    var r=req.body.RFID;
    var d=req.body.DOB;
    var c=req.body.Course;
    var u=req.body.USN;
    var p=parseInt(req.body.PhoneNo);
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
                PhoneNo:p,
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
module.exports = router;