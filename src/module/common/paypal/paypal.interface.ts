export type PaypalItem = {
  name: string;
  sku: string;
  price: string;
  currency: 'USD';
  quantity: number;
};

export type PaypalAmount = {
  currency: 'USD';
  toal: string;
};

export type PaypalTransactions = {
  itemList: PaypalItem[];
  amount: PaypalAmount;
  description: 'Paypal';
};
