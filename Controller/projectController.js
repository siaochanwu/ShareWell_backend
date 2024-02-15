const model = require('../Model/project')
const projectModel = new model()

module.exports = class userController{
  constructor() {

  }

  async getAllProject(req, res, next) {
    try {
      const findAllProjectData = await projectModel.findAllProjectData();
      res.status(200).json({ data: findAllProjectData, message: 'findAll' });
    } catch(err) {
      console.log(err)
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async getOneProject(req, res, next) {
    console.log(req.params)
    const {projectid} = req.params

    try {
      const findOneProjectData = await projectModel.findOneProjectData(projectid);
      res.status(200).json({ data: findOneProjectData, message: 'findOne' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async createProject(req, res, next) {
    try {
      console.log(req.body)
      const createProjectData = await projectModel.createProject(req.body)
      res.status(200).json({ data: createProjectData, message: 'createProject' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }


  async updateProject(req, res, next) {
    const {projectid} = req.params
    try {
      console.log(req.body)
      const updateProjectData = await projectModel.updateProject(projectid, req.body)
      res.status(200).json({ data: updateProjectData, message: 'updateProjectData' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteProject(req, res, next) {
    console.log(req.params)
    const {projectid} = req.params
    try {
      const deleteProjectData = await projectModel.deleteProject(projectid)
      res.status(200).json({ data: deleteProjectData, message: 'deleteprojectData' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async getOneProjectUser(req, res, next) {
    console.log(req.params)
    const {projectid} = req.params

    try {
      const getOneProjectUser = await projectModel.findOneProjectGroup(projectid)
      res.status(200).json({ data: getOneProjectUser, message: 'getOneProjectUser' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async getProjectByUserID(req, res, next) {
    try {
      console.log(req.body)
      const {userId} = req.body
      const userProjectData = await projectModel.findUserProject(userId)
      res.status(200).json({ data: userProjectData, message: 'userProjectData' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }


}