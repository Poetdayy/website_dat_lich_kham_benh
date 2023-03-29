import patientService from "../services/patientService";


const getAllPatients = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        const topPatients = await patientService.getAllPatients(limit);
        return res.status(200).json(topPatients);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const createBooking = async (req, res) => {
    
    const { workingDay, hour, medicalReason, patientId } = req.body;
    console.log(req.body);
    
    if (!workingDay || !hour || !medicalReason || !patientId) {
        return res.status(400).json({
            message: "Bạn phải điền đủ toàn bộ thông tin để đặt được lịch khám!"
        })
    }

    if (medicalReason === '') {
        resolve({
            errCode: 1,
            message: "Vui lòng nhập vào lí do khám bệnh!"
        })
    }                

    try {
        const booking = await patientService.createBooking(workingDay, hour, patientId, medicalReason);
        return res.status(200).json(booking);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const getBooking = async (req, res) => {
    const id = req.query.id;
    console.log({id});
    try {
        const booking = await patientService.getBooking(id);
        return res.status(200).json(booking);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const deleteBooking = async (req, res) => {

    console.log(req.body.id);

    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Thiếu tham số truyền vào",
        })
    }

    const message = await patientService.deleteBooking(req.body.id);
    return res.status(200).json(message);
    
}

module.exports = {
    getAllPatients,
    createBooking,
    getBooking,
    deleteBooking,
}