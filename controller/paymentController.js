const { response } = require('express');
const { now } = require('mongoose');
const Stripe = require('stripe');
const courseSchema = require('../models/courseModel');
const stripe = Stripe(process.env.SECRET_KEY);
const orderSchema = require('../models/orderModel');
const userSchema = require('../models/userModel');



const doPayment = async (req, res) => {
    console.log(req.userId);
    try {
        const user=await userSchema.findById({_id:req.userId});
        if(user.status){
        const course = await courseSchema.findById({ _id: req.body.courseId });
        if (course) {
            const newOrder = new orderSchema({
                total: course.price,
                course: req.body.courseId,
                user: req.userId,
                teacher: course.teacher,
                address: { line1: req.body.address, pincode: req.body.pincode },
                purchase_date: Date.now(),
            })
            newOrder.save().then(async (orderResponse) => {
                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            currency: "inr",
                            name: course.name,
                            images: [`${process.env.BASE_URL + course.image.path}`],
                            amount: course.price * 100,
                            quantity: 1,

                        }
                    ],
                    mode: 'payment',
                    customer_email:user.email,
                    success_url: `${process.env.BASE_URL}/verifyPayment/${orderResponse._id}`,
                    cancel_url: `${process.env.BASE_URL}/cancel-payment/${orderResponse._id}`,
                });
                res.json({ url: session.url })
            }).catch((err) => {
                // res.status(500).json({ status: false, message: "Internal server error" });
                res.redirect(`${process.env.CLIENT_URL}/course-payment/${courseId}`);
            })

        } else {
            // res.status(404).json({ status: false, message: "Course Not exits" });
            res.redirect(`${process.env.CLIENT_URL}/course-payment/${courseId}`);

        }
    }

    } catch (err) {
        // res.status(500).json({ status: false, message: "Internal server error" });
        res.redirect(`${process.env.CLIENT_URL}/course-payment/${courseId}`);
    }
}


const verifyPayment = async (req, res) => {
    try {
        const order = await orderSchema.findById({ _id: req.params.orderId });
        if (order) {
            orderSchema.findByIdAndUpdate({ _id: req.params.orderId },{
                $set:{
                    status:true
                }
            }).then((response)=>{
                // res.status(500).json({ status:true, message: "Order Success" });
                res.redirect(`${process.env.CLIENT_URL}/order-success`);

            }).catch((err)=>{
                console.log(err);
            })
        } else {
            res.redirect(`${process.env.CLIENT_URL}/course-payment/${order.courseId}`);
        }
    } catch (err) {
        res.redirect(`${process.env.CLIENT_URL}/course-payment/${order.courseId}`);


    }
}

const cancelOrder=(req,res)=>{
    try{
        orderSchema.findByIdAndDelete({ _id: req.params.orderId }).then((response)=>{
            console.log(response);
            if(response){
                res.redirect(`${process.env.CLIENT_URL}/order-failed`);

                // res.redirect(`${process.env.CLIENT_URL}/course-payment/${response.course}`);
            }else{
                res.redirect(`${process.env.CLIENT_URL}/order-failed`);

                // res.redirect(`${process.env.CLIENT_URL}/course-payment/${response.course}`);
            }
        })
    }catch(err){
        res.redirect(`${process.env.CLIENT_URL}/course-payment/${response.course}`);
    }
}

module.exports = { doPayment, verifyPayment, cancelOrder }
