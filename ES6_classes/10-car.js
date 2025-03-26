export default class Car {
  constructor(brand, motor, color) {
    if (typeof motor !== 'string') {
      throw new TypeError('Motor must be a string');
    }

    if (typeof brand !== 'string') {
      throw new TypeError('Brand must be a string');
    }

    if (typeof color !== 'string') {
      throw new TypeError('Color must be a string');
    }

    this._brand = brand;
    this._motor = motor;
    this._color = color;
    this.id = Symbol('id');
  }

  get motor() {
    return this._motor;
  }

  set motor(newMotor) {
    if (typeof newMotor !== 'string') {
      throw new TypeError('Motor must be a string');
    }

    this._motor = newMotor;
  }

  get brand() {
    return this._brand;
  }

  set brand(newBrand) {
    if (typeof newBrand !== 'string') {
      throw new TypeError('Brand must be a string');
    }

    this._brand = newBrand;
  }

  get color() {
    return this._color;
  }

  set color(newColor) {
    if (typeof newColor !== 'string') {
      throw new TypeError('Color must be a string');
    }

    this._color = newColor;
  }

  cloneCar() {
    const Constructor = this.constructor;
    const newCar = Object.create(Constructor.prototype);

    newCar.id = Symbol('id');

    Object.defineProperties(newCar, {
      _brand: { value: undefined, writable: true },
      _motor: { value: undefined, writable: true },
      _color: { value: undefined, writable: true },
    });

    return newCar;
  }
}
