import userService from "../services/userService";
import doctorService from "../services/doctorService";

const handleLogin = async (req, res) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
        return res.status(500).json({
            errorCode: 1,
            message: 'Missing inputs params',
        })
    }

    const userData = await userService.handleUserLogin(phoneNumber, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        data: userData.user ? userData.user : {},
    })
}

const handleGetAllUsers = async (req, res) => {
    const id = req.body.id; 

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter',
            users: [],
        })
    }

    const users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users,
    })
}

const handleCreateUser = async (req, res) => {
    const message = await userService.createUser(req.body);
    console.log("ok");
    return res.status(200).json(message);
}

const handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter",
        })
    }

    const message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
    
}

const handleUpdateUser = async (req, res) => {
    const data = req.body;
    const message = await userService.updateUserData(data);
    return res.status(200).json(message);
}

const searchDoctor = async (req, res) => {
    const { query, type } = req.query;
    
    if (!query) {
        return res.status(400).json({
            message: "Không tìm thấy kết quả"
        })
    }

    try {
        let result = await userService.searchDoctor(query, type);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const searchAllOfDoctor = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        const doctors = await doctorService.getAllDoctor();
        console.log(doctors);

        return res.status(200).json(doctors);
    }

    try {
        let result = await userService.searchAllOfDoctor(query);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const getAllClinics = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        const clinics = await userService.getAllClinics(limit);
        return res.status(200).json(clinics);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const getAllSpecializations = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 40;
    }
    try {
        const specializations = await userService.getAllSpecializations(limit);
        return res.status(200).json(specializations);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}

const getDetailClinic = async (req, res) => {
    const id = req.query.id;
    try {
        const doctor = await userService.getDetailClinic(id);
        return res.status(200).json(doctor);
    } catch (err) {
        return res.status(400).json({
            errCode: -1,
            message: "Error from server" + err,
        })
    }
}



module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateUser,
    handleDeleteUser,
    handleUpdateUser,
    searchDoctor,
    searchAllOfDoctor,
    getAllClinics,
    getAllSpecializations,
    getDetailClinic
}