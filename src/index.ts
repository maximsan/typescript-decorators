type Instantiable = new (...args: any[]) => any;

function setFast(isFast: boolean) {
  return function makeFast<TClass extends Instantiable>(target: TClass) {
    return class Fast extends target {
      fast = isFast;
    };
  };
}

function setDescription(desc: string) {
  return function description<TClass extends Instantiable>(target: TClass) {
    return class Description extends target {
      description = desc;
    };
  };
}

function Uppercase(target: any, key: string) {
  let value = target[key];

  const get = () => value;
  const set = (newValue: string) => {
    value = newValue.toUpperCase();
  };

  Object.defineProperty(target, key, {
    get,
    set,
    configurable: true,
    enumerable: true
  });
}

@setFast(true)
@setDescription("super-fast")
class Car {
  @Uppercase
  name: string;
  speed: number;
  constructor(name: string, speed: number) {
    this.name = name;
    this.speed = speed;
  }

  @Logger
  setSpeed(speed: number) {
    this.speed = speed;
  }
}

function Logger(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`This is ${key} method`);

    const speed = args[0];
    if (speed > 200) {
      console.log("super fast car");
    }
    return original.apply(this, args);
  };

  return descriptor;
}

const buggati = new Car("Buggati", 220);

console.log(buggati);
console.log(buggati.name);
buggati.setSpeed(300);

// buggati.name = "Mersedes";
// console.log(buggati.name);
// console.log(buggati.description);
