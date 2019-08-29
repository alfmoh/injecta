"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var injecta_1 = require("./injecta");
var chai_1 = require("chai");
// tslint:disable:typedef
describe("injecta", function () {
    var injecta;
    beforeEach(function () {
        injecta = new injecta_1.Injecta();
    });
    it("should have a working test condition", function () {
        chai_1.expect(true).to.not.equal(false);
    });
    // tslint:disable:no-string-literal
    describe("private methods", function () {
        describe("get arguments", function () {
            it("should process a no args function", function () {
                // arrange
                var func = function () { };
                // act
                var result = injecta["getArguments"](func);
                // assert
                chai_1.expect(result).to.deep.equal([]);
            });
            it("should process an empty args but spaced function", function () {
                // arrange
                var func = function () { };
                // act
                var result = injecta["getArguments"](func);
                // assert
                chai_1.expect(result).to.deep.equal([]);
            });
            it("should process a single arg function", function () {
                // arrange
                var func = function (foo) { };
                // act
                var result = injecta["getArguments"](func);
                // assert
                chai_1.expect(result).to.deep.equal(["foo"]);
            });
            it("should process a single but spaced arg function", function () {
                // arrange
                var func = function (foo) { };
                // act
                var result = injecta["getArguments"](func);
                // assert
                chai_1.expect(result).to.deep.equal(["foo"]);
            });
            it("should process a multiple arg function", function () {
                // arrange
                var func = function (foo, bar) { };
                // act
                var result = injecta["getArguments"](func);
                // assert
                chai_1.expect(result).to.deep.equal(["foo", "bar"]);
            });
            it("should process a multiple but spaced arg function", function () {
                // arrange
                var func = function (foo, bar, wow, really) { };
                // act
                var result = injecta["getArguments"](func);
                // assert
                chai_1.expect(result).to.deep.equal(["foo", "bar", "wow", "really"]);
            });
            it("should process a multiple but spaced and commented arg function", function () {
                // arrange
                var func = function (
                /** comment */ foo, bar, 
                /** comment again */ wow, really) { };
                // act
                var result = injecta["getArguments"](func);
                // assert
                chai_1.expect(result).to.deep.equal(["foo", "bar", "wow", "really"]);
            });
        });
        describe("instansiate service", function () {
            it("should instansiate class", function () {
                // arrange
                var Service = /** @class */ (function () {
                    function Service(a, b) {
                        this.a = a;
                        this.b = b;
                    }
                    return Service;
                }());
                // act
                var result = injecta["instansiateService"](Service, [1, 2]);
                // assert
                chai_1.expect(result.a).to.equal(1);
                chai_1.expect(result.b).to.equal(2);
            });
            it("should instansiate function", function () {
                // arrange
                function Service(a, b) {
                    this.a = a;
                    this.b = b;
                }
                // act
                var result = injecta["instansiateService"](Service, [1, 2]);
                // assert
                chai_1.expect(result.a).to.equal(1);
                chai_1.expect(result.b).to.equal(2);
            });
            it("should instantiate class and reference props on prototype", function () {
                // arrange
                var Service = /** @class */ (function () {
                    function Service(a, b) {
                        this.a = a;
                        this.b = b;
                    }
                    return Service;
                }());
                Service.prototype.init = function (a, b) {
                    this.a = a;
                    this.b = b;
                };
                // act
                var result = injecta["instansiateService"](Service, [1, 2]);
                // assert
                chai_1.expect(result.a).to.equal(1);
                chai_1.expect(result.b).to.equal(2);
                chai_1.expect(result.init).to.deep.equal(Service.prototype.init);
                chai_1.expect(result.constructor).to.equal(Service);
            });
        });
    });
    describe("public methods", function () {
        describe("values", function () {
            it("should process a value", function () {
                // arrange
                var val = injecta.setValue("a", 1);
                // act
                // assert
                chai_1.expect(val.get("a")).to.be.equal(1);
            });
            it("should process empty strings", function () {
                // arrange
                var val = injecta.setValue("", 1);
                // act
                // assert
                chai_1.expect(val.get("")).to.be.equal(1);
            });
            it("should process values", function () {
                // arrange
                var val = injecta.setValue("a", 1);
                // act
                val.setValue("b", 2);
                // assert
                chai_1.expect(val.get("a")).to.be.equal(1);
                chai_1.expect(val.get("b")).to.be.equal(2);
            });
        });
        describe("factories", function () {
            it("should process empty args function", function () {
                // arrange
                var func = injecta.setFactory("funky", function () { return 1; });
                // act
                var result = func.get("funky");
                // assert
                chai_1.expect(result).to.equal(1);
            });
            it("should process args function", function () {
                // arrange
                injecta.setValue("val", 3);
                var func = injecta.setFactory("funky", function (val) { return val; });
                // act
                var result = func.get("funky");
                // assert
                chai_1.expect(result).to.equal(3);
            });
            it("should return same instance for factories", function () {
                // arrange
                var Fact = /** @class */ (function () {
                    function Fact() {
                    }
                    return Fact;
                }());
                // act
                injecta.setFactory("fac", function () {
                    return new Fact();
                });
                var fac1 = injecta.get("fac");
                var fac2 = injecta.get("fac");
                // assert
                chai_1.expect(fac1).to.equal(fac2);
            });
            it("should throw an error if function/class not passed as second arg", function () {
                // arrange
                var service;
                // act
                service = function () { return injecta.setService.call(null, "serv", []); };
                // assert
                chai_1.expect(service).to.throw("serv is not a function or class");
            });
            describe("services", function () {
                it("should pass in service arguments", function () {
                    // arrange
                    var Service = /** @class */ (function () {
                        function Service(valA, valB) {
                            this.valA = valA;
                            this.valB = valB;
                        }
                        Service.prototype.sum = function () {
                            return this.valA + this.valB;
                        };
                        return Service;
                    }());
                    // act
                    var setter = injecta
                        .setValue("valA", 2)
                        .setValue("valB", 3)
                        .setService("serv", Service);
                    var result = setter.get("serv");
                    // assert
                    chai_1.expect(result.sum()).to.equal(5);
                });
                it("should throw an error if function/class not passed as second arg", function () {
                    // arrange
                    var factory;
                    // act
                    factory = function () { return injecta.setFactory.call(null, "arr", []); };
                    // assert
                    chai_1.expect(factory).to.throw("arr is not a function or class");
                });
                it("should throw an exception if service parameter is not registered", function () {
                    // arrange
                    var Service = /** @class */ (function () {
                        function Service(valA, valB) {
                            this.valA = valA;
                            this.valB = valB;
                        }
                        Service.prototype.sum = function () {
                            return this.valA + this.valB;
                        };
                        return Service;
                    }());
                    // act
                    var setter = injecta
                        .setValue("valA", 2)
                        .setService("serv", Service);
                    // assert
                    chai_1.expect(function () { return setter.get("serv"); }).to.throw("\"valB\" <-- dependency token not provided.");
                });
                it("should throw an exception if there is a circular dependency", function () {
                    // arrange
                    var Service = /** @class */ (function () {
                        function Service(serv2) {
                        }
                        return Service;
                    }());
                    var Service2 = /** @class */ (function () {
                        function Service2(serv) {
                        }
                        return Service2;
                    }());
                    var Controller = /** @class */ (function () {
                        function Controller(serv, serv2) {
                        }
                        return Controller;
                    }());
                    // act
                    var setter = injecta
                        .setValue("serv", Service)
                        .setService("serv2", Service2)
                        .setFactory("fact", function (serv, serv2) {
                        return new Controller(serv, serv2);
                    });
                    // assert
                    chai_1.expect(function () { return setter.get("fact"); }).to.throw("\"serv\" <-- circular dependency detected!");
                });
            });
        });
    });
});
