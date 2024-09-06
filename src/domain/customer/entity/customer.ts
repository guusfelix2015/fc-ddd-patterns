import { Address } from "../value-object/address";

export class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  changeAddress(address: Address) {
    this._address = address;
  }

  get name(): string {
    return this._name;
  }

  get id(): string {
    return this._id;
  }

  get address(): Address {
    return this._address;
  }

  get street(): string {
    return this.street;
  }

  get number(): number {
    return this.number;
  }

  get zip(): string {
    return this.zip;
  }

  get city(): string {
    return this.city;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate customer");
    }
    this._active = true;
  }

  isActive(): boolean {
    return this._active;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
