import adminService from "../services/adminService";


const getAllBookings = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        const bookings = await adminService.getAllBookings(limit);
        return res.status(200).json(bookings);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}


const getAllSchedules = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        const schedules = await adminService.getAllSchedules(limit);
        return res.status(200).json(schedules);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const getAllPatients = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        const patients = await adminService.getAllPatients(limit);
        return res.status(200).json(patients);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

module.exports = {
    getAllBookings,
    getAllSchedules,
    getAllPatients
}

