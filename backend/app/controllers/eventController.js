const Event=require("../models/EventModel")
const cloudinary=require("../config/cloudinaryConfig")
const fs=require("fs");
const { rejects } = require("assert");
const { resolve } = require("path");


class productController{

    // product page
    async eventPage(req,res){
        try{
            // res.send("Product created successfully");
            res.render("event",{
                title:"Event Page",
                user:req.user
            })
        }catch(err){
            console.log("Error in creating product", err);
        }
    }
    // ------------------------------------------------

    async createEvent(req,res){
        try{
            const{name,category, description,price,totalTickets, date, location}=req.body;

            const total = Number(totalTickets);

            const event=new Event({
                name,
                category,
                description,
                price: parseFloat(price), // Convert to number
                totalTickets: total,
                availableTickets: total,
                date: new Date(date),
                location,
                status: 'upcoming' // Default status

                
            
                
                
            })

         
        // ---------------------------------------------------
        //     multiple image upload
        //    if (req.files && req.files.length > 0) {
        //         product.image = req.files.map(file => file.filename);
        //     }
        // ---------------------------------------------------

        // ---------------------------------------------------

        // multiple image upload as url
        // if(req.files && req.files.length>0){
        //     product.image=req.files.map(file=>`/uploads/${file.filename}`);
        // }

// ---------------------------------------------------
        // cloudinary image upload

        // let imageUrls=[];

        // if(req.files && req.files.length>0){
        //     for(let file of req.files){
        //     const result= await cloudinary.uploader.upload(file.path,{
        //         folder:"products"
        //     })
        //     imageUrls.push(result.secure_url)

        //     // delete local file
        //   fs.unlinkSync(file.path);
        // }
        // }
        // const product=new Product({
        //         name,
        //         category,
        //         description,
        //         sizes,
        //         price,
        //         stock,
        //         image:imageUrls
        //     })

// ---------------------------------------------------





 // cloudinary multiple image upload with public ids

       if(req.files && req.files.length>0){
        const uploadResults= await Promise.all(
            req.files.map((file)=>{
                return new Promise((resolve,rejects)=>{
                    cloudinary.uploader.upload_stream(
                        {folder:"Events"},
                        (error,result)=>{
                            if(error){
                                rejects(error)
                            }else{
                                resolve(result)
                            }
                        }
                    ).end(file.buffer)
                })
            })
        )
        event.image=uploadResults.map(r=>r.secure_url)
        event.imageIds=uploadResults.map(r=>r.public_id)
       }
// ---------------------------------------------------
            console.log("Event",event);
           const data= await event.save();
           if (data){
            res.redirect("/getAllEvent");
           }

        }catch(error){
            console.log("error in creating Event",error);
            
        }
    }

    // all product----------------------------------------
    async getAllEvent(req,res){
        try{
            const events= await Event.find()

            // const events = await Event.find({ availableTickets: { $gt: 0 } }) // Only show events with tickets
            // .sort({ date: 1 });
            res.render("eventlist",{
                title:"Event List Page",
                data:events,
                user:req.user
            })

        }catch(error){
            console.log("error in getting Event",error);
        }
    }
    // single product-----------------------------------------
    async singleEvent(req,res){
        try{
            const id=req.params.id;
            const event= await Event.findById(id)
            res.render("singleEvent",{
                title:"Single Event Page",
                data:event,
                user:req.user
            })
        }catch(error){
            console.log("error in getting single Event",error);
        }
    }
    // edit product page-----------------------------------------
    // async editPage(req,res){
    //     try{
    //         res.render("editProduct",{
    //             title:"Edit Product Page",
    //         })
    //     }catch(error){
    //         console.log("error in getting edit product page",error);
    //     }
    // }
    // edit product-----------------------------------------

    async editEvent(req,res){
        try{
            const id=req.params.id;
            const event= await Event.findById(id)
            res.render("editEvent",{
                title:"Edit Event Page",
                data:event,
                user:req.user
            })
        }catch(error){
            console.log("error in getting edit Event",error);
        }
    }

    async updateEvent(req,res){
        try{
            const id=req.params.id;
            const{name,category, description,price,totalTickets, date, location}=req.body;
            const total = Number(totalTickets);
            
            const updatedData={
                name,
                category,
                description,
                price: parseFloat(price), // Convert to number
                totalTickets: total,
                availableTickets: total,
                date: new Date(date),
                location
               
               
            }
            if(req.files && req.files.length>0){
                const oldEvent=await Event.findById(id);

                if(oldEvent.imageIds && oldEvent.imageIds.length>0){
                    await cloudinary.api.delete_resources(oldEvent.imageIds)
                    console.log("old images deleted from cloudinary");
                }
                
                const uploadResults=await Promise.all(
                    req.files.map((file)=>{
                        return new Promise((resolve,rejects)=>{
                            cloudinary.uploader.upload_stream(
                                {folder:"Events"},
                                (error,result)=>{
                                    if(error){
                                        rejects(error)
                                    }else{
                                        resolve(result)
                                    }
                                }
                            ).end(file.buffer)
                        })
                    })
                )

                updatedData.image=uploadResults.map(r=>r.secure_url)
                updatedData.imageIds=uploadResults.map(r=>r.public_id)
            }
            await Event.findByIdAndUpdate(id,updatedData);
            res.redirect("/getAllEvent");

        }catch(error){
            console.log("error in updating Event",error);
        }
    }

    // delete product-----------------------------------------
    async deleteEvent(req,res){
        try{
            const id=req.params.id;
            const event=await Event.findById(id);

            if(event.imageIds && event.imageIds.length>0){
                await cloudinary.api.delete_resources(event.imageIds)
            }

            await Event.findByIdAndDelete(id);
            res.redirect("/getAllEvent");

        }catch(error){
            console.log("error in deleting Event",error);
        }
    }

   

}



module.exports= new productController()