var Vue = (function (exports) {
    'use strict';

    /**
     * 收集依赖
     * @param target
     * @param key
     */
    function track(target, key) {
        console.log('收集依赖');
    }
    /**
     * 触发依赖
     * @param target
     * @param key
     * @param newValue
     */
    function trigger(target, key, newValue) {
        console.log('触发依赖');
    }

    /**
     * getter 回调方法
     */
    var get = createGetter();
    /**
     * 创建 getter 回调方法
     */
    function createGetter() {
        return function get(target, key, reactiver) {
            var res = Reflect.get(target, key, reactiver);
            track();
            return res;
        };
    }
    /**
     * setter 回调方法
     */
    var set = createSetter();
    /**
     * 创建 setter 回调方法
     */
    function createSetter() {
        return function get(target, key, value, reactiver) {
            var result = Reflect.set(target, key, value, reactiver);
            trigger();
            return result;
        };
    }
    /**
     * 响应性的 handler
     */
    var mutableHandlers = {
        get: get,
        set: set
    };

    var reactiveMap = new WeakMap();
    function reactive(target) {
        return createReactiveObject(target, mutableHandlers, reactiveMap);
    }
    function createReactiveObject(target, baseHandlers, proxyMap) {
        var existingProxy = proxyMap.get(target);
        if (existingProxy) {
            return existingProxy;
        }
        var proxy = new Proxy(target, baseHandlers);
        proxyMap.set(target, proxy);
        return proxy;
    }

    exports.reactive = reactive;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=vue.js.map
