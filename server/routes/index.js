const express = require('express');
const registerUser = require('../controller/Users/registerUser');
const checkUserEmail = require('../controller/Users/checkUserEmail');
const checkPassword = require('../controller/Users/checkPassword');
const userDetails = require('../controller/Users/getUserDetail');
const logoutUser = require('../controller/Users/logoutUser');
const updateUser = require('../controller/Users/updateUserDetails');
const getAllUserDetails = require('../controller/Users/getAllUserDetails');
const router = express.Router();


router.post('/register-user',registerUser)
router.post("/check-user-email",checkUserEmail)
router.post('/check-user-password',checkPassword)
router.get('/user-details',userDetails)
router.get('/logout-user',logoutUser)
router.post('/update-user-details',updateUser)
router.post('/get-all-user-details',getAllUserDetails)

module.exports = router