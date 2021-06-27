// ----------------------------------------------------------------
// Vue.js Global - Vue 3 Reactivity
// Marc Backes (@themarcba)
// ----------------------------------------------------------------

let activeEffect = null
let targetMap = new WeakMap()

// Register an effect
function track(target, key) {
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
    if (activeEffect) dep.add(activeEffect)
}

// Execute all registered effects for the target/key combination
function trigger(target, key) {
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

// Watcher
function effect(fn) {
    activeEffect = fn
    // Only execute when there is an activeEffect
    if (activeEffect) activeEffect()
    activeEffect = null
}

// The ref class is a reactive object with a single value (called "value")
function ref(raw) {
    let r = {
        // Intercept getter
        get value() {
            track(r, 'value')
            return raw
        },
        // Intercept setter
        set value(newValue) {
            raw = newValue
            trigger(r, 'value')
        },
    }
    return r
}
