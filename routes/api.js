var express = require('express');
var router = express.Router();

const userController = require('../Controller/userController');
const user = new userController()

const projectController = require('../Controller/projectController')
const project = new projectController()


router.get('/users', user.getAllUser);
router.post('/users', user.createUser);
router.put('/users/:id', user.updateUser);
router.delete('/users/:id', user.deleteUser);

router.get('/projects', project.getAllProject);
router.post('/projects', project.createProject);

router.delete('/projects/:projectid', project.deleteUser);





module.exports = router;