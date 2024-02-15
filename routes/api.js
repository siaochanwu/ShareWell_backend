var express = require('express');
var router = express.Router();

const userController = require('../Controller/userController');
const user = new userController()

const projectController = require('../Controller/projectController')
const project = new projectController()

const itemController = require('../Controller/itemController');
const item = new itemController()

//User
router.get('/users', user.getAllUser);
router.post('/userInfo', user.getOneUser);//get single user data by userid
router.post('/users', user.createUser);
router.put('/users/:id', user.updateUser);
router.delete('/users/:id', user.deleteUser);


//Project page
router.get('/projects', project.getAllProject);
router.get('/projects/:projectid', project.getOneProject);
router.post('/projects', project.createProject);
router.put('/projects/:projectid', project.updateProject)//UPDATE PROJECT
router.delete('/projects/:projectid', project.deleteProject);



//Item
router.get('/items/:id', item.getAllItems)
router.post('/items', item.createItem)
router.delete('/items/:id', item.deleteItem)
router.put('/items/:id', item.updateItem)
router.get('/projectUser/:projectid', project.getOneProjectUser); //各專案的參與者
router.post('/itemRelations', item.getOneItemRelations)//支付關係



//SingleUser
router.post('/userProject', project.getProjectByUserID)//list all projects
router.post('/userProject/:projectid', item.getUserItem)//list all payment by project
router.post('/userPayment', item.getPaymentByUserAndProject)//user total payment by project








module.exports = router;