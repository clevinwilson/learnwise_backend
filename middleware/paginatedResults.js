const Teacher = require('../models/teacherModel')


function paginatedResults() {
    return async (req, res, next) => {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;


        //matching the model
        let model = null;
        switch (req.query.model) {
            case 'teacher':
                model = Teacher
                break;
            default:
                res.status(404).json({ status: false, message: "Not in proper syntax" });
        }


        if (model) {
            const modelCount = await Teacher.find().count();
            results = {};

            //next page
            if (endIndex < modelCount) {
                results.next = {
                    page: page + 1,
                    limit: limit
                }
            }

            //previous page
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                }
            }

            //if both false
            if (endIndex > modelCount) {
                results.limit = modelCount;
            } else {
                results.limit = endIndex;
            }

            //result 
            results.current = parseInt(req.query.page);
            results.count = modelCount;
            results.endIndex = endIndex;
            results.startIndex = startIndex;

            req.paginatedResults = results;
            next();
        }

    }
}

module.exports = paginatedResults;