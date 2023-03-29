import db, { sequelize } from "../models/index";
const { Op } = require('sequelize');
import Sequelize from "sequelize";

const getAllDoctor = (limit = 0) => {
    return new Promise(async (resolve, reject) => {
        try {

            const users = await db.Doctor.findAll({
                include: [
                    { 
                        model: db.User, 
                        attributes: {
                            exclude: ['password','roleId',"createdAt", "updatedAt"]
                        },
                    },
                    {
                        model: db.Specialization
                    },
                    {
                        model: db.Clinic
                    }
                ],
                limit: limit,
                raw : true,
                nest: true,
                attributes: {
                    exclude: ['specializationId', 'clinicId']
                }
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getOneDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            const doctor = await db.Doctor.findOne({
                include: [
                    { 
                        model: db.User, 
                        attributes: {
                            exclude: ['password','roleId',"createdAt", "updatedAt"]
                        },
                    },
                    {
                        model: db.Specialization
                    },
                    {
                        model: db.Clinic
                    }
                ],
                where: {id: id},
                raw : true,
                nest: true,
                attributes: {
                    exclude: ['specializationId', 'clinicId']
                }
            })

            resolve({
                errCode: 0,
                data: doctor
            })
        } catch (e) {
            reject(e);
        }
    })
}

const createSchedule = async (doctorId, workingDay, hour, maxPatients, price) => {
    return new Promise(async (resolve, reject) => {
        try {

            const doctor = await db.Doctor.findOne({
                include: [
                    {
                        model: db.User,
                        where: {
                            id: doctorId,
                        }
                    }
                ],
                raw: true,
                nest: true,
            })
            console.log('doctor', doctor);

            if (doctor) {
                await db.Schedule.create({
                    doctorId: doctor.id,
                    workingDay: workingDay ?? '',
                    hour: hour ?? '',
                    currentPatients: 0,
                    maxPatients: maxPatients ?? 0,
                    price: price ?? 0,
                })
            }

            resolve({
                errCode: 0,
                message: "Tạo lịch khám thành công",
            })
        } catch (e) {
            reject(e)
        }
    }) 
}

const getAllSchedule = ( doctorId) => {
    return new Promise(async (resolve, reject) => {
        console.log(doctorId);

        try {

            const schedule = await db.Schedule.findAll({
                include: [{
                    model: db.Doctor,
                    include: [
                        {
                            model: db.User,
                            where: {
                                id: doctorId,
                            } 
                        }
                    ],
                }],
                raw: true,
                nest: true,
                attributes: {
                    exclude: ['doctorId']
                }
            })

            resolve({
                errCode: 0,
                data: schedule
            })
        } catch (e) {
            reject(e);
        }
    })
}

const deleteSchedule = (doctorId, scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctor = await db.Doctor.findOne({
                where: {id: doctorId}
            })  

            if (!doctor) {
                resolve({
                    errCode: 2,
                    errMessage: "Bác sĩ không tồn tại trong hệ thống",
                })
            } else {
                const schedule = await db.Schedule.findOne({
                    where: {id: scheduleId}
                })

                if (schedule) {
                    await schedule.destroy();
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Không tồn tại lịch khám trong hệ thống"
                    })
                }

            }

            resolve({
                errCode: 0,
                message: 'Xóa lịch khám thành công',
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getDoctorBooking = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const doctor = await db.Doctor.findOne({
                include: [{
                    model: db.User,
                    where: { id: userId }
                }],
                raw: true,
                nest: true
            })
            
            if (!doctor) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy id bác sĩ"
                })
            } 

            const booking = await db.Booking.findAll({
                include: [
                {
                    model: db.Patient,
                    include: [{
                        model: db.User,
                        attributes: ['name', 'phoneNumber']
                    }],
                    attributes: ['pastMedicalHistory']
                },
                {
                    model: db.Schedule,
                    where: { doctorId: doctor.id },
                    attributes: ['workingDay', 'hour']
                }
                ],
                raw : true,
                nest: true, 
                attributes: {
                    exclude: ['patientId', 'scheduleId', 'createdAt', 'updatedAt', 'User']
                }
            })

            resolve({
                errCode: 0,
                data: booking,
            })
        } catch (e) {
            reject(e)
        }
    }) 
}

const updateExaminationStatus = (bookingId) => {
    return new Promise(async (resolve, reject) => {

        try {
            const examinedBooking = await db.Booking.findOne({
                where: { id: bookingId },
                attributes: ['id', 'status']
            })

            if (examinedBooking) {
                try {
                    if (examinedBooking.status !== "Đã khám") {
                        await db.Booking.update(
                            {
                                status: "Đã khám",
                            },
                            {
                                where: { id: bookingId },
                            },
                        )
                    } else {
                        resolve({
                            errCode: 1,
                            message: "Đơn khám bệnh đã khám xong!"
                        })
                    }
                } catch (err) {
                    resolve({
                        errCode: 1,
                        message: "Chuyển trạng thái đơn khám bệnh thất bại!" + err
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    message: "Không thể tìm thấy đơn khám bệnh!"
                })
            }

            resolve({
                errCode: 0,
                data: examinedBooking,
                message: "Cập nhật thành công trạng thái đã khám!"
            })
        } catch (e) {
            reject(e);
        }
    })
}

const setAnotherBooking = (bookingId) => {
    return new Promise(async (resolve, reject) => {

        try {

            const currentBooking = await db.Booking.findOne({
                where: { id: bookingId },
            })

            const currentSchedule = await db.Schedule.findOne({
                where: { id: currentBooking.scheduleId }
            })

            if (currentSchedule) {

                const nearestSchedule = await db.Schedule.findOne({
                    where: { 
                        workingDay: { [Op.gt]: currentSchedule.workingDay },
                        doctorId: currentSchedule.doctorId,
                        currentPatients: { [Op.lt]: Sequelize.col('maxPatients') } ,
                    },
                    order: [
                        [Sequelize.fn('UNIX_TIMESTAMP', Sequelize.col('workingDay')), 'ASC']
                    ]
                })

                if (nearestSchedule) {
                    const newBooking = await db.Booking.update(
                        { scheduleId: nearestSchedule.id },
                        { where: {id: bookingId} }
                    )
                    
                    resolve({
                        errCode: 0,
                        data: newBooking,
                        message: "Cập nhật thành công trạng thái đã khám!"
                    })

                } else {
                    resolve({
                        errCode: 1,
                        message: "Không còn lịch hẹn trống!"
                    })
                }
            
            }

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getAllDoctor,
    getOneDoctor,
    createSchedule,
    getAllSchedule,
    deleteSchedule,
    getDoctorBooking,
    updateExaminationStatus,
    setAnotherBooking,
}