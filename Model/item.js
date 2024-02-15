const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

module.exports = class Item {
  constructor() {
    this.createItemGroup = this.createItemGroup.bind();
  }

  //1.find all item
  async findAllItems(projectId) {
    try {
      const allItems =
        await prisma.$queryRaw`SELECT I.*, U.name as payer FROM Item as I 
      LEFT JOIN User as U ON I.payerId=U.id where I.projectId=${projectId}`;
      return allItems;
    } catch (err) {
      throw err;
    }
  }

  //2.add one item
  //calculate pay and receive save to itemGroup table
  async createNewItem({
    projectId,
    name,
    price,
    itemDate,
    payerId,
    payment,
    users,
  }) {
    const eachPayment = price / users.length;
    const receiver = payment - eachPayment;
    const itemId = uuidv4();
    //收 (+)  付 (-)

    try {
      await prisma.$transaction(async (tx) => {
        const newItem = await tx.item.create({
          data: {
            id: itemId,
            name,
            projectId,
            price,
            date: new Date(itemDate),
            payerId,
            payment,
          },
        });

        for (let user of users) {
          console.log("user: ", user, payerId);
          if (user == payerId) {
            const result = await this.createItemGroup(
              user,
              itemId,
              receiver,
              payerId
            );
          } else {
            const result = await this.createItemGroup(
              user,
              itemId,
              -eachPayment,
              payerId
            );
          }
        }
        return newItem;
      });
    } catch (err) {
      console.error("Transaction failed, rollback...", err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }

  async createItemGroup(userId, itemId, payment, payerId) {
    try {
      const itemGroup = await prisma.itemGroup.create({
        data: {
          id: uuidv4(),
          userId,
          itemId,
          payment,
          payerId,
        },
      });
      console.log(itemGroup);
    } catch (err) {
      throw err;
    }
  }

  async updateItem(itemId, data) {
    //delete old itemgroup
    //create new itemgroup
    const { name, projectId, price, itemDate, payerId, payment, users } = data;
    const eachPayment = price / users.length;
    const receiver = payment - eachPayment;

    try {
      await prisma.$transaction(async (tx) => {
        const updateItem = await tx.item.update({
          where: {
            id: itemId,
          },
          data: {
            name,
            projectId,
            price,
            date: new Date(itemDate),
            payerId,
            payment,
          },
        });

        await tx.ItemGroup.deleteMany({
          where: {
            itemId,
          },
        });

        for (let user of users) {
          if (user == payerId) {
            await tx.itemGroup.create({
              data: {
                id: uuidv4(),
                userId: user,
                itemId,
                payment: receiver,
                payerId,
              },
            });
          } else {
            await tx.itemGroup.create({
              data: {
                id: uuidv4(),
                userId: user,
                itemId,
                payment: -eachPayment,
                payerId,
              },
            });
          }
        }
        return updateItem;
      });
    } catch (err) {
      console.error("Transaction failed, rollback...", err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteOneItem(id) {
    try {
      await prisma.$transaction(async (tx) => {
        const deleteitem = await tx.item.deleteMany({
          where: {
            id,
          },
        });

        await tx.itemGroup.deleteMany({
          where: {
            itemId: id,
          },
        });

        return deleteitem;
      });
    } catch (err) {
      console.error("Transaction failed, rollback...", err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }

  async getItemPaymentRelation(itemId) {
    try {
      let allItems = [];
      await prisma.$transaction(async (tx) => {
        allItems = await tx.$queryRaw`SELECT I.*, U.name as name 
        FROM ItemGroup as I 
        LEFT JOIN User as U 
        ON I.userId=U.id 
        WHERE I.itemId=${itemId}
        `;

        for (let item of allItems) {
          const data = await tx.$queryRaw`SELECT distinct U.name 
          FROM ItemGroup as I 
          LEFT JOIN User as U 
          ON I.payerId=U.id 
          WHERE I.payerId=${item.payerId}
          `;
          item.payerName = data[0].name;
        }
      });
      return allItems;
    } catch (err) {
      console.error("Transaction failed, rollback...", err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }

  async getPaymentTotalByUserAndProject(userId) {
    try {
      const payment =
        await prisma.$queryRaw`SELECT I.projectId, G.userId, SUM(G.payment) AS total
      FROM ItemGroup AS G 
      LEFT JOIN Item AS I
      ON G.itemId=I.id 
      WHERE G.userId=${userId}
      GROUP BY I.projectId, G.userId
      `;
      return payment;
    } catch (err) {
      throw err;
    }
  }

  async findUserItems(userId, projectid) {
    try {
      let allItems = [];
      await prisma.$transaction(async (tx) => {
        allItems = await tx.item.findMany({
          where: {
            projectId: projectid,
          },
        });

        for (let item of allItems) {
          const payment = await tx.$queryRaw`SELECT A.*, B.name AS payerName
          FROM ItemGroup AS A 
          LEFT JOIN User AS B
          ON A.payerId=B.id 
          WHERE A.userId=${userId} 
          AND A.itemId=${item.id}
          `;

          if (payment.length > 0) {
            item.userPayment = payment[0].payment;
            item.userPayTo = payment[0].payerName;
          }
        }
      });
      return allItems;
    } catch (err) {
      console.error("Transaction failed, rollback...", err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
    }
  }
};
