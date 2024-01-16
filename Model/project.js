const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

module.exports = class Project {
  constructor() {
    this.findAllProjectGroupData = this.findAllProjectGroupData.bind();
  }

  //find all
  async findAllProjectData() {
    try {
      const allProject = await prisma.Project.findMany();
      for (let i = 0; i < allProject.length; i++) {
        allProject[i].users = [];
        const data = await this.findAllProjectGroupData(allProject[i].id);
        data.map((item) => {
          allProject[i].users.push(item.name);
        });
      }
      return allProject;
    } catch(err) {
      throw err
    }
  }

  async findAllProjectGroupData(projectId) {
    try {
      //userId > user_name  join
      const allProjectGroup =
        await prisma.$queryRaw`SELECT U.name FROM ProjectGroup as P 
        LEFT JOIN User as U ON P.userId=U.id where P.projectId=${projectId}`;
      return allProjectGroup;
    } catch(err) {
      throw err
    }
  }

  async findOneProjectData(id) {
    try {
      const project = await prisma.Project.findUnique({
        where: {
          id: id,
        },
      });
  
      project.users = [];
      const data = await this.findAllProjectGroupData(id);
      data.map((item) => {
        project.users.push(item.name);
      });
  
      return project;
    } catch(err) {
      throw err
    }
  }

  //create new
  //create projectGroup table []
  async createProject({ name, startDate, endDate, currency, location, users }) {
    const projectId = uuidv4();
    try {
      await prisma.$transaction(async (tx) => {
        // Code running in a transaction...
        const createProjectData = await tx.Project.create({
          data: {
            id: projectId,
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            currency,
            location,
          },
        });
  
        for (let i = 0; i < users.length; i++) {
          await tx.ProjectGroup.create({
            data: {
              id: uuidv4(),
              userId,
              projectId,
            }
          })
        }
        return createProjectData;
      })
    } catch (err) {
      console.error('Transaction failed, rollback...', err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }


  //update
  //check whether projectGroup change

  

  //delete project and projectGroup
  async deleteProject(projectId) {
    try {
      await prisma.$transaction(async (tx) => {
        const deleteProjectData = await tx.Project.delete({
          where: {
            id: projectId,
          },
        });
        await tx.ProjectGroup.deleteMany({
          where: {
            projectId: projectId,
          },
        });
  
        return deleteProjectData;
      })
    } catch (e) {
      console.error('Transaction failed, rollback...', err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }

  async findOneProjectGroup(projectId){
    try {
      const findProjectGroup = await prisma.$queryRaw`SELECT U.name, U.id FROM ProjectGroup as P LEFT JOIN User as U ON P.userId=U.id where P.projectId=${projectId}`;
      return findProjectGroup;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
};
