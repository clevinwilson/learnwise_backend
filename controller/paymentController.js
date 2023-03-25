const { response } = require('express');
const { now } = require('mongoose');
const Stripe = require('stripe');
const courseSchema = require('../models/courseModel');
const stripe = Stripe(process.env.SECRET_KEY);
const orderSchema = require('../models/orderModel')



const doPayment = async (req, res) => {
    try {
        const course = await courseSchema.findById({ _id: req.body.courseId });;
        if (course) {
            const newOrder = new orderSchema({
                total: course.price,
                courseId: req.body.courseId,
                userId: "63f2eeb484592647fe3d5aba",
                teacherId: course.teacher,
                address: { line1: req.body.address, pincode: req.body.pincode },
                purchase_date: Date.now(),
            })
            newOrder.save().then(async (orderResponse) => {
                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            currency: "inr",
                            name: course.name,
                             images: ["https://img-b.udemycdn.com/course/240x135/2995336_69f0.jpg"],
                            amount: course.price * 100,
                            quantity: 1,

                        }
                    ],
                    mode: 'payment',
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
                res.redirect(`${process.env.CLIENT_URL}/course-payment/${response.courseId}`);
            }else{
                res.redirect(`${process.env.CLIENT_URL}/course-payment/${response.courseId}`);
            }
        })
    }catch(err){
        res.redirect(`${process.env.CLIENT_URL}/course-payment/${response.courseId}`);
    }
}

module.exports = { doPayment, verifyPayment, cancelOrder }
