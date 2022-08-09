type DecoratorReturnType = (target: Function) => void;

const Component = (id: number): DecoratorReturnType => {
    console.log('init component');
    return (target: Function) => {
        console.log('run component');
        target.prototype.id = 1;
    };
};

const Logger = (): DecoratorReturnType => {
    console.log('init logger');
    return (target: Function) => {
        console.log('run logger');
    };
};

const Method = (
    target: Object,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
): void => {
    propertyDescriptor.value = (...args: any[]): number => {
        return args[0] * 10;
    };
};

const Prop = (target: Object, propertyKey: string): void => {
    let value: number;
    const getter = (): number => {
        console.log('Get');
        return value;
    };
    const setter = (newValue: number): void => {
        console.log('Set');
        value = newValue;
    };

    Object.defineProperty(target, propertyKey, { get: getter, set: setter });
};

const Param = (target: Object, propertyKey: string, index: number): void => {
    console.log(propertyKey, index);
};

@Logger()
@Component(1)
export class User {
    @Prop id: number;

    @Method
    updateId(@Param newID: number): number {
        this.id = newID;
        return this.id;
    }
}

console.log(new User().id);
console.log(new User().updateId(2));
