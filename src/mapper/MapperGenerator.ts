type TypeItemMember = [string, string | Function];

export class MapperGenerator {
    /**
     * Create a mapper object.
     *
     *
     * @param TSource - generic type of origin object
     * @param TDestination - generic type of destination object
     */
    static createDinamycMap<
        TSource extends object,
        TDestination extends object
    >() {
        return new DinamycMapper<TSource, TDestination>();
    }

    static createStaticMap<TSource extends object, TDestination extends object>(
        objectFrom: TSource,
        objectTo?: TDestination
    ) {
        return new StaticMapper<TSource, TDestination>(objectFrom, objectTo);
    }
}

class DinamycMapper<TSource extends object, TDestination extends object>  {
    private _members = new MapperMember<TDestination>();

    /**
     * Add an attribute came from another object into a map.
     *
     *
     * @param to - attribute thats will receive the value
     * @param from - attribute thats will be set to another or callback function
     */
    forField(
        to: keyof TDestination,
        from: keyof TSource | ((item?: TSource) => any)
    ) {
        this._members.addMember([<string>to, <string | Function>from]);
        return this;
    }

    /**
     * Add a list of attribute came from another object into a map.
     *
     *
     * @param fields - tupple list that contains from(key of atribute), to(key of atribute) and a callback function
     */
    forFields(
        fields: [
            to: keyof TDestination,
            from: keyof TSource,
            callback?: (
                propertyValue?: TSource[keyof TSource],
                item?: TSource
            ) => any
        ][]
    ) {
        this._members.addMember(fields as unknown as TypeItemMember);
        return this;
    }

    /**
     * remove a field from map.
     *
     *
     * @param destinationField - field that will be removed from map
     */

    removeField(destinationField: keyof TDestination) {
        this._members.removeMember(destinationField);
        return this;
    }

    /**
     * remove a field list from  map.
     *
     *
     * @param destinationField - field that will be removed from map
     */

    removeFields(destinationFields: (keyof TDestination)[]) {
        this._members.removeMembers(destinationFields);
        return this;
    }

    /**
     * return a mapped object.
     *
     *
     * @param source - object that will be the source of a mapped object;
     * @param destination - An optional object that will be a mapped object, if its null a new object is created;
     */
    map(source: TSource, destination?: TDestination) {
        const from = source;
        const to = destination || ({} as TDestination);

        this._members.members.forEach(([keyTo, keyFrom]) => {
            to[<keyof TDestination>keyTo] =
                typeof keyFrom == 'function'
                    ? keyFrom(from)
                    : from[<keyof TSource>keyFrom];
        });

        return to;
    }
}

class StaticMapper<TSource extends object, TDestination extends object> {
    private _ObjectTo: TDestination;
    private _ObjectFrom: TSource;

    constructor(objectFrom: TSource, objectTo?: TDestination) {
        this._ObjectTo = { ...(objectTo || ({} as TDestination)) };
        this._ObjectFrom = { ...objectFrom };
    }

    /**
     * Add an attribute came from another object into a map.
     *
     *
     * @param to - attribute thats will receive the value
     * @param from - attribute thats will be set to another or callback function
     */
    forField(
        to: keyof TDestination,
        from: keyof TSource | ((item?: TSource) => any)
    ) {
        this.addToDestination(to, from);
        return this;
    }

    /**
     * Add a list of attribute came from another object into a map.
     *
     *
     * @param fields - tupple list that contains from(key of atribute), to(key of atribute) and a callback function
     */
    forFields(
        fields: [
            to: keyof TDestination,
            from: keyof TSource | ((item?: TSource) => any)
        ][]
    ) {
        fields.forEach(([to, from]) => this.addToDestination(to, from));
        return this;
    }

    /**
     * return a mapped object.
     *
     *
     * @param source - object that will be the source of a mapped object;
     * @param destination - An optional object that will be a mapped object, if its null a new object is created;
     */
    map() {
        return { ...this._ObjectTo };
    }

    private addToDestination(
        to: keyof TDestination,
        from: keyof TSource | ((item?: TSource) => any)
    ) {
        this._ObjectTo[to] =
            typeof from === 'function'
                ? from(this._ObjectFrom)
                : (this._ObjectFrom[from] as any);
    }
}

class MapperMember<TDestination extends object> {
    private _listMembers: TypeItemMember[] = new Array();
    public addMember(member: TypeItemMember) {
        this.removeMember(<keyof TDestination>member[0]);
        this._listMembers.push(member);
    }
    public addMembers(members: TypeItemMember[]) {
        this.removeMembers(
            <(keyof TDestination)[]>members.map((member) => member[0])
        );
        this._listMembers = [...this._listMembers.concat(members)];
    }

    public removeMembers(properties: (keyof TDestination)[]) {
        this._listMembers = [
            ...this._listMembers.filter(
                ([destination]) =>
                    !properties.includes(<keyof TDestination>destination)
            ),
        ];
    }
    public removeMember(property: keyof TDestination) {
        this._listMembers = [
            ...this._listMembers.filter(
                ([destination]) => property !== destination
            ),
        ];
    }

    get members() {
        return this._listMembers;
    }
}
