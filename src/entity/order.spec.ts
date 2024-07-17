import { Order } from "./order";
import { OrderItem } from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "1", []);
    }).toThrow("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("1", "", []);
    }).toThrow("CustomerId is required");
  });

  it("should throw error when items is empty", () => {
    expect(() => {
      let order = new Order("1", "123", []);
    }).toThrow("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "item 1", 100);
    const item2 = new OrderItem("i2", "item 2", 100);
    const order = new Order("o1", "c1", [item]);
    const total = order.total();
    expect(total).toBe(100);
    const order2 = new Order("o2", "c2", [item, item2]);
    const total2 = order2.total()
    expect(total2).toBe(200);
  });
});
