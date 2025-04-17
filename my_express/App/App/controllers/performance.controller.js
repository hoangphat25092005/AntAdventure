//performance controller
const performance = require('../model/performance.model');

//get all performance data
const getAllPerformanceData = async (req, res) => {
    try {
        const performanceData = await performance.find();
        res.status(200).json(performanceData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get performance data by id
const getPerformanceDataById = async (req, res) => {
    try {
        const performanceData = await performance.findById(req.params.id);
        if (!performanceData) {
            return res.status(404).json({message: "Performance data not found"});
        }
        res.status(200).json(performanceData);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


//export all the functions
module.exports = {
    getAllPerformanceData,
    getPerformanceDataById
}