 import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'

export const enum ReactiveFlags {
	IS_REACTIVE = '__v_isReactive'
}
 
 /**
  * WeakMap key 类型是object 指向obj
  * WeakMap value  是一个Map对象 其中key是指定的属性 value是执行函数fn
  */
 export const reactiveMap = new WeakMap<object, any>()
 
 export function reactive(target: object) {
    return createReactiveObject(target, mutableHandlers, reactiveMap)
 }


 function createReactiveObject(
    target: object,
    baseHandlers: ProxyHandler<any>,
    proxyMap: WeakMap<object, any>
 ){
    const existingProxy = proxyMap.get(target)
    if(existingProxy) {
        return existingProxy
    }
    const proxy = new Proxy(target, baseHandlers)

    proxy[ReactiveFlags.IS_REACTIVE] = true

 
    proxyMap.set(target,proxy)

    return proxy
 }

 /**
 * 将指定数据变为 reactive 数据
 */
export const toReactive = <T extends unknown>(value: T): T =>
   isObject(value) ? reactive(value as object) : value

/**
* 判断一个数据是否为 Reactive
*/
export function isReactive(value): boolean {
return !!(value && value[ReactiveFlags.IS_REACTIVE])
}
