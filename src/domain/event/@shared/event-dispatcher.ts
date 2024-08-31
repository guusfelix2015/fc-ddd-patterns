import { EventDispatcherInterface } from "./event-dispatcher.interface";
import { EventHandlerInterface } from "./event-handler.interface";
import { EventInterface } from "./event.interface";

export class EventDispatcher implements EventDispatcherInterface {


  register(name: string, eventHandler: EventHandlerInterface): void {

  }

  unregister(name: string): void {

  }

  unregisterAll(): void {

  }

  notify(event: EventInterface): void {

  }
}