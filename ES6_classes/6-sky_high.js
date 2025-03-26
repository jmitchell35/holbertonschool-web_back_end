import Building from './5-building';

export default class SkyHighBuilding extends Building {
  constructor(sqft, floors) {
    super(sqft);

    if (typeof floors !== 'number' || Number.isNaN(floors) || floors <= 0) {
      throw new TypeError('Floors must be a number');
    }

    this._floors = floors;

    if (this.constructor !== Building
      && this.constructor.prototype.evacuationWarningMessage
      === Building.prototype.evacuationWarningMessage) {
      throw new Error('Class extending Building must override evacuationWarningMessage');
    }
  }

  get floors() {
    return this._floors;
  }

  set floors(newFloors) {
    if (typeof newFloors !== 'number' || Number.isNaN(newFloors) || newFloors < 0) {
      throw new TypeError('Amount must be a number');
    }

    this._floors = newFloors;
  }

  // "Abstract" method that must be overridden
  // eslint-disable-next-line class-methods-use-this
  evacuationWarningMessage() {
    return `Evacuate slowly the ${this._floors} floors`;
  }
}
