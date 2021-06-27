// ----------------------------------------------------------------
// Vue.js Global - Vue 3 Reactivity
// Marc Backes (@themarcba)
// ----------------------------------------------------------------

const product = reactive({ price: 15, quantity: 2 })

let total = 0

const calculateTotal = () => {
    total = product.price * product.quantity
}

let targetMap = new WeakMap()

// Register an effect
function track(target, key) {
    console.log('🔎 track', key)
    // Get depsMap from targetMap
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        // new depsMap if it doesn't exist yet
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    // Get dep from depsMap
    let dep = depsMap.get(key)
    if (!dep) {
        // new dep if it doesn't exist yet
        dep = new Set()
        depsMap.set(key, dep)
    }

    // Add effect
    dep.add(calculateTotal)
}

// Execute all registered effects for the target/key combination
function trigger(target, key) {
    console.log('💥 trigger', key)
    // Get depsMap from targetMap
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        // If there is no depsMap, no need to resume
        return
    }

    // Get dep from depsMap
    let dep = depsMap.get(key)
    if (!dep) {
        // If there is no dep, no need to resume
        return
    }

    // Execute all effects
    dep.forEach(effect => effect())
}

// Makes an object "reactive". Changes will be triggered, once the property is tracked
function reactive(target) {
    const handler = {
        // Intercept getter
        get(target, key, receiver) {
            const result = Reflect.get(target, key, receiver)
            track(target, key) //track changes for the key in the target
            return result
        },
        // Intercept setter
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver)
            trigger(target, key) // trigger a change in the target
            return result
        },
    }
    return new Proxy(target, handler)
}

// still needs to be executed once!
// if not, the properties will never be tracked
// this will be fixed in stage 6
calculateTotal()

console.log(total)
product.quantity = 100
console.log(product.quantity)
