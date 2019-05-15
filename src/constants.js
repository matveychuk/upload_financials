

export const form_fields = {
  inventory: {
    mandatory: ['id', 'name', 'price', 'quantity'],
    optional: ['description', 'supplier']
  },
  billings: ['billing number', 'customer', 'billing date', 'due date'],
  general_ledger: ['account', ]
}