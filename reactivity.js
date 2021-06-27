// ----------------------------------------------------------------
// Vue.js Global - Vue 3 Reactivity
// Marc Backes (@themarcba)
// ----------------------------------------------------------------

const product = { price: 15, quantity: 2 }

let total = 0

const calculateTotal = () => {
    total = product.price * product.quantity
}

let dep = new Set() // list of effects will be saved here

// Register an effect
function track(target, key) {
    // target and key are not used yet.
    // they will come into play in stage 5

    // Add effect
    dep.add(calculateTotal)
}

// Execute all registered effects for the target/key combination
function trigger(target, key) {
    // target and key are not used yet.
    // they will come into play in stage 5

    // Execute all effects
    dep.forEach(effect => effect())
}

const proxy = new Proxy(product, {
    // Intercept getter
    get(target, key, receiver) {
        console.log('get', key, 'from', target)
        const result = Reflect.get(target, key, receiver)
        track(target, key) //track changes for the key in the target
        return result
    },
    // Intercept setter
    set(target, key, value, receiver) {
        console.log('set', key, '=>', value)
        const result = Reflect.set(target, key, value, receiver)
        trigger(target, key) // trigger a change in the target
        return result
    },
})

console.log(proxy.price)
proxy.price = 25
console.log(proxy.price)
proxy.quantity = 5
console.log(proxy.quantity)

// Results in:
// get price from {price: 15, quantity: 2}
// set price => 25
// get price from {price: 25, quantity: 2}
// set quantity => 5
// get quantity from {price: 25, quantity: 5}
