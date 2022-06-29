// ----------------------------------------------------------------
// Vue 3 Reactivity
// Marc Backes (@themarcba)
// ----------------------------------------------------------------

const product = { price: 15, quantity: 2 }

let total = product.price * product.quantity

console.log({ total })

product.quantity = 3
console.log({ total }) // Does not recalculate

product.price = 12
console.log({ total }) // Does not recalculate

// executing total = product.price * product.quantity
// every time something changes would be tedious 😣

product.price = 20
total = product.price * product.quantity
console.log({ total }) // Recalculate due to line 22
