import { cloneObject, createNestedObject, createObject, isObjectFilled } from '../object';

type AllKeys<T, Prefix extends string = ''> = T extends object
    ? {
          [K in keyof T]-?: `${Prefix}${K extends string ? `${K}` : ''}` | AllKeys<T[K], `${Prefix}${K extends string ? `${K}` : ''}.`>;
      }[keyof T]
    : never;

type ItemMemberType = { key: string; value: string | Function };

type ConfigObject<T> = {
    keyFrom?: keyof T;
    keyTo?: string;
    callback?: Function;
};

export type MapperConfigType<T> = Record<string, keyof T | ConfigObject<T>>;

export class Mapper {
    /**
     * Create a mapper object.
     *
     *
     * @param TSource - generic type of origin object
     * @param TDestination - generic type of destination object
     */
    static createMap<TSource extends object = {}, TDestination extends object = {}>(objectFrom?: TSource, objectTo?: TDestination, config?: MapperConfigType<TSource>) {
        return new MapperBuilder(objectFrom, objectTo, config);
    }
}

class MapperBuilder<TSource extends object, TDestination extends object> {
    private _objectTo: TDestination;
    private _objectFrom: TSource;
    private _config: MapperConfigType<TSource>;
    private _members = new MapMember<TDestination>();

    constructor(objectFrom?: TSource, objectTo?: TDestination, config?: MapperConfigType<TSource>) {
        this._objectTo = createObject<TDestination>(objectTo);
        this._objectFrom = createObject<TSource>(objectFrom);
        this._config = createObject<MapperConfigType<TSource>>(config);
    }

    private addToDestination(to: string, from: keyof TSource | ((item?: TSource) => any)) {
        const x = createNestedObject(this._objectTo, to, typeof from === 'function' ? from(this._objectFrom) : (this._objectFrom[from] as any));
        this._objectTo = x;
    }

    /**
     * Add an attribute came from another object into a map.
     *
     * @param TCallbackReturn - type of return
     * @param to - attribute thats will receive the value
     * @param from - attribute thats will be set to another or callback function
     */
    public forField<TCallbackReturn>(to: AllKeys<TDestination>, from: keyof TSource | ((item?: TSource) => TCallbackReturn)) {
        this._members.addMember({ key: <string>to, value: <string | Function>from });
        this.addToDestination(<any>to, from);
        return this;
    }

    /**
     * Add a list of attribute came from another object into a map.
     * Make sure that return of callback (if exist) inside value, return the correct type of field.
     *
     * @param fields - tupple list that contains from(key of atribute), to(key of atribute) and a callback function
     */
    public forFields(fields: [key: AllKeys<TDestination>, value: keyof TSource | ((item?: TSource) => any)][]) {
        this._members.addMembers(fields as unknown as ItemMemberType[]);
        fields.forEach(([to, from]) => this.addToDestination(<string>to, from));
        return this;
    }

    /**
     * return a mapped object.
     *
     *
     * @param source - object that will be the source of a mapped object;
     * @param destination - An optional object that will be a mapped object, if its null a new object is created;
     */
    public map(source?: TSource, destination?: TDestination) {
        let objectReturn = this._objectTo;
        if (isObjectFilled(source)) {
            const from = source as TSource;
            const to = destination || ({} as TDestination);
            this._members.members.forEach((keyFrom: any, keyTo: any) => {
                to[<keyof TDestination>keyTo] = typeof keyFrom == 'function' ? keyFrom(from) : from[<keyof TSource>keyFrom];
            });
            objectReturn = to;
        }
        return cloneObject<TDestination>(objectReturn);
    }
}

class MapMember<TDestination extends object> {
    private _listMembers: Map<string, string | Function> = new Map();
    public addMember(member: ItemMemberType) {
        this.removeMember(member.key as keyof TDestination);
        this._listMembers.set(member.key, member.value);
    }
    public addMembers(members: ItemMemberType[]) {
        this.removeMembers(<(keyof TDestination)[]>members.map((member) => member[0]));

        members.forEach((member) => this._listMembers.set(member.key, member.value));
    }

    public getMember(member: keyof TDestination) {
        return this._listMembers.get(<string>member);
    }

    public removeMembers(properties: (keyof TDestination)[]) {
        properties.forEach((element) => {
            this.removeMember(element);
        });
    }
    public removeMember(property: keyof TDestination) {
        this._listMembers.delete(<string>property);
    }

    get members() {
        return this._listMembers;
    }
}
