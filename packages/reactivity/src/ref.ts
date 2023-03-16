import { hasChanged } from "@vue/shared"
import { Dep, createDep } from "./dep"
import { activeEffect, trackEffects, triggerEffects } from "./effect"
import { toReactive } from "./reactive"

export interface Ref<T = any> {
	value: T
}

/**
 * 
 * @param value 响应变量参数 可不传
 * @returns 
 */
export function ref(value?: unknown) {
    return createRef(value, false)
}


function createRef(rawVlaue: unknown, shallow: boolean) {

    // 如果是ref数据不需要做处理,直接return出去
    if(isRef(rawVlaue)) {
        return
    }
    // 重新构建
    return new RefImpl(rawVlaue, shallow)

}

class RefImpl<T> {
	private _value: T
	private _rawValue: T

	public dep?: Dep = undefined

	// 是否为 ref 类型数据的标记
	public readonly __v_isRef = true

	constructor(value: T, public readonly __v_isShallow: boolean) {
		// 如果 __v_isShallow 为 true，则 value 不会被转化为 reactive 数据，即如果当前 value 为复杂数据类型，则会失去响应性。对应官方文档 shallowRef ：https://cn.vuejs.org/api/reactivity-advanced.html#shallowref
		this._value = __v_isShallow ? value : toReactive(value)

		// 原始数据
		this._rawValue = value
	}

	/**
	 * get 语法将对象属性绑定到查询该属性时将被调用的函数。
	 * 即：xxx.value 时触发该函数
	 */
	get value() {
		// 收集依赖
		trackRefValue(this)
		return this._value
	}

	set value(newVal) {
		/**
		 * newVal 为新数据
		 * this._rawValue 为旧数据（原始数据）
		 * 对比两个数据是否发生了变化
		 */
		if (hasChanged(newVal, this._rawValue)) {
			// 更新原始数据
			this._rawValue = newVal
			// 更新 .value 的值
			this._value = toReactive(newVal)
			// 触发依赖
			triggerRefValue(this)
		}
	}
}
/**
 * ref 依赖收集
 * @param ref 
 */

export function trackRefValue(ref) {
    // console.log('触发依赖收集')
    if(activeEffect) {
        trackEffects(ref.dep || (ref.dep = createDep()))
    }
}

/**
 * ref 依赖触发
 * @param ref 
 */
export function triggerRefValue(ref) {
    if (ref.dep) {
		triggerEffects(ref.dep)
	}
}

/**
 * 指定数据是否为 RefImpl 类型
 */
export function isRef(r: any): r is Ref {
	return !!(r && r.__v_isRef === true)
}
