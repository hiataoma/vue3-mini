# Vue响应式逻辑代码

<!-- effect -->

1.生成ReactiveEffects 实例
2.触发fn方法，从而激活getter
3.建立targetMao和activeEffect之间的关系
  1.dep.add(activeEffect)
  2.activeEffect.deps.push(dep)

  <!--   -->
1.修改obj当前的值
2.出发targetMap下保存的fn函数