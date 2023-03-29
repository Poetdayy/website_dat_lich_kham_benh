import doctorService from "../services/doctorService";

const getAllDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        const topDoctors = await doctorService.getAllDoctor(limit);
        return res.status(200).json(topDoctors);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const getOneDoctor = async (req, res) => {
    const id = req.query.id;
    try {
        const doctor = await doctorService.getOneDoctor(id);
        return res.status(200).json(doctor);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const createSchedule = async (req, res) => {
    
    const {doctorId, workingDay, hour, maxNumberPatients, price } = req.body;
    
    if (!workingDay || !maxNumberPatients || !hour || !price) {
        return res.status(400).json({
            message: "Bạn phải chọn toàn bộ thông tin để tạo được lịch khám!"
        })
    }

    try {
        const schedule = await doctorService.createSchedule(doctorId, workingDay, hour, maxNumberPatients, price);
        return res.status(200).json(schedule);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const getAllSchedule = async (req, res) => {
    const doctorId = req.query.id;
    
    if (!doctorId) {
        return res.status(400).json({
            message: "Thiếu tham số id!"
        })
    }

    try {
        const schedule = await doctorService.getAllSchedule(doctorId);
        return res.status(200).json(schedule);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const getDoctorBooking = async (req, res) => {
    const id = req.query.id;
    try {
        const booking = await doctorService.getDoctorBooking(id);
        return res.status(200).json(booking);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const updateExaminationStatus = async (req, res) => {
    const bookingId = req.body.bookingId;

    if (!bookingId) {
        return res.status(500).json({
            errCode: -1,
            message: "Missing Params"
        })
    }

    try {
        const booking = await doctorService.updateExaminationStatus(bookingId);
        return res.status(200).json(booking);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}


const setAnotherBooking = async (req, res) => {
    const bookingId = req.body.bookingId;

    if (!bookingId) {
        return res.status(500).json({
            errCode: -1,
            message: "Missing Params"
        })
    }

    try {
        const booking = await doctorService.setAnotherBooking(bookingId);
        return res.status(200).json(booking);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

module.exports = {
    getAllDoctor,
    getOneDoctor,
    createSchedule,
    getAllSchedule,
    getDoctorBooking,
    updateExaminationStatus,
    setAnotherBooking
}