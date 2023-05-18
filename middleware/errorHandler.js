// ErrorHandler
const errorHandler = (err, req, res, next) => {
    console.log("Middleware Error Handling -- ", err);
    // assigning a 500 status if no err status 
    const errStatus = err.statusCode || 500;
    // assigning a message if no err message
    const errMsg = err.message || "Something went wrong";
    // sending response 
    res.status(errStatus).json({
        status: false,
        message: errMsg,
    });
};

module.exports = errorHandler;
