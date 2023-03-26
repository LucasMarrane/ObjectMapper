# mapper-utils

## About

Utility class to transform an object into another.

## Installation

```shell
$ npm i mapper-utils
```

## Usage

It has two way to map an object, first one (`Mapper.createMap<IUser, IData>()`) is appending map item into a array and after all done its returns a mapped object, and second one is (`Mapper.createMap<IUser, IData>(param)`) thats changes an object by a key.

#### TSource & TDestination

`TSource` object that values will be transformed;
`TDestination` object that will receive all transformed values;

### Base for examples

```javascript
import { Mapper } from "mapper-utils";

interface IUser {
  name: string;
  surname: string;
  age: number;
}

interface IData {
  fullname: string;
  isUnderEigthteen: boolean;
}

const user: IUser = {
  age: 24,
  name: "Lucas",
  surname: "Marrane Siler",
};
```

#### CreateMap

```typescript
...

//this way is slow, because iterations for dynamic map
const UserSlow = Mapper.createMap<IUser, IData>()
    .forField('fullname', (from) => `${from?.name} ${from?.surname}`)
    .forField('isUnderEigthteen', (from) => <number>from?.age < 18)
    .map(user);

console.log(UserSlow); //{ fullname: 'Lucas Marrane Siler', isUnderEigthteen: false }

//this way is more faster
const User = MapperGenerator.createStaticMap<IUser, IData>(user)
    .forField('fullname', (from) => `${from?.name} ${from?.surname}`)
    .forField('isUnderEigthteen', (from) => <number>from?.age < 18)
    .map();

console.log(User); //{ fullname: 'Lucas Marrane Siler', isUnderEigthteen: false }

```

#### CreateMap for complex objects

```typescript
...

interface IComplex {
    user: IUser
}

const ComplexObject = Mapper.createMap<IUser, IComplex>()
    .forField<IUser>('user', (from) => ({age: from?.age, name:from?.name , surname: from?.surname}))
    .map(user);

//or
const ComplexObject = Mapper.createMap<IUser, IComplex>()
    .forField('user.age', (from) =>  from?.age)
    .forField('user.name', (from) =>  from?.name)
    .forField('user.surname', (from) =>  from?.surname)
    .map(user);


```

## Other features

It has some utils functions to manipulate objects.

