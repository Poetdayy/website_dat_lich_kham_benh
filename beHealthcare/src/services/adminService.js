import db from "../models/index";

const getAllSchedules = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {

            const schedules = await db.Schedule.findAll({
                include: [
                    {
                        model: db.Doctor,
                        include: [{
                            model: db.User,
                            attributes: ['name', 'phoneNumber']
                        }],
                    },
                ],
                raw: true,
                nest: true,
                limit: limit,
            })

            resolve({
                errCode: 0,
                data: schedules
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getAllBookings = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {

            const bookings = await db.Booking.findAll({
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
                    include: [
                        {
                            model: db.Doctor,
                            include: [{
                                model: db.User,
                                attributes: ['name', 'phoneNumber']
                            }],
                        }
                    ],
                    attributes: ['workingDay', 'hour', 'price']
                }
                ],
                raw : true,
                nest: true, 
                attributes: {
                    exclude: ['patientId', 'scheduleId', 'createdAt', 'updatedAt', 'User']
                },
                limit: limit,
            })

            resolve({
                errCode: 0,
                data: bookings
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getAllPatients = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            const patients = await db.Patient.findAll({
                include: [
                    {
                        model: db.User,
                        attributes: ['name', 'phoneNumber']

                    },
                ],
                raw: true,
                nest: true,
                limit: limit,
            })

            resolve({
                errCode: 0,
                data: patients
            })
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getAllBookings,
    getAllSchedules,
    getAllPatients
}