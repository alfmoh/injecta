export declare class Injecta {
    private values;
    private services;
    private factories;
    private instancies;
    private dependenciesRepo;
    setValue(name: string, value: any): this;
    setService(name: string, value: Function): this;
    setFactory(name: string, value: Function): this;
    get(name: string): any;
    private _get(name);
    private getDependencies(func);
    private getArguments(func);
    private instansiateService(service, args);
    private processInput(name, value, objType);
}
