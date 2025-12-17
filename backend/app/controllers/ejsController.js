class ejsController{
     async home(req,res){
        try{
            // res.send("Product created successfully");
            res.render("home",{
                title:"Home Page",
                user:req.user
            })
            

        }catch(err){
            console.log("Error in creating product", err);
        }
    }

    
}

module.exports=new ejsController()