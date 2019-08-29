import { Injecta } from "./injecta";
import { expect } from "chai";

// tslint:disable:typedef
describe("injecta", () => {
  let injecta: Injecta;
  beforeEach(() => {
    injecta = new Injecta();
  });

  it("should have a working test condition", () => {
    expect(true).to.not.equal(false);
  });

  // tslint:disable:no-string-literal
  describe("private methods", () => {
    describe("get arguments", () => {
      it("should process a no args function", () => {
        // arrange
        const func = () => {};
        // act
        const result = injecta["getArguments"](func);
        // assert
        expect(result).to.deep.equal([]);
      });
      it("should process an empty args but spaced function", () => {
        // arrange
        const func = () => {};
        // act
        const result = injecta["getArguments"](func);
        // assert
        expect(result).to.deep.equal([]);
      });
      it("should process a single arg function", () => {
        // arrange
        const func = foo => {};
        // act
        const result = injecta["getArguments"](func);
        // assert
        expect(result).to.deep.equal(["foo"]);
      });
      it("should process a single but spaced arg function", () => {
        // arrange
        const func = foo => {};
        // act
        const result = injecta["getArguments"](func);
        // assert
        expect(result).to.deep.equal(["foo"]);
      });
      it("should process a multiple arg function", () => {
        // arrange
        const func = (foo, bar) => {};
        // act
        const result = injecta["getArguments"](func);
        // assert
        expect(result).to.deep.equal(["foo", "bar"]);
      });
      it("should process a multiple but spaced arg function", () => {
        // arrange
        const func = (foo, bar, wow, really) => {};
        // act
        const result = injecta["getArguments"](func);
        // assert
        expect(result).to.deep.equal(["foo", "bar", "wow", "really"]);
      });
      it("should process a multiple but spaced and commented arg function", () => {
        // arrange
        const func = (
          /** comment */ foo,
          bar,
          /** comment again */ wow,
          really
        ) => {};
        // act
        const result = injecta["getArguments"](func);
        // assert
        expect(result).to.deep.equal(["foo", "bar", "wow", "really"]);
      });
    });

    describe("instansiate service", () => {
      it("should instansiate class", () => {
        // arrange
        class Service {
          constructor(public a, public b) {}
        }

        // act
        const result: any = injecta["instansiateService"](Service, [1, 2]);

        // assert
        expect(result.a).to.equal(1);
        expect(result.b).to.equal(2);
      });
      it("should instansiate function", () => {
        // arrange
        function Service(a, b) {
          this.a = a;
          this.b = b;
        }

        // act
        const result: any = injecta["instansiateService"](Service, [1, 2]);

        // assert
        expect(result.a).to.equal(1);
        expect(result.b).to.equal(2);
      });
      it("should instantiate class and reference props on prototype", () => {
        // arrange
        class Service {
          constructor(public a, public b) {}
        }
        (<any>Service.prototype).init = function(a, b) {
          this.a = a;
          this.b = b;
        };

        // act
        const result = injecta["instansiateService"](Service, [1, 2]);
        // assert
        expect(result.a).to.equal(1);
        expect(result.b).to.equal(2);
        expect(result.init).to.deep.equal((<any>Service.prototype).init);
        expect(result.constructor).to.equal(Service);
      });
    });
  });

  describe("public methods", () => {
    describe("values", () => {
      it("should process a value", () => {
        // arrange
        const val = injecta.setValue("a", 1);
        // act
        // assert
        expect(val.get("a")).to.be.equal(1);
      });
      it("should process empty strings", () => {
        // arrange
        const val = injecta.setValue("", 1);
        // act
        // assert
        expect(val.get("")).to.be.equal(1);
      });
      it("should process values", () => {
        // arrange
        const val = injecta.setValue("a", 1);
        // act
        val.setValue("b", 2);
        // assert
        expect(val.get("a")).to.be.equal(1);
        expect(val.get("b")).to.be.equal(2);
      });
    });
    describe("factories", () => {
      it("should process empty args function", () => {
        // arrange
        const func = injecta.setFactory("funky", () => 1);

        // act
        const result = func.get("funky");
        // assert
        expect(result).to.equal(1);
      });
      it("should process args function", () => {
        // arrange
        injecta.setValue("val", 3);
        const func = injecta.setFactory("funky", val => val);

        // act
        const result = func.get("funky");
        // assert
        expect(result).to.equal(3);
      });
      it("should return same instance for factories", () => {
        // arrange
        class Fact {}

        // act
        injecta.setFactory("fac", () => {
          return new Fact();
        });
        const fac1 = injecta.get("fac");
        const fac2 = injecta.get("fac");

        // assert
        expect(fac1).to.equal(fac2);
      });
      it("should throw an error if function/class not passed as second arg", () => {
        // arrange
        let service;
        // act
        service = () => injecta.setService.call(null, "serv", []);
        // assert
        expect(service).to.throw("serv is not a function or class");
      });

      describe("services", () => {
        it("should pass in service arguments", () => {
          // arrange
          class Service {
            constructor(private valA, private valB) {}

            sum() {
              return this.valA + this.valB;
            }
          }

          // act
          const setter = injecta
            .setValue("valA", 2)
            .setValue("valB", 3)
            .setService("serv", Service);

          const result: Service = setter.get("serv");

          // assert
          expect(result.sum()).to.equal(5);
        });
        it("should throw an error if function/class not passed as second arg", () => {
          // arrange
          let factory;
          // act
          factory = () => injecta.setFactory.call(null, "arr", []);
          // assert
          expect(factory).to.throw("arr is not a function or class");
        });
        it("should throw an exception if service parameter is not registered", () => {
          // arrange
          class Service {
            constructor(private valA, private valB) {}

            sum() {
              return this.valA + this.valB;
            }
          }

          // act
          const setter = injecta
            .setValue("valA", 2)
            .setService("serv", Service);

          // assert
          expect(() => setter.get("serv")).to.throw(
            "\"valB\" <-- dependency token not provided."
          );
        });
        it("should throw an exception if there is a circular dependency", () => {
          // arrange
          class Service {
            constructor(serv2: Service2) {}
          }

          class Service2 {
            constructor(serv: Service) {}
          }

          class Controller {
            constructor(serv, serv2) {}
          }

          // act
          const setter = injecta
            .setValue("serv", Service)
            .setService("serv2", Service2)
            .setFactory("fact", (serv, serv2) => {
              return new Controller(serv, serv2);
            });

          // assert
          expect(() => setter.get("fact")).to.throw(
            "\"serv\" <-- circular dependency detected!"
          );
        });
      });
    });
  });
});
