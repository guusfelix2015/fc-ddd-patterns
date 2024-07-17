import { Product } from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let product = new Product("", "Product 1", 100);
    }).toThrow("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let product = new Product("1", "", 200);
    }).toThrow("Name is required");
  });

  it("should throw error when price <= 0", () => {
    expect(() => {
      let product = new Product("1", "123", -1);
    }).toThrow("Number must be greater than zero");
  });

  it("should change name", () => {
    const product = new Product("1", "123", 1);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should change price", () => {
    const product = new Product("1", "123", 1);
    product.changePrice(2);
    expect(product.price).toBe(2);
  });
});
