import { isArray } from "@vue/shared"
import { createDep, Dep } from "./dep"


type keyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, keyToDepMap>() // 目标Map


/**
 * 
 * @param fn 执行函数
 */
export function effect<T = any>(fn: () => T) {
    const _effect = new ReactiveEffect(fn)
    // 第一次fn函数执行
    _effect.run()
}

/**
 * 
 */
export let activeEffect:ReactiveEffect | undefined 
export class ReactiveEffect<T = any> {
    constructor(public fn:()=> T) {}
    run() {
        activeEffect = this
        return this.fn()
    }
}

/**
 * 收集依赖
 * @param target 
 * @param key 
 */
 /**
  * WeakMap key 类型是object 指向obj
  * WeakMap value  是一个Map对象 其中key是指定的属性 value是执行函数fn(缺点：会出现一个key对应多个fn的情况，所有value应该是一个set数组)
  */
export function track(target:object, key: unknown) {
    // console.log('activeEffect', activeEffect) // 里面包含了一个执行函数
    if(!activeEffect) return
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        targetMap.set(target,(depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if(!dep) {
        depsMap.set(key, (dep = createDep()))
    }
    trackEffects(dep)
    // depsMap.set(key, activeEffect)
    // console.log('targetMap', targetMap)
}

/**
 * 利用 dep 依次跟踪指定 key 的所有 effect
 */ 
export function trackEffects(dep: Dep) {
    dep.add(activeEffect!) // !作用
} 
/**
 * 触发依赖
 * @param target 
 * @param key 
 * @param newValue 
 */
export function trigger(target:object, key: unknown , newValue: unknown) {
    const depsMap = targetMap.get(target)
    if(!depsMap) {
        return
    }
    // const effect = depsMap.get(key) as ReactiveEffect
    // if(!effect){
    //     return
    // }
    // effect.fn()

    const dep:Dep |undefined = depsMap.get(key)

    if(!dep) {
        return
    }
    // 触发依赖
    triggerEffects(dep)
}

/**
 * 依次触发 dep 保存的依赖
 * @param dep 
 */
export function triggerEffects(dep: Dep) {
    const effects = isArray(dep) ? dep: [...dep]
    // 依次触发依赖
    for(const effect of effects) {
        triggerEffect(effect)
    } 
}

/**
 * 触发指定依赖
 * @param effect 
 */
export function triggerEffect(effect: ReactiveEffect) {
    effect.run()
}