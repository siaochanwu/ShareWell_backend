const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

module.exports = class Project {
  constructor() {
    this.findAllProjectGroupData = this.findAllProjectGroupData.bind();
    this.createProjectGroup = this.createProjectGroup.bind();
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
    } catch (err) {
      throw err;
    }
  }

  async findAllProjectGroupData(projectId) {
    try {
      //userId > user_name  join
      const allProjectGroup =
        await prisma.$queryRaw`SELECT U.name FROM ProjectGroup as P 
        LEFT JOIN User as U ON P.userId=U.id where P.projectId=${projectId}`;
      return allProjectGroup;
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
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
          await this.createProjectGroup(users[i], projectId);
        }
        return createProjectData;
      });
    } catch (err) {
      console.error("Transaction failed, rollback...", err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }

  async createProjectGroup(userId, projectId) {
    try {
      const projectGroup = await prisma.projectGroup.create({
        data: {
          id: uuidv4(),
          userId,
          projectId,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  //update
  //check whether projectGroup change
  async updateProject(projectId, data) {
    const { location, currency, startDate, endDate, name, users } = data;

    try {
      const itemExist = await prisma.item.findFirst({
        where: {
          projectId: projectId,
        },
      });

      if (itemExist) {
        //if item exist then cannot edit users 只增不減
        await prisma.$transaction(async (tx) => {
          const createProjectData = await tx.Project.update({
            where: {
              id: projectId,
            },
            data: {
              name,
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              currency,
              location,
            },
          });

          for (let i = 0; i < users.length; i++) {
            const exist = await tx.ProjectGroup.findFirst({
              where: {
                userId: users[i],
                projectId,
              },
            });

            if (!exist) {
              await tx.ProjectGroup.create({
                data: {
                  id: uuidv4(),
                  userId: users[i],
                  projectId,
                },
              });
            }
          }
          return createProjectData;
        });
      } else {
        //if not exist, then compare new and old
        //刪除原本的
        //新增新的
        await prisma.$transaction(async (tx) => {
          const createProjectData = await tx.Project.update({
            where: {
              id: projectId,
            },
            data: {
              name,
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              currency,
              location,
            },
          });

          await tx.ProjectGroup.deleteMany({
            where: {
              projectId,
            },
          });

          for (let i = 0; i < users.length; i++) {
            await tx.ProjectGroup.create({
              data: {
                id: uuidv4(),
                userId: users[i],
                projectId,
              },
            });
          }
          return createProjectData;
        });
      }
    } catch (err) {
      console.error("Transaction failed, rollback...", err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }

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
      });
    } catch (e) {
      console.error("Transaction failed, rollback...", err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }

  async findOneProjectGroup(projectId) {
    try {
      const findProjectGroup =
        await prisma.$queryRaw`SELECT U.name, U.id FROM ProjectGroup as P LEFT JOIN User as U ON P.userId=U.id where P.projectId=${projectId}`;
      return findProjectGroup;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findUserProject(userId) {
    try {
      const allProject =
        await prisma.$queryRaw`SELECT B.* FROM ProjectGroup AS A LEFT JOIN Project AS B ON A.projectId=B.id WHERE A.userId=${userId}`;
      return allProject;
    } catch (err) {
      throw err;
    }
  }
};
