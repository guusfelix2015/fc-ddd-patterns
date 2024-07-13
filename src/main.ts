import { Address } from "./entity/address";
import { Customer } from "./entity/customer";
import { Order } from "./entity/order";
import { OrderItem } from "./entity/order_item";

let customer = new Customer("123", "Gustavo");
const address = new Address("Rua afonsina", 2, "38747-026", "Patrocínio");
customer.Address = address;
customer.activate;
//ID

// Objeto - Entidade
const item1 = new OrderItem("1", "item1", 20);
const item2 = new OrderItem("2", "item2", 30);
const oder = new Order("1", customer._id, [item1, item2]);
