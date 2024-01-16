var express = require('express');
var router = express.Router();

const userController = require('../Controller/userController');
const user = new userController()

const projectController = require('../Controller/projectController')
const project = new projectController()

const itemController = require('../Controller/itemController');
const item = new itemController()


router.get('/users', user.getAllUser);
router.post('/users', user.createUser);
router.put('/users/:id', user.updateUser);
router.delete('/users/:id', user.deleteUser);

router.get('/projects', project.getAllProject);
router.get('/projects/:projectid', project.getOneProject);
router.post('/projects', project.createProject);
//UPDATE PROJECT
router.delete('/projects/:projectid', project.deleteUser);

router.get('/projectUser/:projectid', project.getOneProjectUser); //各專案的參與者


router.get('/items/:id', item.getAllItems)
router.post('/items', item.createItem)

//item 支付關係 by item_id ->user name.payment.payer
router.post('/itemRelations', item.getOneItemRelations)







module.exports = router;