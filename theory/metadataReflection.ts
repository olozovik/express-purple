import 'reflect-metadata';

const Inject =
    (key: string): ((target: Function) => void) =>
    (target: Function) => {
        Reflect.defineMetadata(key, 1, target);
        const meta = Reflect.getMetadata('a', target);
        console.log(meta);
    };

const Prop = (target: Object, name: string): void => {
    //
};
const obj = {};

@Inject('C')
export class C {
    @Prop prop: number;
}
