import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../db/sequelize/model/product.model";
import { ProductRepository } from "./product.repository";
import { Product } from "../../domain/product/entity/product";
import { CustomerModel } from "../db/sequelize/model/customer.model";
import { CustomerRepository } from "./customer.repository";
import { OrderModel } from "../db/sequelize/model/order.model";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";
import { Customer } from "../../domain/entity/customer";
import { Address } from "../../domain/customer/value-object/address";
import { OrderRepository } from "./order.repository";
import { OrderItem } from "../../domain/checkout/entity/order_item";
import { Order } from "../../domain/checkout/entity/order";

describe("Order repository unit tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "12120-343", "São Pailo");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);
    await productRepository.create(product);


    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          product_id: product.id,
          order_id: order.id,
          total: orderItem.price * orderItem.quantity,
        },
      ],
    });
  })

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "12120-343", "São Pailo");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 1);
    const order = new Order("1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.findById(order.id);

    expect(orderResult).toStrictEqual(order);
  })

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "12120-343", "São Paulo");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem1 = new OrderItem("1", product.name, product.price, product.id, 2);
    const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 1);

    const order1 = new Order("1", customer.id, [orderItem1]);
    const order2 = new Order("2", customer.id, [orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);

    const foundOrder1 = orders.find((order) => order.id === order1.id);
    const foundOrder2 = orders.find((order) => order.id === order2.id);

    expect(foundOrder1).toBeDefined();
    expect(foundOrder1.id).toBe(order1.id);
    expect(foundOrder1.customerId).toBe(order1.customerId);
    expect(foundOrder1.items).toHaveLength(1);
    expect(foundOrder1.items[0].id).toBe(orderItem1.id);
    expect(foundOrder1.items[0].name).toBe(orderItem1.name);
    expect(foundOrder1.items[0].price).toBe(orderItem1.price * orderItem1.quantity);
    expect(foundOrder1.items[0].productId).toBe(orderItem1.productId);
    expect(foundOrder1.items[0].quantity).toBe(orderItem1.quantity);

    expect(foundOrder2).toBeDefined();
    expect(foundOrder2.id).toBe(order2.id);
    expect(foundOrder2.customerId).toBe(order2.customerId);
    expect(foundOrder2.items).toHaveLength(1);
    expect(foundOrder2.items[0].id).toBe(orderItem2.id);
    expect(foundOrder2.items[0].name).toBe(orderItem2.name);
    expect(foundOrder2.items[0].price).toBe(orderItem2.price);
    expect(foundOrder2.items[0].productId).toBe(orderItem2.productId);
    expect(foundOrder2.items[0].quantity).toBe(orderItem2.quantity);
  });

  it("should update an order and its items", async () => {
    // Setup initial data
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "12120-343", "São Paulo");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Product 1", 100);
    const product2 = new Product("2", "Product 2", 200);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
    const order = new Order("1", customer.id, [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Validate initial state
    let orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });
    expect(orderModel.total).toBe(order.total());
    expect(orderModel.items).toHaveLength(1);
    expect(orderModel.items[0].id).toBe(orderItem1.id);
    
    // Update order: change quantity of item and add a new item
    orderItem1.quantity = 3; // Change quantity of item1
    const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 1);
    order.items.push(orderItem2);
    await orderRepository.update(order);

    // Validate updated state
    orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });
    expect(orderModel.total).toBe(order.total());
    expect(orderModel.items).toHaveLength(2);

    // Validate item 1
    const dbItem1 = orderModel.items.find(item => item.id === orderItem1.id);
    expect(dbItem1.quantity).toBe(orderItem1.quantity);
    expect(dbItem1.total).toBe(orderItem1.price * orderItem1.quantity);

    // Validate item 2
    const dbItem2 = orderModel.items.find(item => item.id === orderItem2.id);
    expect(dbItem2).toBeDefined();
    expect(dbItem2.name).toBe(orderItem2.name);
    expect(dbItem2.price).toBe(orderItem2.price);
    expect(dbItem2.product_id).toBe(orderItem2.productId);
    expect(dbItem2.quantity).toBe(orderItem2.quantity);
  });

});
