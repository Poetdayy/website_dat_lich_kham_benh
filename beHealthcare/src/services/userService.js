import db from "../models/index";
import bcrypt from 'bcryptjs';
import doctorService from "./doctorService";
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const { Op } = require('sequelize');


const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            roleId: user.roleId
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "365d" }
    )
}

const generateRefreshToken = (user) => {
    jwt.sign(
        {
            id: user.id,
            roleId: user.roleId
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "365d" }
    );
}

const handleUserLogin = (phoneNumber, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isExist = await checkUserPhoneNumber(phoneNumber);
            const userData = {};

            if (isExist) {
                //compare Password
                const user = await db.User.findOne({
                    attributes: ['id', 'phoneNumber', 'roleId', 'password', 'name'],
                    where: {phoneNumber: phoneNumber},
                    raw: true,
                })

                if (user) {
                    //compare password
                    const validPassword = bcrypt.compareSync(password, user.password);

                    if (user && validPassword) {
                        const accessToken = generateAccessToken(user);
                        const refreshToken = generateRefreshToken(user);

                        // userData.cookie("refresh token", refreshToken, {
                        //     httpOnly: true,
                        //     secure: false,
                        //     path: "/",
                        //     samesite: "strict",
                        // })

                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = { user, accessToken, refreshToken };

                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Sai số điện thoại hoặc mật khẩu';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found `
                }
            }
            else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Số điện thoại của bạn không tồn tại`;
            }

            resolve(userData);

        } catch (e) {
            reject(e);
        }
    })
}

const checkUserPhoneNumber = (userPhoneNumber) => { 
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { phoneNumber: userPhoneNumber }
            })

            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

const getAllUsers = (userId) => {
    return new Promise( async (resolve, reject) => {
        try {

            let users = '';

            if (userId === 'all') {
                users = await db.User.findAll({})
            }
            
            if (userId && userId !== 'all') {
                users = await db.User.findOne({
                    where: { id: userId }
                })
            }

            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject (e);
        }
    })
}

const createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPhonenumber = await checkUserPhoneNumber(data.phoneNumber);
            if (checkPhonenumber) {
                resolve({
                    errCode: 1,
                    message: "Your phone number is exist",
                })
            } else {
                const hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    phoneNumber: data.phoneNumber,
                    password: hashPasswordFromBcrypt,
                    name: data.name,
                    email: data.email,
                    address: data.address,
                    gender: data.gender === "1" ? true : false,
                    roleID: data.roleID,
                })
            }   

            resolve({
                errCode: 0,
                message: "OK",
            })
        } catch (e) {
            reject(e)
        }
    }) 
}

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {id: userId}
            })

            if(!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`,
                })
            }

            await db.User.destroy({
                where: { id: userId }
            })

            resolve({
                errCode: 0,
                message: 'The user is deleted',
            })
        } catch (e) {
            reject(e);
        }
    })
}

const searchDoctorsThroughName = async (query) => {
    const results = await db.Doctor.findAll({
        include: [
            {
                model: db.User,
                where: {
                    name: { [Op.like]: `%${query}%` },
                },
                attributes: ['name', 'status', 'avatar']
            },
            {
                model: db.Specialization
            },
            {
                model: db.Clinic
            }
        ],
        raw : true,
        nest: true, 
      });

      if (results) {
          return results;
      } else {
          return results = '';
      }
  
}
  
const searchDoctorsThroughSpecializations = async (query) => {
    const results = await db.Doctor.findAll({
        include: [
            {
                model: db.Specialization,
                where: {
                    name: { [Op.like]: `%${query}%` },
                },
                attributes: ['name']
            },
            {
                model: db.Specialization
            },
            {
                model: db.Clinic
            },
            {
                model: db.User,
                attributes: ['name', 'status', 'avatar']
            },
        ],
        raw : true,
        nest: true, 
      });

      if (results) {
          return results;
      } else {
          return results = '';
      }
}   
  
const searchDoctorsThroughClinics = async (query) => {
    const results = await db.Doctor.findAll({
        include: [
            {
                model: db.Clinic,
                where: {
                    [Op.or]: [
                      { name: { [Op.like]: `%${query}%` } },
                      { address: { [Op.like]: `%${query}%` } },
                    ],
                },
                attributes: ['name', 'address', 'image']
            },
            {
                model: db.Specialization
            },
            {
                model: db.Clinic
            },
            {
                model: db.User,
                attributes: ["name", "avatar"]
            }
        ],
        raw : true,
        nest: true, 
      });
  
      if (results) {
          return results;
      } else {
          return results = '';
      }    
}

const searchDoctor = (query, type) => {
    return new Promise(async (resolve, reject) => {
        try {
           let results;
           if (type === 'doctor') {
            results = await searchDoctorsThroughName(query);
           } else if (type === 'specialization') {
            results = await searchDoctorsThroughSpecializations(query);
           } else if (type === 'clinic') {
            results = await searchDoctorsThroughClinics(query);
           } else {
            return resolve({
                errCode: 0,
                message: "Phải nhập vào type"
                
            })
           }

           if (results.length === 0) {
            results = await getAllDoctor();
           }

           resolve({
            errCode: 0,
            message: "Tìm kiếm thành công",
            results,
           })

        } catch (e) {
            reject(e);
        }
    })
}


const searchAllOfDoctor = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            let results;
            console.log('query', query);

            results = await searchDoctorsThroughSpecializations(query);
            
            if (results.length === 0) {
                results = await searchDoctorsThroughClinics(query);
            }
            
            if (results.length === 0) {
                results = await searchDoctorsThroughName(query);
            }

            if (results === "") {
                results = await doctorService.getAllDoctor();
            }

           resolve({
            errCode: 0,
            message: "Tìm kiếm thành công",
            data: results,
           })

        } catch (e) {
            reject(e);
        }
    })
}

const getAllClinics = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {

            const clinics = await db.Clinic.findAll({
                limit: limit,
            })

            resolve({
                errCode: 0,
                data: clinics
            })
        } catch (e) {
            reject(e);
        }
    })
}
    
const getAllSpecializations = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {

            const specializations = await db.Specialization.findAll({
                limit: limit,
            })

            resolve({
                errCode: 0,
                data: specializations
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getDetailClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            const clinic = await db.Clinic.findOne({
                where: {id: id},
            })

            resolve({
                errCode: 0,
                data: clinic
            })
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    handleUserLogin,
    checkUserPhoneNumber,
    getAllUsers,
    createUser,
    deleteUser,
    searchDoctor,
    searchAllOfDoctor,
    getAllSpecializations,
    getAllClinics,
    getDetailClinic,
}