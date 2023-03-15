import { track, trigger } from './effect'
/**
 * getter 回调方法
 */
const get = createGetter()

/**
 * 创建 getter 回调方法
 */
function createGetter() {
    return function get(target:object, key: string | symbol, reactiver: object) {
        let res = Reflect.get(target, key, reactiver)
        track(target, key)
        return res
    }
}


/**
 * setter 回调方法
 */
const set = createSetter()

/**
 * 创建 setter 回调方法
 */
function createSetter() {
    return function get(target:object, key: string | symbol, value: unknown, reactiver: object) {
        let result = Reflect.set(target, key, value, reactiver)
        trigger(target, key, value)
        return result
    }
}


/**
 * 响应性的 handler
 */
export const mutableHandlers: ProxyHandler<object> = {
	get,
	set
}
