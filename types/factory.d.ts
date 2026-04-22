declare function _default<C extends abstract new (...args: any[]) => object>(Class: C): new (target: InstanceType<C>) => InstanceType<C>;
export default _default;
