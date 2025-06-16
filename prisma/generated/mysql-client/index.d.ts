
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model light
 * 
 */
export type light = $Result.DefaultSelection<Prisma.$lightPayload>
/**
 * Model temperature
 * 
 */
export type temperature = $Result.DefaultSelection<Prisma.$temperaturePayload>
/**
 * Model humidity
 * 
 */
export type humidity = $Result.DefaultSelection<Prisma.$humidityPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Lights
 * const lights = await prisma.light.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Lights
   * const lights = await prisma.light.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.light`: Exposes CRUD operations for the **light** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lights
    * const lights = await prisma.light.findMany()
    * ```
    */
  get light(): Prisma.lightDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.temperature`: Exposes CRUD operations for the **temperature** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Temperatures
    * const temperatures = await prisma.temperature.findMany()
    * ```
    */
  get temperature(): Prisma.temperatureDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.humidity`: Exposes CRUD operations for the **humidity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Humidities
    * const humidities = await prisma.humidity.findMany()
    * ```
    */
  get humidity(): Prisma.humidityDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.9.0
   * Query Engine version: 81e4af48011447c3cc503a190e86995b66d2a28e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    light: 'light',
    temperature: 'temperature',
    humidity: 'humidity'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "light" | "temperature" | "humidity"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      light: {
        payload: Prisma.$lightPayload<ExtArgs>
        fields: Prisma.lightFieldRefs
        operations: {
          findUnique: {
            args: Prisma.lightFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lightPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.lightFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lightPayload>
          }
          findFirst: {
            args: Prisma.lightFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lightPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.lightFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lightPayload>
          }
          findMany: {
            args: Prisma.lightFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lightPayload>[]
          }
          create: {
            args: Prisma.lightCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lightPayload>
          }
          createMany: {
            args: Prisma.lightCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.lightDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lightPayload>
          }
          update: {
            args: Prisma.lightUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lightPayload>
          }
          deleteMany: {
            args: Prisma.lightDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.lightUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.lightUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lightPayload>
          }
          aggregate: {
            args: Prisma.LightAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLight>
          }
          groupBy: {
            args: Prisma.lightGroupByArgs<ExtArgs>
            result: $Utils.Optional<LightGroupByOutputType>[]
          }
          count: {
            args: Prisma.lightCountArgs<ExtArgs>
            result: $Utils.Optional<LightCountAggregateOutputType> | number
          }
        }
      }
      temperature: {
        payload: Prisma.$temperaturePayload<ExtArgs>
        fields: Prisma.temperatureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.temperatureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temperaturePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.temperatureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temperaturePayload>
          }
          findFirst: {
            args: Prisma.temperatureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temperaturePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.temperatureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temperaturePayload>
          }
          findMany: {
            args: Prisma.temperatureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temperaturePayload>[]
          }
          create: {
            args: Prisma.temperatureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temperaturePayload>
          }
          createMany: {
            args: Prisma.temperatureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.temperatureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temperaturePayload>
          }
          update: {
            args: Prisma.temperatureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temperaturePayload>
          }
          deleteMany: {
            args: Prisma.temperatureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.temperatureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.temperatureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temperaturePayload>
          }
          aggregate: {
            args: Prisma.TemperatureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemperature>
          }
          groupBy: {
            args: Prisma.temperatureGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemperatureGroupByOutputType>[]
          }
          count: {
            args: Prisma.temperatureCountArgs<ExtArgs>
            result: $Utils.Optional<TemperatureCountAggregateOutputType> | number
          }
        }
      }
      humidity: {
        payload: Prisma.$humidityPayload<ExtArgs>
        fields: Prisma.humidityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.humidityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$humidityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.humidityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$humidityPayload>
          }
          findFirst: {
            args: Prisma.humidityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$humidityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.humidityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$humidityPayload>
          }
          findMany: {
            args: Prisma.humidityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$humidityPayload>[]
          }
          create: {
            args: Prisma.humidityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$humidityPayload>
          }
          createMany: {
            args: Prisma.humidityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.humidityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$humidityPayload>
          }
          update: {
            args: Prisma.humidityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$humidityPayload>
          }
          deleteMany: {
            args: Prisma.humidityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.humidityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.humidityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$humidityPayload>
          }
          aggregate: {
            args: Prisma.HumidityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHumidity>
          }
          groupBy: {
            args: Prisma.humidityGroupByArgs<ExtArgs>
            result: $Utils.Optional<HumidityGroupByOutputType>[]
          }
          count: {
            args: Prisma.humidityCountArgs<ExtArgs>
            result: $Utils.Optional<HumidityCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    light?: lightOmit
    temperature?: temperatureOmit
    humidity?: humidityOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model light
   */

  export type AggregateLight = {
    _count: LightCountAggregateOutputType | null
    _avg: LightAvgAggregateOutputType | null
    _sum: LightSumAggregateOutputType | null
    _min: LightMinAggregateOutputType | null
    _max: LightMaxAggregateOutputType | null
  }

  export type LightAvgAggregateOutputType = {
    id: number | null
    val: number | null
  }

  export type LightSumAggregateOutputType = {
    id: number | null
    val: number | null
  }

  export type LightMinAggregateOutputType = {
    id: number | null
    val: number | null
    created_at: Date | null
  }

  export type LightMaxAggregateOutputType = {
    id: number | null
    val: number | null
    created_at: Date | null
  }

  export type LightCountAggregateOutputType = {
    id: number
    val: number
    created_at: number
    _all: number
  }


  export type LightAvgAggregateInputType = {
    id?: true
    val?: true
  }

  export type LightSumAggregateInputType = {
    id?: true
    val?: true
  }

  export type LightMinAggregateInputType = {
    id?: true
    val?: true
    created_at?: true
  }

  export type LightMaxAggregateInputType = {
    id?: true
    val?: true
    created_at?: true
  }

  export type LightCountAggregateInputType = {
    id?: true
    val?: true
    created_at?: true
    _all?: true
  }

  export type LightAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which light to aggregate.
     */
    where?: lightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lights to fetch.
     */
    orderBy?: lightOrderByWithRelationInput | lightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: lightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned lights
    **/
    _count?: true | LightCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LightAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LightSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LightMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LightMaxAggregateInputType
  }

  export type GetLightAggregateType<T extends LightAggregateArgs> = {
        [P in keyof T & keyof AggregateLight]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLight[P]>
      : GetScalarType<T[P], AggregateLight[P]>
  }




  export type lightGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: lightWhereInput
    orderBy?: lightOrderByWithAggregationInput | lightOrderByWithAggregationInput[]
    by: LightScalarFieldEnum[] | LightScalarFieldEnum
    having?: lightScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LightCountAggregateInputType | true
    _avg?: LightAvgAggregateInputType
    _sum?: LightSumAggregateInputType
    _min?: LightMinAggregateInputType
    _max?: LightMaxAggregateInputType
  }

  export type LightGroupByOutputType = {
    id: number
    val: number
    created_at: Date
    _count: LightCountAggregateOutputType | null
    _avg: LightAvgAggregateOutputType | null
    _sum: LightSumAggregateOutputType | null
    _min: LightMinAggregateOutputType | null
    _max: LightMaxAggregateOutputType | null
  }

  type GetLightGroupByPayload<T extends lightGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LightGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LightGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LightGroupByOutputType[P]>
            : GetScalarType<T[P], LightGroupByOutputType[P]>
        }
      >
    >


  export type lightSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    val?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["light"]>



  export type lightSelectScalar = {
    id?: boolean
    val?: boolean
    created_at?: boolean
  }

  export type lightOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "val" | "created_at", ExtArgs["result"]["light"]>

  export type $lightPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "light"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      val: number
      created_at: Date
    }, ExtArgs["result"]["light"]>
    composites: {}
  }

  type lightGetPayload<S extends boolean | null | undefined | lightDefaultArgs> = $Result.GetResult<Prisma.$lightPayload, S>

  type lightCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<lightFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LightCountAggregateInputType | true
    }

  export interface lightDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['light'], meta: { name: 'light' } }
    /**
     * Find zero or one Light that matches the filter.
     * @param {lightFindUniqueArgs} args - Arguments to find a Light
     * @example
     * // Get one Light
     * const light = await prisma.light.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends lightFindUniqueArgs>(args: SelectSubset<T, lightFindUniqueArgs<ExtArgs>>): Prisma__lightClient<$Result.GetResult<Prisma.$lightPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Light that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {lightFindUniqueOrThrowArgs} args - Arguments to find a Light
     * @example
     * // Get one Light
     * const light = await prisma.light.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends lightFindUniqueOrThrowArgs>(args: SelectSubset<T, lightFindUniqueOrThrowArgs<ExtArgs>>): Prisma__lightClient<$Result.GetResult<Prisma.$lightPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Light that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lightFindFirstArgs} args - Arguments to find a Light
     * @example
     * // Get one Light
     * const light = await prisma.light.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends lightFindFirstArgs>(args?: SelectSubset<T, lightFindFirstArgs<ExtArgs>>): Prisma__lightClient<$Result.GetResult<Prisma.$lightPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Light that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lightFindFirstOrThrowArgs} args - Arguments to find a Light
     * @example
     * // Get one Light
     * const light = await prisma.light.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends lightFindFirstOrThrowArgs>(args?: SelectSubset<T, lightFindFirstOrThrowArgs<ExtArgs>>): Prisma__lightClient<$Result.GetResult<Prisma.$lightPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lights that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lightFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lights
     * const lights = await prisma.light.findMany()
     * 
     * // Get first 10 Lights
     * const lights = await prisma.light.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lightWithIdOnly = await prisma.light.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends lightFindManyArgs>(args?: SelectSubset<T, lightFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lightPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Light.
     * @param {lightCreateArgs} args - Arguments to create a Light.
     * @example
     * // Create one Light
     * const Light = await prisma.light.create({
     *   data: {
     *     // ... data to create a Light
     *   }
     * })
     * 
     */
    create<T extends lightCreateArgs>(args: SelectSubset<T, lightCreateArgs<ExtArgs>>): Prisma__lightClient<$Result.GetResult<Prisma.$lightPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lights.
     * @param {lightCreateManyArgs} args - Arguments to create many Lights.
     * @example
     * // Create many Lights
     * const light = await prisma.light.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends lightCreateManyArgs>(args?: SelectSubset<T, lightCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Light.
     * @param {lightDeleteArgs} args - Arguments to delete one Light.
     * @example
     * // Delete one Light
     * const Light = await prisma.light.delete({
     *   where: {
     *     // ... filter to delete one Light
     *   }
     * })
     * 
     */
    delete<T extends lightDeleteArgs>(args: SelectSubset<T, lightDeleteArgs<ExtArgs>>): Prisma__lightClient<$Result.GetResult<Prisma.$lightPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Light.
     * @param {lightUpdateArgs} args - Arguments to update one Light.
     * @example
     * // Update one Light
     * const light = await prisma.light.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends lightUpdateArgs>(args: SelectSubset<T, lightUpdateArgs<ExtArgs>>): Prisma__lightClient<$Result.GetResult<Prisma.$lightPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lights.
     * @param {lightDeleteManyArgs} args - Arguments to filter Lights to delete.
     * @example
     * // Delete a few Lights
     * const { count } = await prisma.light.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends lightDeleteManyArgs>(args?: SelectSubset<T, lightDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lightUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lights
     * const light = await prisma.light.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends lightUpdateManyArgs>(args: SelectSubset<T, lightUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Light.
     * @param {lightUpsertArgs} args - Arguments to update or create a Light.
     * @example
     * // Update or create a Light
     * const light = await prisma.light.upsert({
     *   create: {
     *     // ... data to create a Light
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Light we want to update
     *   }
     * })
     */
    upsert<T extends lightUpsertArgs>(args: SelectSubset<T, lightUpsertArgs<ExtArgs>>): Prisma__lightClient<$Result.GetResult<Prisma.$lightPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lightCountArgs} args - Arguments to filter Lights to count.
     * @example
     * // Count the number of Lights
     * const count = await prisma.light.count({
     *   where: {
     *     // ... the filter for the Lights we want to count
     *   }
     * })
    **/
    count<T extends lightCountArgs>(
      args?: Subset<T, lightCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LightCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Light.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LightAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LightAggregateArgs>(args: Subset<T, LightAggregateArgs>): Prisma.PrismaPromise<GetLightAggregateType<T>>

    /**
     * Group by Light.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lightGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends lightGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: lightGroupByArgs['orderBy'] }
        : { orderBy?: lightGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, lightGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLightGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the light model
   */
  readonly fields: lightFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for light.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__lightClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the light model
   */
  interface lightFieldRefs {
    readonly id: FieldRef<"light", 'Int'>
    readonly val: FieldRef<"light", 'Float'>
    readonly created_at: FieldRef<"light", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * light findUnique
   */
  export type lightFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
    /**
     * Filter, which light to fetch.
     */
    where: lightWhereUniqueInput
  }

  /**
   * light findUniqueOrThrow
   */
  export type lightFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
    /**
     * Filter, which light to fetch.
     */
    where: lightWhereUniqueInput
  }

  /**
   * light findFirst
   */
  export type lightFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
    /**
     * Filter, which light to fetch.
     */
    where?: lightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lights to fetch.
     */
    orderBy?: lightOrderByWithRelationInput | lightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lights.
     */
    cursor?: lightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lights.
     */
    distinct?: LightScalarFieldEnum | LightScalarFieldEnum[]
  }

  /**
   * light findFirstOrThrow
   */
  export type lightFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
    /**
     * Filter, which light to fetch.
     */
    where?: lightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lights to fetch.
     */
    orderBy?: lightOrderByWithRelationInput | lightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lights.
     */
    cursor?: lightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lights.
     */
    distinct?: LightScalarFieldEnum | LightScalarFieldEnum[]
  }

  /**
   * light findMany
   */
  export type lightFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
    /**
     * Filter, which lights to fetch.
     */
    where?: lightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lights to fetch.
     */
    orderBy?: lightOrderByWithRelationInput | lightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing lights.
     */
    cursor?: lightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lights.
     */
    skip?: number
    distinct?: LightScalarFieldEnum | LightScalarFieldEnum[]
  }

  /**
   * light create
   */
  export type lightCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
    /**
     * The data needed to create a light.
     */
    data: XOR<lightCreateInput, lightUncheckedCreateInput>
  }

  /**
   * light createMany
   */
  export type lightCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many lights.
     */
    data: lightCreateManyInput | lightCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * light update
   */
  export type lightUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
    /**
     * The data needed to update a light.
     */
    data: XOR<lightUpdateInput, lightUncheckedUpdateInput>
    /**
     * Choose, which light to update.
     */
    where: lightWhereUniqueInput
  }

  /**
   * light updateMany
   */
  export type lightUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update lights.
     */
    data: XOR<lightUpdateManyMutationInput, lightUncheckedUpdateManyInput>
    /**
     * Filter which lights to update
     */
    where?: lightWhereInput
    /**
     * Limit how many lights to update.
     */
    limit?: number
  }

  /**
   * light upsert
   */
  export type lightUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
    /**
     * The filter to search for the light to update in case it exists.
     */
    where: lightWhereUniqueInput
    /**
     * In case the light found by the `where` argument doesn't exist, create a new light with this data.
     */
    create: XOR<lightCreateInput, lightUncheckedCreateInput>
    /**
     * In case the light was found with the provided `where` argument, update it with this data.
     */
    update: XOR<lightUpdateInput, lightUncheckedUpdateInput>
  }

  /**
   * light delete
   */
  export type lightDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
    /**
     * Filter which light to delete.
     */
    where: lightWhereUniqueInput
  }

  /**
   * light deleteMany
   */
  export type lightDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which lights to delete
     */
    where?: lightWhereInput
    /**
     * Limit how many lights to delete.
     */
    limit?: number
  }

  /**
   * light without action
   */
  export type lightDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the light
     */
    select?: lightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the light
     */
    omit?: lightOmit<ExtArgs> | null
  }


  /**
   * Model temperature
   */

  export type AggregateTemperature = {
    _count: TemperatureCountAggregateOutputType | null
    _avg: TemperatureAvgAggregateOutputType | null
    _sum: TemperatureSumAggregateOutputType | null
    _min: TemperatureMinAggregateOutputType | null
    _max: TemperatureMaxAggregateOutputType | null
  }

  export type TemperatureAvgAggregateOutputType = {
    id: number | null
    val: number | null
  }

  export type TemperatureSumAggregateOutputType = {
    id: number | null
    val: number | null
  }

  export type TemperatureMinAggregateOutputType = {
    id: number | null
    val: number | null
    created_at: Date | null
  }

  export type TemperatureMaxAggregateOutputType = {
    id: number | null
    val: number | null
    created_at: Date | null
  }

  export type TemperatureCountAggregateOutputType = {
    id: number
    val: number
    created_at: number
    _all: number
  }


  export type TemperatureAvgAggregateInputType = {
    id?: true
    val?: true
  }

  export type TemperatureSumAggregateInputType = {
    id?: true
    val?: true
  }

  export type TemperatureMinAggregateInputType = {
    id?: true
    val?: true
    created_at?: true
  }

  export type TemperatureMaxAggregateInputType = {
    id?: true
    val?: true
    created_at?: true
  }

  export type TemperatureCountAggregateInputType = {
    id?: true
    val?: true
    created_at?: true
    _all?: true
  }

  export type TemperatureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which temperature to aggregate.
     */
    where?: temperatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of temperatures to fetch.
     */
    orderBy?: temperatureOrderByWithRelationInput | temperatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: temperatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` temperatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` temperatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned temperatures
    **/
    _count?: true | TemperatureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TemperatureAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TemperatureSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemperatureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemperatureMaxAggregateInputType
  }

  export type GetTemperatureAggregateType<T extends TemperatureAggregateArgs> = {
        [P in keyof T & keyof AggregateTemperature]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemperature[P]>
      : GetScalarType<T[P], AggregateTemperature[P]>
  }




  export type temperatureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: temperatureWhereInput
    orderBy?: temperatureOrderByWithAggregationInput | temperatureOrderByWithAggregationInput[]
    by: TemperatureScalarFieldEnum[] | TemperatureScalarFieldEnum
    having?: temperatureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemperatureCountAggregateInputType | true
    _avg?: TemperatureAvgAggregateInputType
    _sum?: TemperatureSumAggregateInputType
    _min?: TemperatureMinAggregateInputType
    _max?: TemperatureMaxAggregateInputType
  }

  export type TemperatureGroupByOutputType = {
    id: number
    val: number
    created_at: Date
    _count: TemperatureCountAggregateOutputType | null
    _avg: TemperatureAvgAggregateOutputType | null
    _sum: TemperatureSumAggregateOutputType | null
    _min: TemperatureMinAggregateOutputType | null
    _max: TemperatureMaxAggregateOutputType | null
  }

  type GetTemperatureGroupByPayload<T extends temperatureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemperatureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemperatureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemperatureGroupByOutputType[P]>
            : GetScalarType<T[P], TemperatureGroupByOutputType[P]>
        }
      >
    >


  export type temperatureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    val?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["temperature"]>



  export type temperatureSelectScalar = {
    id?: boolean
    val?: boolean
    created_at?: boolean
  }

  export type temperatureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "val" | "created_at", ExtArgs["result"]["temperature"]>

  export type $temperaturePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "temperature"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      val: number
      created_at: Date
    }, ExtArgs["result"]["temperature"]>
    composites: {}
  }

  type temperatureGetPayload<S extends boolean | null | undefined | temperatureDefaultArgs> = $Result.GetResult<Prisma.$temperaturePayload, S>

  type temperatureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<temperatureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TemperatureCountAggregateInputType | true
    }

  export interface temperatureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['temperature'], meta: { name: 'temperature' } }
    /**
     * Find zero or one Temperature that matches the filter.
     * @param {temperatureFindUniqueArgs} args - Arguments to find a Temperature
     * @example
     * // Get one Temperature
     * const temperature = await prisma.temperature.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends temperatureFindUniqueArgs>(args: SelectSubset<T, temperatureFindUniqueArgs<ExtArgs>>): Prisma__temperatureClient<$Result.GetResult<Prisma.$temperaturePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Temperature that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {temperatureFindUniqueOrThrowArgs} args - Arguments to find a Temperature
     * @example
     * // Get one Temperature
     * const temperature = await prisma.temperature.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends temperatureFindUniqueOrThrowArgs>(args: SelectSubset<T, temperatureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__temperatureClient<$Result.GetResult<Prisma.$temperaturePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Temperature that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temperatureFindFirstArgs} args - Arguments to find a Temperature
     * @example
     * // Get one Temperature
     * const temperature = await prisma.temperature.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends temperatureFindFirstArgs>(args?: SelectSubset<T, temperatureFindFirstArgs<ExtArgs>>): Prisma__temperatureClient<$Result.GetResult<Prisma.$temperaturePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Temperature that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temperatureFindFirstOrThrowArgs} args - Arguments to find a Temperature
     * @example
     * // Get one Temperature
     * const temperature = await prisma.temperature.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends temperatureFindFirstOrThrowArgs>(args?: SelectSubset<T, temperatureFindFirstOrThrowArgs<ExtArgs>>): Prisma__temperatureClient<$Result.GetResult<Prisma.$temperaturePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Temperatures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temperatureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Temperatures
     * const temperatures = await prisma.temperature.findMany()
     * 
     * // Get first 10 Temperatures
     * const temperatures = await prisma.temperature.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const temperatureWithIdOnly = await prisma.temperature.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends temperatureFindManyArgs>(args?: SelectSubset<T, temperatureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$temperaturePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Temperature.
     * @param {temperatureCreateArgs} args - Arguments to create a Temperature.
     * @example
     * // Create one Temperature
     * const Temperature = await prisma.temperature.create({
     *   data: {
     *     // ... data to create a Temperature
     *   }
     * })
     * 
     */
    create<T extends temperatureCreateArgs>(args: SelectSubset<T, temperatureCreateArgs<ExtArgs>>): Prisma__temperatureClient<$Result.GetResult<Prisma.$temperaturePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Temperatures.
     * @param {temperatureCreateManyArgs} args - Arguments to create many Temperatures.
     * @example
     * // Create many Temperatures
     * const temperature = await prisma.temperature.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends temperatureCreateManyArgs>(args?: SelectSubset<T, temperatureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Temperature.
     * @param {temperatureDeleteArgs} args - Arguments to delete one Temperature.
     * @example
     * // Delete one Temperature
     * const Temperature = await prisma.temperature.delete({
     *   where: {
     *     // ... filter to delete one Temperature
     *   }
     * })
     * 
     */
    delete<T extends temperatureDeleteArgs>(args: SelectSubset<T, temperatureDeleteArgs<ExtArgs>>): Prisma__temperatureClient<$Result.GetResult<Prisma.$temperaturePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Temperature.
     * @param {temperatureUpdateArgs} args - Arguments to update one Temperature.
     * @example
     * // Update one Temperature
     * const temperature = await prisma.temperature.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends temperatureUpdateArgs>(args: SelectSubset<T, temperatureUpdateArgs<ExtArgs>>): Prisma__temperatureClient<$Result.GetResult<Prisma.$temperaturePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Temperatures.
     * @param {temperatureDeleteManyArgs} args - Arguments to filter Temperatures to delete.
     * @example
     * // Delete a few Temperatures
     * const { count } = await prisma.temperature.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends temperatureDeleteManyArgs>(args?: SelectSubset<T, temperatureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Temperatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temperatureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Temperatures
     * const temperature = await prisma.temperature.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends temperatureUpdateManyArgs>(args: SelectSubset<T, temperatureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Temperature.
     * @param {temperatureUpsertArgs} args - Arguments to update or create a Temperature.
     * @example
     * // Update or create a Temperature
     * const temperature = await prisma.temperature.upsert({
     *   create: {
     *     // ... data to create a Temperature
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Temperature we want to update
     *   }
     * })
     */
    upsert<T extends temperatureUpsertArgs>(args: SelectSubset<T, temperatureUpsertArgs<ExtArgs>>): Prisma__temperatureClient<$Result.GetResult<Prisma.$temperaturePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Temperatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temperatureCountArgs} args - Arguments to filter Temperatures to count.
     * @example
     * // Count the number of Temperatures
     * const count = await prisma.temperature.count({
     *   where: {
     *     // ... the filter for the Temperatures we want to count
     *   }
     * })
    **/
    count<T extends temperatureCountArgs>(
      args?: Subset<T, temperatureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemperatureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Temperature.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemperatureAggregateArgs>(args: Subset<T, TemperatureAggregateArgs>): Prisma.PrismaPromise<GetTemperatureAggregateType<T>>

    /**
     * Group by Temperature.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temperatureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends temperatureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: temperatureGroupByArgs['orderBy'] }
        : { orderBy?: temperatureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, temperatureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemperatureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the temperature model
   */
  readonly fields: temperatureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for temperature.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__temperatureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the temperature model
   */
  interface temperatureFieldRefs {
    readonly id: FieldRef<"temperature", 'Int'>
    readonly val: FieldRef<"temperature", 'Float'>
    readonly created_at: FieldRef<"temperature", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * temperature findUnique
   */
  export type temperatureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
    /**
     * Filter, which temperature to fetch.
     */
    where: temperatureWhereUniqueInput
  }

  /**
   * temperature findUniqueOrThrow
   */
  export type temperatureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
    /**
     * Filter, which temperature to fetch.
     */
    where: temperatureWhereUniqueInput
  }

  /**
   * temperature findFirst
   */
  export type temperatureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
    /**
     * Filter, which temperature to fetch.
     */
    where?: temperatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of temperatures to fetch.
     */
    orderBy?: temperatureOrderByWithRelationInput | temperatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for temperatures.
     */
    cursor?: temperatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` temperatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` temperatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of temperatures.
     */
    distinct?: TemperatureScalarFieldEnum | TemperatureScalarFieldEnum[]
  }

  /**
   * temperature findFirstOrThrow
   */
  export type temperatureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
    /**
     * Filter, which temperature to fetch.
     */
    where?: temperatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of temperatures to fetch.
     */
    orderBy?: temperatureOrderByWithRelationInput | temperatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for temperatures.
     */
    cursor?: temperatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` temperatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` temperatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of temperatures.
     */
    distinct?: TemperatureScalarFieldEnum | TemperatureScalarFieldEnum[]
  }

  /**
   * temperature findMany
   */
  export type temperatureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
    /**
     * Filter, which temperatures to fetch.
     */
    where?: temperatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of temperatures to fetch.
     */
    orderBy?: temperatureOrderByWithRelationInput | temperatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing temperatures.
     */
    cursor?: temperatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` temperatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` temperatures.
     */
    skip?: number
    distinct?: TemperatureScalarFieldEnum | TemperatureScalarFieldEnum[]
  }

  /**
   * temperature create
   */
  export type temperatureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
    /**
     * The data needed to create a temperature.
     */
    data: XOR<temperatureCreateInput, temperatureUncheckedCreateInput>
  }

  /**
   * temperature createMany
   */
  export type temperatureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many temperatures.
     */
    data: temperatureCreateManyInput | temperatureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * temperature update
   */
  export type temperatureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
    /**
     * The data needed to update a temperature.
     */
    data: XOR<temperatureUpdateInput, temperatureUncheckedUpdateInput>
    /**
     * Choose, which temperature to update.
     */
    where: temperatureWhereUniqueInput
  }

  /**
   * temperature updateMany
   */
  export type temperatureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update temperatures.
     */
    data: XOR<temperatureUpdateManyMutationInput, temperatureUncheckedUpdateManyInput>
    /**
     * Filter which temperatures to update
     */
    where?: temperatureWhereInput
    /**
     * Limit how many temperatures to update.
     */
    limit?: number
  }

  /**
   * temperature upsert
   */
  export type temperatureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
    /**
     * The filter to search for the temperature to update in case it exists.
     */
    where: temperatureWhereUniqueInput
    /**
     * In case the temperature found by the `where` argument doesn't exist, create a new temperature with this data.
     */
    create: XOR<temperatureCreateInput, temperatureUncheckedCreateInput>
    /**
     * In case the temperature was found with the provided `where` argument, update it with this data.
     */
    update: XOR<temperatureUpdateInput, temperatureUncheckedUpdateInput>
  }

  /**
   * temperature delete
   */
  export type temperatureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
    /**
     * Filter which temperature to delete.
     */
    where: temperatureWhereUniqueInput
  }

  /**
   * temperature deleteMany
   */
  export type temperatureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which temperatures to delete
     */
    where?: temperatureWhereInput
    /**
     * Limit how many temperatures to delete.
     */
    limit?: number
  }

  /**
   * temperature without action
   */
  export type temperatureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temperature
     */
    select?: temperatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temperature
     */
    omit?: temperatureOmit<ExtArgs> | null
  }


  /**
   * Model humidity
   */

  export type AggregateHumidity = {
    _count: HumidityCountAggregateOutputType | null
    _avg: HumidityAvgAggregateOutputType | null
    _sum: HumiditySumAggregateOutputType | null
    _min: HumidityMinAggregateOutputType | null
    _max: HumidityMaxAggregateOutputType | null
  }

  export type HumidityAvgAggregateOutputType = {
    id: number | null
    val: number | null
  }

  export type HumiditySumAggregateOutputType = {
    id: number | null
    val: number | null
  }

  export type HumidityMinAggregateOutputType = {
    id: number | null
    val: number | null
    created_at: Date | null
  }

  export type HumidityMaxAggregateOutputType = {
    id: number | null
    val: number | null
    created_at: Date | null
  }

  export type HumidityCountAggregateOutputType = {
    id: number
    val: number
    created_at: number
    _all: number
  }


  export type HumidityAvgAggregateInputType = {
    id?: true
    val?: true
  }

  export type HumiditySumAggregateInputType = {
    id?: true
    val?: true
  }

  export type HumidityMinAggregateInputType = {
    id?: true
    val?: true
    created_at?: true
  }

  export type HumidityMaxAggregateInputType = {
    id?: true
    val?: true
    created_at?: true
  }

  export type HumidityCountAggregateInputType = {
    id?: true
    val?: true
    created_at?: true
    _all?: true
  }

  export type HumidityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which humidity to aggregate.
     */
    where?: humidityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of humidities to fetch.
     */
    orderBy?: humidityOrderByWithRelationInput | humidityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: humidityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` humidities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` humidities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned humidities
    **/
    _count?: true | HumidityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HumidityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HumiditySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HumidityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HumidityMaxAggregateInputType
  }

  export type GetHumidityAggregateType<T extends HumidityAggregateArgs> = {
        [P in keyof T & keyof AggregateHumidity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHumidity[P]>
      : GetScalarType<T[P], AggregateHumidity[P]>
  }




  export type humidityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: humidityWhereInput
    orderBy?: humidityOrderByWithAggregationInput | humidityOrderByWithAggregationInput[]
    by: HumidityScalarFieldEnum[] | HumidityScalarFieldEnum
    having?: humidityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HumidityCountAggregateInputType | true
    _avg?: HumidityAvgAggregateInputType
    _sum?: HumiditySumAggregateInputType
    _min?: HumidityMinAggregateInputType
    _max?: HumidityMaxAggregateInputType
  }

  export type HumidityGroupByOutputType = {
    id: number
    val: number
    created_at: Date
    _count: HumidityCountAggregateOutputType | null
    _avg: HumidityAvgAggregateOutputType | null
    _sum: HumiditySumAggregateOutputType | null
    _min: HumidityMinAggregateOutputType | null
    _max: HumidityMaxAggregateOutputType | null
  }

  type GetHumidityGroupByPayload<T extends humidityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HumidityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HumidityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HumidityGroupByOutputType[P]>
            : GetScalarType<T[P], HumidityGroupByOutputType[P]>
        }
      >
    >


  export type humiditySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    val?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["humidity"]>



  export type humiditySelectScalar = {
    id?: boolean
    val?: boolean
    created_at?: boolean
  }

  export type humidityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "val" | "created_at", ExtArgs["result"]["humidity"]>

  export type $humidityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "humidity"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      val: number
      created_at: Date
    }, ExtArgs["result"]["humidity"]>
    composites: {}
  }

  type humidityGetPayload<S extends boolean | null | undefined | humidityDefaultArgs> = $Result.GetResult<Prisma.$humidityPayload, S>

  type humidityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<humidityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HumidityCountAggregateInputType | true
    }

  export interface humidityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['humidity'], meta: { name: 'humidity' } }
    /**
     * Find zero or one Humidity that matches the filter.
     * @param {humidityFindUniqueArgs} args - Arguments to find a Humidity
     * @example
     * // Get one Humidity
     * const humidity = await prisma.humidity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends humidityFindUniqueArgs>(args: SelectSubset<T, humidityFindUniqueArgs<ExtArgs>>): Prisma__humidityClient<$Result.GetResult<Prisma.$humidityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Humidity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {humidityFindUniqueOrThrowArgs} args - Arguments to find a Humidity
     * @example
     * // Get one Humidity
     * const humidity = await prisma.humidity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends humidityFindUniqueOrThrowArgs>(args: SelectSubset<T, humidityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__humidityClient<$Result.GetResult<Prisma.$humidityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Humidity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {humidityFindFirstArgs} args - Arguments to find a Humidity
     * @example
     * // Get one Humidity
     * const humidity = await prisma.humidity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends humidityFindFirstArgs>(args?: SelectSubset<T, humidityFindFirstArgs<ExtArgs>>): Prisma__humidityClient<$Result.GetResult<Prisma.$humidityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Humidity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {humidityFindFirstOrThrowArgs} args - Arguments to find a Humidity
     * @example
     * // Get one Humidity
     * const humidity = await prisma.humidity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends humidityFindFirstOrThrowArgs>(args?: SelectSubset<T, humidityFindFirstOrThrowArgs<ExtArgs>>): Prisma__humidityClient<$Result.GetResult<Prisma.$humidityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Humidities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {humidityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Humidities
     * const humidities = await prisma.humidity.findMany()
     * 
     * // Get first 10 Humidities
     * const humidities = await prisma.humidity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const humidityWithIdOnly = await prisma.humidity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends humidityFindManyArgs>(args?: SelectSubset<T, humidityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$humidityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Humidity.
     * @param {humidityCreateArgs} args - Arguments to create a Humidity.
     * @example
     * // Create one Humidity
     * const Humidity = await prisma.humidity.create({
     *   data: {
     *     // ... data to create a Humidity
     *   }
     * })
     * 
     */
    create<T extends humidityCreateArgs>(args: SelectSubset<T, humidityCreateArgs<ExtArgs>>): Prisma__humidityClient<$Result.GetResult<Prisma.$humidityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Humidities.
     * @param {humidityCreateManyArgs} args - Arguments to create many Humidities.
     * @example
     * // Create many Humidities
     * const humidity = await prisma.humidity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends humidityCreateManyArgs>(args?: SelectSubset<T, humidityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Humidity.
     * @param {humidityDeleteArgs} args - Arguments to delete one Humidity.
     * @example
     * // Delete one Humidity
     * const Humidity = await prisma.humidity.delete({
     *   where: {
     *     // ... filter to delete one Humidity
     *   }
     * })
     * 
     */
    delete<T extends humidityDeleteArgs>(args: SelectSubset<T, humidityDeleteArgs<ExtArgs>>): Prisma__humidityClient<$Result.GetResult<Prisma.$humidityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Humidity.
     * @param {humidityUpdateArgs} args - Arguments to update one Humidity.
     * @example
     * // Update one Humidity
     * const humidity = await prisma.humidity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends humidityUpdateArgs>(args: SelectSubset<T, humidityUpdateArgs<ExtArgs>>): Prisma__humidityClient<$Result.GetResult<Prisma.$humidityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Humidities.
     * @param {humidityDeleteManyArgs} args - Arguments to filter Humidities to delete.
     * @example
     * // Delete a few Humidities
     * const { count } = await prisma.humidity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends humidityDeleteManyArgs>(args?: SelectSubset<T, humidityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Humidities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {humidityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Humidities
     * const humidity = await prisma.humidity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends humidityUpdateManyArgs>(args: SelectSubset<T, humidityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Humidity.
     * @param {humidityUpsertArgs} args - Arguments to update or create a Humidity.
     * @example
     * // Update or create a Humidity
     * const humidity = await prisma.humidity.upsert({
     *   create: {
     *     // ... data to create a Humidity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Humidity we want to update
     *   }
     * })
     */
    upsert<T extends humidityUpsertArgs>(args: SelectSubset<T, humidityUpsertArgs<ExtArgs>>): Prisma__humidityClient<$Result.GetResult<Prisma.$humidityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Humidities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {humidityCountArgs} args - Arguments to filter Humidities to count.
     * @example
     * // Count the number of Humidities
     * const count = await prisma.humidity.count({
     *   where: {
     *     // ... the filter for the Humidities we want to count
     *   }
     * })
    **/
    count<T extends humidityCountArgs>(
      args?: Subset<T, humidityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HumidityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Humidity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HumidityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HumidityAggregateArgs>(args: Subset<T, HumidityAggregateArgs>): Prisma.PrismaPromise<GetHumidityAggregateType<T>>

    /**
     * Group by Humidity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {humidityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends humidityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: humidityGroupByArgs['orderBy'] }
        : { orderBy?: humidityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, humidityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHumidityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the humidity model
   */
  readonly fields: humidityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for humidity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__humidityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the humidity model
   */
  interface humidityFieldRefs {
    readonly id: FieldRef<"humidity", 'Int'>
    readonly val: FieldRef<"humidity", 'Float'>
    readonly created_at: FieldRef<"humidity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * humidity findUnique
   */
  export type humidityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
    /**
     * Filter, which humidity to fetch.
     */
    where: humidityWhereUniqueInput
  }

  /**
   * humidity findUniqueOrThrow
   */
  export type humidityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
    /**
     * Filter, which humidity to fetch.
     */
    where: humidityWhereUniqueInput
  }

  /**
   * humidity findFirst
   */
  export type humidityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
    /**
     * Filter, which humidity to fetch.
     */
    where?: humidityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of humidities to fetch.
     */
    orderBy?: humidityOrderByWithRelationInput | humidityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for humidities.
     */
    cursor?: humidityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` humidities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` humidities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of humidities.
     */
    distinct?: HumidityScalarFieldEnum | HumidityScalarFieldEnum[]
  }

  /**
   * humidity findFirstOrThrow
   */
  export type humidityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
    /**
     * Filter, which humidity to fetch.
     */
    where?: humidityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of humidities to fetch.
     */
    orderBy?: humidityOrderByWithRelationInput | humidityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for humidities.
     */
    cursor?: humidityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` humidities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` humidities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of humidities.
     */
    distinct?: HumidityScalarFieldEnum | HumidityScalarFieldEnum[]
  }

  /**
   * humidity findMany
   */
  export type humidityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
    /**
     * Filter, which humidities to fetch.
     */
    where?: humidityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of humidities to fetch.
     */
    orderBy?: humidityOrderByWithRelationInput | humidityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing humidities.
     */
    cursor?: humidityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` humidities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` humidities.
     */
    skip?: number
    distinct?: HumidityScalarFieldEnum | HumidityScalarFieldEnum[]
  }

  /**
   * humidity create
   */
  export type humidityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
    /**
     * The data needed to create a humidity.
     */
    data: XOR<humidityCreateInput, humidityUncheckedCreateInput>
  }

  /**
   * humidity createMany
   */
  export type humidityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many humidities.
     */
    data: humidityCreateManyInput | humidityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * humidity update
   */
  export type humidityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
    /**
     * The data needed to update a humidity.
     */
    data: XOR<humidityUpdateInput, humidityUncheckedUpdateInput>
    /**
     * Choose, which humidity to update.
     */
    where: humidityWhereUniqueInput
  }

  /**
   * humidity updateMany
   */
  export type humidityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update humidities.
     */
    data: XOR<humidityUpdateManyMutationInput, humidityUncheckedUpdateManyInput>
    /**
     * Filter which humidities to update
     */
    where?: humidityWhereInput
    /**
     * Limit how many humidities to update.
     */
    limit?: number
  }

  /**
   * humidity upsert
   */
  export type humidityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
    /**
     * The filter to search for the humidity to update in case it exists.
     */
    where: humidityWhereUniqueInput
    /**
     * In case the humidity found by the `where` argument doesn't exist, create a new humidity with this data.
     */
    create: XOR<humidityCreateInput, humidityUncheckedCreateInput>
    /**
     * In case the humidity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<humidityUpdateInput, humidityUncheckedUpdateInput>
  }

  /**
   * humidity delete
   */
  export type humidityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
    /**
     * Filter which humidity to delete.
     */
    where: humidityWhereUniqueInput
  }

  /**
   * humidity deleteMany
   */
  export type humidityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which humidities to delete
     */
    where?: humidityWhereInput
    /**
     * Limit how many humidities to delete.
     */
    limit?: number
  }

  /**
   * humidity without action
   */
  export type humidityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the humidity
     */
    select?: humiditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the humidity
     */
    omit?: humidityOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LightScalarFieldEnum: {
    id: 'id',
    val: 'val',
    created_at: 'created_at'
  };

  export type LightScalarFieldEnum = (typeof LightScalarFieldEnum)[keyof typeof LightScalarFieldEnum]


  export const TemperatureScalarFieldEnum: {
    id: 'id',
    val: 'val',
    created_at: 'created_at'
  };

  export type TemperatureScalarFieldEnum = (typeof TemperatureScalarFieldEnum)[keyof typeof TemperatureScalarFieldEnum]


  export const HumidityScalarFieldEnum: {
    id: 'id',
    val: 'val',
    created_at: 'created_at'
  };

  export type HumidityScalarFieldEnum = (typeof HumidityScalarFieldEnum)[keyof typeof HumidityScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    
  /**
   * Deep Input Types
   */


  export type lightWhereInput = {
    AND?: lightWhereInput | lightWhereInput[]
    OR?: lightWhereInput[]
    NOT?: lightWhereInput | lightWhereInput[]
    id?: IntFilter<"light"> | number
    val?: FloatFilter<"light"> | number
    created_at?: DateTimeFilter<"light"> | Date | string
  }

  export type lightOrderByWithRelationInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type lightWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: lightWhereInput | lightWhereInput[]
    OR?: lightWhereInput[]
    NOT?: lightWhereInput | lightWhereInput[]
    val?: FloatFilter<"light"> | number
    created_at?: DateTimeFilter<"light"> | Date | string
  }, "id">

  export type lightOrderByWithAggregationInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
    _count?: lightCountOrderByAggregateInput
    _avg?: lightAvgOrderByAggregateInput
    _max?: lightMaxOrderByAggregateInput
    _min?: lightMinOrderByAggregateInput
    _sum?: lightSumOrderByAggregateInput
  }

  export type lightScalarWhereWithAggregatesInput = {
    AND?: lightScalarWhereWithAggregatesInput | lightScalarWhereWithAggregatesInput[]
    OR?: lightScalarWhereWithAggregatesInput[]
    NOT?: lightScalarWhereWithAggregatesInput | lightScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"light"> | number
    val?: FloatWithAggregatesFilter<"light"> | number
    created_at?: DateTimeWithAggregatesFilter<"light"> | Date | string
  }

  export type temperatureWhereInput = {
    AND?: temperatureWhereInput | temperatureWhereInput[]
    OR?: temperatureWhereInput[]
    NOT?: temperatureWhereInput | temperatureWhereInput[]
    id?: IntFilter<"temperature"> | number
    val?: FloatFilter<"temperature"> | number
    created_at?: DateTimeFilter<"temperature"> | Date | string
  }

  export type temperatureOrderByWithRelationInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type temperatureWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: temperatureWhereInput | temperatureWhereInput[]
    OR?: temperatureWhereInput[]
    NOT?: temperatureWhereInput | temperatureWhereInput[]
    val?: FloatFilter<"temperature"> | number
    created_at?: DateTimeFilter<"temperature"> | Date | string
  }, "id">

  export type temperatureOrderByWithAggregationInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
    _count?: temperatureCountOrderByAggregateInput
    _avg?: temperatureAvgOrderByAggregateInput
    _max?: temperatureMaxOrderByAggregateInput
    _min?: temperatureMinOrderByAggregateInput
    _sum?: temperatureSumOrderByAggregateInput
  }

  export type temperatureScalarWhereWithAggregatesInput = {
    AND?: temperatureScalarWhereWithAggregatesInput | temperatureScalarWhereWithAggregatesInput[]
    OR?: temperatureScalarWhereWithAggregatesInput[]
    NOT?: temperatureScalarWhereWithAggregatesInput | temperatureScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"temperature"> | number
    val?: FloatWithAggregatesFilter<"temperature"> | number
    created_at?: DateTimeWithAggregatesFilter<"temperature"> | Date | string
  }

  export type humidityWhereInput = {
    AND?: humidityWhereInput | humidityWhereInput[]
    OR?: humidityWhereInput[]
    NOT?: humidityWhereInput | humidityWhereInput[]
    id?: IntFilter<"humidity"> | number
    val?: FloatFilter<"humidity"> | number
    created_at?: DateTimeFilter<"humidity"> | Date | string
  }

  export type humidityOrderByWithRelationInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type humidityWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: humidityWhereInput | humidityWhereInput[]
    OR?: humidityWhereInput[]
    NOT?: humidityWhereInput | humidityWhereInput[]
    val?: FloatFilter<"humidity"> | number
    created_at?: DateTimeFilter<"humidity"> | Date | string
  }, "id">

  export type humidityOrderByWithAggregationInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
    _count?: humidityCountOrderByAggregateInput
    _avg?: humidityAvgOrderByAggregateInput
    _max?: humidityMaxOrderByAggregateInput
    _min?: humidityMinOrderByAggregateInput
    _sum?: humiditySumOrderByAggregateInput
  }

  export type humidityScalarWhereWithAggregatesInput = {
    AND?: humidityScalarWhereWithAggregatesInput | humidityScalarWhereWithAggregatesInput[]
    OR?: humidityScalarWhereWithAggregatesInput[]
    NOT?: humidityScalarWhereWithAggregatesInput | humidityScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"humidity"> | number
    val?: FloatWithAggregatesFilter<"humidity"> | number
    created_at?: DateTimeWithAggregatesFilter<"humidity"> | Date | string
  }

  export type lightCreateInput = {
    val: number
    created_at?: Date | string
  }

  export type lightUncheckedCreateInput = {
    id?: number
    val: number
    created_at?: Date | string
  }

  export type lightUpdateInput = {
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lightUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lightCreateManyInput = {
    id?: number
    val: number
    created_at?: Date | string
  }

  export type lightUpdateManyMutationInput = {
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lightUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type temperatureCreateInput = {
    val: number
    created_at?: Date | string
  }

  export type temperatureUncheckedCreateInput = {
    id?: number
    val: number
    created_at?: Date | string
  }

  export type temperatureUpdateInput = {
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type temperatureUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type temperatureCreateManyInput = {
    id?: number
    val: number
    created_at?: Date | string
  }

  export type temperatureUpdateManyMutationInput = {
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type temperatureUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type humidityCreateInput = {
    val: number
    created_at?: Date | string
  }

  export type humidityUncheckedCreateInput = {
    id?: number
    val: number
    created_at?: Date | string
  }

  export type humidityUpdateInput = {
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type humidityUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type humidityCreateManyInput = {
    id?: number
    val: number
    created_at?: Date | string
  }

  export type humidityUpdateManyMutationInput = {
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type humidityUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    val?: FloatFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type lightCountOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type lightAvgOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
  }

  export type lightMaxOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type lightMinOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type lightSumOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type temperatureCountOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type temperatureAvgOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
  }

  export type temperatureMaxOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type temperatureMinOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type temperatureSumOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
  }

  export type humidityCountOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type humidityAvgOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
  }

  export type humidityMaxOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type humidityMinOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
    created_at?: SortOrder
  }

  export type humiditySumOrderByAggregateInput = {
    id?: SortOrder
    val?: SortOrder
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}