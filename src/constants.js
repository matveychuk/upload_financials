

export const form_fields = {
  inventory: [
    { value: 'id', mandatory: true },
    { value: 'name', mandatory: true },
    { value: 'price', mandatory: true },
    { value: 'quantity', mandatory: true },
    { value: 'description', mandatory: false },
    { value: 'supplier', mandatory: false },
  ],
  billings: ['billing number', 'customer', 'billing date', 'due date'],
  general_ledger: ['account',]
}