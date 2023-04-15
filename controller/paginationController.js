// import Teacher from '../models/teacherModel'

// module.exports.paginatedResults=async(req,res)=>{
//     try{
//         let model=null;
//         switch(req.query.model){
//             case 'teacher':
//                 model=Teacher
//                 break;
//             default:
//                 res.status(404).json({ status: false, message:"Not in proper syntax"})
//         }

//         let result=await Teacher.find();
//         console.log(result);
//         res.status(200).json({status:true,data:result})
        
//     } catch (err) {
//         res.status(404).json({ status: false, message: err.message });
//     }
// }