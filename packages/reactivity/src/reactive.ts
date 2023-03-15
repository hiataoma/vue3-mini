 import { mutableHandlers } from './baseHandlers'
 
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
 
    proxyMap.set(target,proxy)

    return proxy
 }