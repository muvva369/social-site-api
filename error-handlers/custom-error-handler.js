// middleware - custom error handler
const CustomErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Hadnling");
    // console.log(req)
    let errStatus = err.statusCode ?? 500
    res.status(errStatus).json({
        isSuccess: false,
        statusCode: errStatus,
        message: err.message || 'Something is not right...',
        path: req.url,
        method: req.method,
        stack: err.stack,
    })
    next();
}

module.exports = CustomErrorHandler