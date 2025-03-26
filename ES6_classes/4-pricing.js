import Currency from './3-currency';

export default class Pricing {
  constructor(amount, currency) {
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 0) {
      throw new TypeError('Amount must be a number');
    }

    if (!(currency instanceof Currency)) {
      throw new TypeError('Currency must be a Currency');
    }

    this._amount = amount;
    this._currency = currency;
  }

  get amount() {
    return this._amount;
  }

  set amount(newAmount) {
    if (typeof newAmount !== 'number' || Number.isNaN(newAmount) || newAmount < 0) {
      throw new TypeError('Amount must be a number');
    }

    this._amount = newAmount;
  }

  get currency() {
    return this._currency;
  }

  set currency(newCurrency) {
    if (!(newCurrency instanceof Currency)) {
      throw new TypeError('Currency must be a Currency');
    }

    this._currency = newCurrency;
  }

  displayFullPrice() {
    return `${this._amount} ${this._currency.name} (${this._currency.code})`;
  }

  static convertPrice(amount, conversionRate) {
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 0) {
      throw new TypeError('Amount must be a number');
    }

    if (typeof conversionRate !== 'number' || Number.isNaN(conversionRate) || conversionRate < 0) {
      throw new TypeError('Amount must be a number');
    }

    return amount * conversionRate;
  }
}
