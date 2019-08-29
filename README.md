# injecta
A simple AngularJs or Angular-style typescript and javascript dependency injection library.

## Import
`import { injecta } from "injecta"`

## Usage
```ts
class UserService {
  constructor(private url:string){}
}

class Controller {
  constructor(private service: UserService, private data:any[]){}

  double(){
    return this.data.map(x=>x*2);
  }
}


const injecta = new Injecta();

/* Setting tokens*/

injecta
	.setValue("url", "/getUsers")
	.setValue("someValues", [1, 2, 3])
	.setService("userService", UserService)
	.setFactory("controller", function (userService, someValues) {
		return new Controller(userService, someValues);
	});


/* Getting token values*/

const ctrl = injecta.get("controller");
const data = injecta.get("someValues");
const val = injecta.get("url");

console.log(val); // /getUsers
console.log(data); // [1, 2, 3]
console.log(ctrl); // Controller {service: {…}, data: Array[3]} <-- controller instance with resolved dependencies
console.log(ctrl.double()); // [2, 4, 6]
```

## Install Choices
- `npm install injecta`
- [download the zip](https://github.com/alfmoh/injecta/archive/master.zip)
- [clone the repo](https://github.com/alfmoh/injecta.git)

## License

(The MIT License)

[MIT License](https://alfmo.mit-license.org/)