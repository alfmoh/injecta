export class Injecta {
  private values = {};
  private services = {};
  private factories = {};
  private instancies = {};
  private dependenciesRepo = [];

  setValue(name: string, value: any): this {
    return this.processInput(name, value, this.values);
  }

  setService(name: string, value: Function): this {
    if (typeof value !== "function") {
      throw `${name} is not a function or class`;
    }
    return this.processInput(name, value, this.services);
  }

  setFactory(name: string, value: Function): this {
    if (typeof value !== "function") {
      throw `${name} is not a function or class`;
    }
    return this.processInput(name, value, this.factories);
  }

  get(name: string): any {
    this.dependenciesRepo = [];
    return this._get(name);
  }

  private _get(name: string): any {
    for (let i = 0, { length } = this.dependenciesRepo; i < length; i++) {
      if (this.dependenciesRepo[i] === name) {
        throw new Error(`"${name}" <-- circular dependency detected!`);
      }
    }

    this.dependenciesRepo = [name].concat(this.dependenciesRepo);

    if (typeof this.values[name] !== "undefined") {
      return this.values[name];
    }

    if (typeof this.instancies[name] !== "undefined") {
      return this.instancies[name];
    }

    if (typeof this.services[name] !== "undefined") {
      const ctor: Function = this.services[name];
      const dependencies: any[] = this.getDependencies(ctor);
      return (this.instancies[name] = this.instansiateService(
        ctor,
        dependencies
      ));
    }

    if (typeof this.factories[name] !== "undefined") {
      const factoryFunc: Function = this.factories[name];
      const dependencies: any[] = this.getDependencies(factoryFunc);
      return (this.instancies[name] = factoryFunc.apply(null, dependencies));
    }

    throw new Error(`"${name}" <-- dependency token not provided.`);
  }

  private getDependencies(func: Function): any[] {
    const args: string[] = this.getArguments(func);
    return args.map(arg => this._get(arg));
  }

  private getArguments(func: Function): [] | string[] {
    const FN_ARGS: RegExp = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    const STRIP_COMMENTS: RegExp = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

    const funcStringfy: string = func.toString();
    const args: string = funcStringfy
      .match(FN_ARGS)[1]
      .replace(/\s+/g, "")
      .replace(STRIP_COMMENTS, "");
    if (args === "") {
      return [];
    }
    return args.split(",");
  }

  private instansiateService(service: any, args: any[]): any {
    return new service(...args);
  }

  private processInput(name: string, value: any, objType: Object): this {
    objType[name] = value;
    return this;
  }
}
