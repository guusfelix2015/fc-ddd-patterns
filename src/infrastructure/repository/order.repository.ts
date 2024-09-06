import { OrderModel } from "../db/sequelize/model/order.model";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";
import { OrderRepositoryInterface } from "../../domain/checkout/repository/order-repository-interface";
import { Order } from "../../domain/checkout/entity/order";
import { OrderItem } from "../../domain/checkout/entity/order_item";


export class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
    }, {
      include: [{ model: OrderItemModel, as: "items" }],
    });
  }

  async findById(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel, as: "items" }],
      rejectOnEmpty: true,
    })

    const order = new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map((item) => {
        const orderItem = new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        )
        return orderItem;
      })
    );
    return order;
  }

  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll({
      include: [{ model: OrderItemModel, as: "items" }],
    })

    const orders = ordersModel.map((orderModel) => {
      const items = orderModel.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        );
      });
  
      return new Order(orderModel.id, orderModel.customer_id, items);
    });
  
    return orders;
  }

async update(entity: Order): Promise<void> {
  await OrderModel.update(
    {
      total: entity.total(),
    },
    {
      where: {
        id: entity.id,
      },
    }
  );

  const currentItems = await OrderItemModel.findAll({
    where: { order_id: entity.id },
  });

  for (const item of entity.items) {
    const existingItem = currentItems.find((i) => i.id === item.id);
    if (existingItem) {
      await OrderItemModel.update(
        {
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          total: item.price * item.quantity,
        },
        {
          where: { id: item.id },
        }
      );
    } else {
      await OrderItemModel.create({
        id: item.id,
        order_id: entity.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        total: item.price * item.quantity,
      });
    }
  }

  for (const dbItem of currentItems) {
    if (!entity.items.some((item) => item.id === dbItem.id)) {
      await OrderItemModel.destroy({
        where: { id: dbItem.id },
      });
    }
  }
}

}