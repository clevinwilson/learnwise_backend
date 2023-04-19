const Order =require('../models/orderModel')
module.exports.checkUserEnrolledCourse=async(req,res,next)=>{
    try{
        let enrolled = await Order.findOne({ user: req.userId, course :req.params.courseId,status:true});
        if(enrolled){
            next();
        }else{
            throw new Error("Access denied");
        }
    } catch (err) {
        res.status(500).json({ status: false, err: err.message })
    }
}