export default class HolbertonClass {
  constructor(size, location) {
    if (typeof size !== 'number' || Number.isNaN(size) || size < 0) {
      throw new TypeError('Size must be a number');
    }

    if (typeof location !== 'string') {
      throw new TypeError('Location must be a string');
    }

    this._size = size;
    this._location = location;
  }

  get size() {
    return this._size;
  }

  set size(newSize) {
    if (typeof newSize !== 'number' || Number.isNaN(newSize) || newSize < 0) {
      throw new TypeError('Size must be a number');
    }

    this._size = newSize;
  }

  get location() {
    return this._location;
  }

  set location(newLocation) {
    if (typeof newLocation !== 'string') {
      throw new TypeError('Location must be a string');
    }

    this._location = newLocation;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'string') {
      return `${this._location}`;
    }
    if (hint === 'number') {
      return this._size;
    }
    return `${this._location} (${this._size})`; // 'default' hint
  }
}
