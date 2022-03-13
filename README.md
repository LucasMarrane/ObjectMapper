# mapper-utils

## About

Utility class to transform an object into another.

## Installation

```shell
$ npm i mapper-utils
```

## Usage

It has two way to map an object, first one (`MapperGenerator.createDinamycMap`) is appending map item into a array and after all done its returns a mapped object, and second one is  (`MapperGenerator.createStaticMap`) thats changes an object by a key.

#### TSource & TDestination
`TSource` object that values will be transformed;
`TDestination` object that will receive all transformed values;


### Base for examples
```javascript
import { MapperGenerator } from 'mapper-utils'

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
    name:'Lucas',
    surname: 'Marrane Siler'   
};
```

#### CreateDynamicMap 


```typescript
...


const object = MapperGenerator.createDynamicMap<IUser, IData>()
    .forField('fullname', (from) => `${from?.name} ${from?.surname}`)
    .forField('isUnderEigthteen', (from) => <number>from?.age < 18)
    .map(user);

console.log(object); //{ fullname: 'Lucas Marrane Siler', isUnderEigthteen: false }

```

#### CreateStaticMap 


```typescript
...


const object = MapperGenerator.createStaticMap<IUser, IData>(user)
    .forField('fullname', (from) => `${from?.name} ${from?.surname}`)
    .forField('isUnderEigthteen', (from) => <number>from?.age < 18)
    .map();

console.log(object); //{ fullname: 'Lucas Marrane Siler', isUnderEigthteen: false }

```

