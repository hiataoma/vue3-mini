import { isFunction } from "@vue/shared"
import { Dep } from "./dep"
import { ReactiveEffect } from "./effect"
import { trackRefValue, triggerRefValue } from "./ref"


export class ComputedRefImpl<T> {

    public dep?: Dep = undefined
    private _value!: T

    public readonly effect: ReactiveEffect<T>
    public readonly __v_isRef = true

    /**
	 * 脏：为 false 时，表示需要触发依赖。为 true 时表示需要重新执行 run 方法，获取数据。即：数据脏了
	 */
    public _dirty = true
    
    constructor(getter) {
        this.effect = new ReactiveEffect(getter,() => {
            if(!this._dirty) {
                this._dirty = true
                triggerRefValue(this)
            }
        })
        this.effect.computed = this
    }

    get value() {
        trackRefValue(this) // 依赖收集
        if(this._dirty) { // 只有脏数据的时候才需要更新
            this._dirty = false
            this._value = this.effect.run() // why?
        }
        // 返回计算的真实值
        return this._value
    }
}

export function computed(getOrOptions) {
    let getter

    const onlyGetter = isFunction(getOrOptions)
    
    if(onlyGetter) {
        getter = getOrOptions
    }
    const cRef = new ComputedRefImpl(getter)

    return cRef
}