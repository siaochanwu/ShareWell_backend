var express = require('express');
var router = express.Router();

const userController = require('../Controller/userController');
const user = new userController()


router.get('/users', user.getAllUser);
router.post('/users', user.createUser);
router.put('/users/:id', user.updateUser);
router.delete('/users/:id', user.deleteUser);





module.exports = router;