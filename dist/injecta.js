"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Injecta = /** @class */ (function () {
    function Injecta() {
        this.values = {};
        this.services = {};
        this.factories = {};
        this.instancies = {};
        this.dependenciesRepo = [];
    }
    Injecta.prototype.setValue = function (name, value) {
        return this.processInput(name, value, this.values);
    };
    Injecta.prototype.setService = function (name, value) {
        if (typeof value !== "function") {
            throw name + " is not a function or class";
        }
        return this.processInput(name, value, this.services);
    };
    Injecta.prototype.setFactory = function (name, value) {
        if (typeof value !== "function") {
            throw name + " is not a function or class";
        }
        return this.processInput(name, value, this.factories);
    };
    Injecta.prototype.get = function (name) {
        this.dependenciesRepo = [];
        return this._get(name);
    };
    Injecta.prototype._get = function (name) {
        for (var i = 0, length_1 = this.dependenciesRepo.length; i < length_1; i++) {
            if (this.dependenciesRepo[i] === name) {
                throw new Error("\"" + name + "\" <-- circular dependency detected!");
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
            var ctor = this.services[name];
            var dependencies = this.getDependencies(ctor);
            return (this.instancies[name] = this.instansiateService(ctor, dependencies));
        }
        if (typeof this.factories[name] !== "undefined") {
            var factoryFunc = this.factories[name];
            var dependencies = this.getDependencies(factoryFunc);
            return (this.instancies[name] = factoryFunc.apply(null, dependencies));
        }
        throw new Error("\"" + name + "\" <-- dependency token not provided.");
    };
    Injecta.prototype.getDependencies = function (func) {
        var _this = this;
        var args = this.getArguments(func);
        return args.map(function (arg) { return _this._get(arg); });
    };
    Injecta.prototype.getArguments = function (func) {
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
        var funcStringfy = func.toString();
        var args = funcStringfy
            .match(FN_ARGS)[1]
            .replace(/\s+/g, "")
            .replace(STRIP_COMMENTS, "");
        if (args === "") {
            return [];
        }
        return args.split(",");
    };
    Injecta.prototype.instansiateService = function (service, args) {
        return new (service.bind.apply(service, [void 0].concat(args)))();
    };
    Injecta.prototype.processInput = function (name, value, objType) {
        objType[name] = value;
        return this;
    };
    return Injecta;
}());
exports.Injecta = Injecta;
