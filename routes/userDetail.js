const router = require("express").Router()
const User = require('../models/users');
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.json({message:"you are not logged in"});
    }
}

// End point to get specific user with its username the users   
router.get("/userProfile/:username", isAuth, async (req, res) => {
    const userName=req.params.username;
    const specificUser=await User.find({username:userName});
    res.json(specificUser);
})

//end point to get all followers of the user
router.get("/userProfile/followers/:username",isAuth,async(req,res)=>{
    const userData=await User.find({username:req.params.username});
    const followerArray=await userData[0].followed;
    res.json(followerArray);
})

// End point for following a user
router.post("/userProfile/follow/request/:username",isAuth,async(req,res)=>{
    const userData=await User.find({username:req.params.username});
    const followerArray=await userData[0].followed;
    if(req.body!=null){
        followerArray.push(req.body);
        userData[0].followed=followerArray;
        try{
            const userData2=await userData[0].save();
            res.json(userData2);
        }catch(err){
            res.status(400).json({message:err});
        }
       
    }else{
        res.json({message:"no data please try again"});
    }
  
})

// End point for unfollowing a user
router.delete("/userProfile/unfollow/request/:username",isAuth,async(req,res)=>{
    const userData=await User.find({username:req.params.username});
    const followerArray=await userData[0].followed;
    if(req.body!=null){
        console.log(followerArray);
        const index=followerArray.findIndex((item)=>item.name===req.body.name);
        followerArray.splice(index,1);
       
        userData[0].followed=followerArray;
        try{
            const userData2=await userData[0].save();
            res.json(userData2);
        }catch(err){
            res.status(400).json({message:err});
        }
       
    }else{
        res.json({message:"no data please try again"});
    }
  
})



module.exports = router;