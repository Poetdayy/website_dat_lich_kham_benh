import express from "express";
import {
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
} from "../controller/userController";
import {
    getAllDoctor,
    getOneDoctor,
    createSchedule,
    getAllSchedule,
    getDoctorBooking,
    updateExaminationStatus,
    setAnotherBooking
} from "../controller/doctorController";
import {
    createBooking,
    getBooking,
    deleteBooking,
} from "../controller/patientController";
import {
    getAllBookings,
    getAllSchedules,
    getAllPatients
} from "../controller/adminController";
import middlewareController from "../middleware/auth";


const router = express.Router();

const initWebRoutes = (app) => {

    router.get('/api/get-all-users', middlewareController.verifyToken, handleGetAllUsers);
    router.post('/api/login', handleLogin);
    router.post('/api/create-user', handleCreateUser);
    router.delete('/api/delete-user', middlewareController.verifyTokenAdminAuth, handleDeleteUser);
    router.put('/api/update-user', handleUpdateUser);
    router.get('/api/get-all-doctor', getAllDoctor);
    router.get('/api/get-one-doctor', getOneDoctor);
    router.post('/api/create-schedule', middlewareController.verifyTokenDoctorAuth, createSchedule);
    router.get('/api/get-all-schedule', getAllSchedule);
    router.post('/api/create-booking', createBooking);
    router.get('/api/get-booking', getBooking);
    router.delete('/api/delete-booking', deleteBooking);
    router.get('/api/get-doctor-booking', middlewareController.verifyTokenDoctorAuth, getDoctorBooking);
    router.post('/api/update-status-examination', middlewareController.verifyTokenDoctorAuth, updateExaminationStatus);
    router.post('/api/set-another-booking', middlewareController.verifyTokenDoctorAuth, setAnotherBooking);
    router.get('/api/search-doctor', searchDoctor);
    router.get('/api/search-all-of-doctor', searchAllOfDoctor)
    router.get('/api/get-all-clinics', getAllClinics);
    router.get('/api/get-all-specializations', getAllSpecializations);
    router.get('/api/get-all-schedules', getAllSchedules);
    router.get('/api/get-all-bookings', getAllBookings);
    router.get('/api/get-all-patients', getAllPatients);
    router.get('/api/get-detail-clinic', getDetailClinic);

    
    return app.use("/", router)
}

module.exports = initWebRoutes;