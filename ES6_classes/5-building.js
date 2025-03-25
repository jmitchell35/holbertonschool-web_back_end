export default class Building {
  constructor(sqft) {
    if (typeof sqft !== 'number' || Number.isNaN(sqft) || sqft <= 0) {
      throw new TypeError('Sqft must be a number');
    }

    this._sqft = sqft;

    if (this.constructor !== Building
      && this.constructor.prototype.evacuationWarningMessage
      === Building.prototype.evacuationWarningMessage) {
      throw new Error('Class extending Building must override evacuationWarningMessage');
    }
  }

  get sqft() {
    return this._sqft;
  }

  set sqft(newSqft) {
    if (typeof newSqft !== 'number' || Number.isNaN(newSqft) || newSqft < 0) {
      throw new TypeError('Amount must be a number');
    }

    this._sqft = newSqft;
  }

  // "Abstract" method that must be overridden
  // eslint-disable-next-line class-methods-use-this
  evacuationWarningMessage() {
    throw new Error('Class extending Building must override evacuationWarningMessage');
  }
}
