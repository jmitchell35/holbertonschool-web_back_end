export default class Car {
  constructor(brand, motor, color) {
    this._brand = brand;
    this._motor = motor;
    this._color = color;
  }

  get brand() {
    return this._brand;
  }

  set brand(value) {
    this._brand = value;
  }

  get motor() {
    return this._motor;
  }

  set motor(value) {
    this._motor = value;
  }

  get color() {
    return this._color;
  }

  set color(value) {
    this._color = value;
  }

  cloneCar() {
    const Constructor = this.constructor;
    const newCar = Object.create(Constructor.prototype);

    // eslint-disable-next-line no-underscore-dangle
    newCar._brand = undefined;
    // eslint-disable-next-line no-underscore-dangle
    newCar._motor = undefined;
    // eslint-disable-next-line no-underscore-dangle
    newCar._color = undefined;

    return newCar;
  }
}
