import db from "../models/index";
const Sequelize = require('sequelize');

const getAllPatients = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                where: { roleId: '2' },
                limit: limit,
                attributes: {
                    exclude: ['password','roleId',"createdAt", "updatedAt"]
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

const createBooking = async (workingDay, hour, userId, medicalReason) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log(medicalReason);
            const patient = await db.Patient.findOne({
                include: [{
                    model: db.User,
                    where: { id: userId }
                }],
                raw : true,
                nest: true,
            })

            const schedule = await db.Schedule.findOne({
                where: { workingDay: workingDay, hour: hour }
            })

            if (patient && schedule) {

                await db.Booking.create({
                    scheduleId: schedule.id,
                    patientId: patient.id,
                    status: 'Chờ khám',
                    medicalReason: medicalReason ?? '',
                })

                await db.Schedule.update(
                    { currentPatients: Sequelize.literal('currentPatients + 1') },
                    { where: {id: schedule.id} }
                )
            } else {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy bệnh nhân hoặc lịch khám"
                })
            }

            resolve({
                errCode: 0,
                message: "Đặt lịch hẹn thành công!",
            })
        } catch (e) {
            reject(e)
        }
    }) 
}

const deleteBooking = async (bookingId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const booking = await db.Booking.findOne({
                where: { id: bookingId }
            })

            if (booking) {

                if (booking.status === "Chờ khám") {
                    await db.Booking.destroy(
                        { where: { id: booking.id }}
                    )
                } else {
                    resolve({
                        errCode: 1,
                        message: "Không thể xóa lịch khám"
                    })
                }


            } else {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy lịch khám cần xóa"
                })
            }

            resolve({
                errCode: 0,
                message: "Xóa lịch hẹn thành công!",
            })
        } catch (e) {
            reject(e)
        }
    }) 
}

const getBooking = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log('1', userId);
            const patient = await db.Patient.findOne({
                include: [{
                    model: db.User,
                    where: { id: userId }
                }],
                raw: true,
                nest: true
            })
            
            if (!patient) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy id bệnh nhân"
                })
            } 

            const booking = await db.Booking.findAll({
                include: [{
                    model: db.Patient,
                    where: { id: patient.id },
                    attributes: {
                        exclude: ['id','userId', 'pastMedicalHistory', "createdAt", "updatedAt"]
                    }
                },
                {
                    model: db.Schedule,
                    include: [{
                        model: db.Doctor,
                        include: [{ model: db.User }]
                    }]
                }
                ],
                raw : true,
                nest: true, 
                attributes: {
                    exclude: ['patientId', 'scheduleId', 'createdAt', 'updatedAt']
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

module.exports = {
    getAllPatients,
    createBooking,
    deleteBooking,
    getBooking,
}