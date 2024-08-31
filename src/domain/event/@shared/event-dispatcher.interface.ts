import { EventHandlerInterface } from "./event-handler.interface";
import { EventInterface } from "./event.interface";

export interface EventDispatcherInterface {
  notify(event: EventInterface): void;
  register(name: string, eventHandler: EventHandlerInterface): void;
  unregister(name: string): void;
  unregisterAll(): void;
}