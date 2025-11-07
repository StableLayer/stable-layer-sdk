/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object.js';
import * as coin from './deps/sui/coin.js';
import * as sheet_1 from './deps/bucket_v2_framework/sheet.js';
import * as vec_set from './deps/sui/vec_set.js';
const $moduleName = '@local-pkg/stable_factory.move::stable_factory';
export const StableKey = new MoveStruct({ name: `${$moduleName}::StableKey`, fields: {
        dummy_field: bcs.bool()
    } });
export const StableFactoryEntity = new MoveStruct({ name: `${$moduleName}::StableFactoryEntity`, fields: {
        dummy_field: bcs.bool()
    } });
export const StableRegistry = new MoveStruct({ name: `${$moduleName}::StableRegistry`, fields: {
        id: object.UID
    } });
export const StableFactory = new MoveStruct({ name: `${$moduleName}::StableFactory`, fields: {
        id: object.UID,
        treasury_cap: coin.TreasuryCap,
        sheet: sheet_1.Sheet,
        claimers: vec_set.VecSet(bcs.Address)
    } });
export const FactoryCap = new MoveStruct({ name: `${$moduleName}::FactoryCap`, fields: {
        id: object.UID,
        factory_id: bcs.Address
    } });
export interface NewArguments {
    registry: RawTransactionArgument<string>;
    treasuryCap: RawTransactionArgument<string>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        registry: RawTransactionArgument<string>,
        treasuryCap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Admin Funs */
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_factory::StableRegistry`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::TreasuryCap<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["registry", "treasuryCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_factory',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DefaultArguments {
    registry: RawTransactionArgument<string>;
    treasuryCap: RawTransactionArgument<string>;
}
export interface DefaultOptions {
    package?: string;
    arguments: DefaultArguments | [
        registry: RawTransactionArgument<string>,
        treasuryCap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function _default(options: DefaultOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_factory::StableRegistry`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::TreasuryCap<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["registry", "treasuryCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_factory',
        function: 'default',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddEntityArguments {
    factory: RawTransactionArgument<string>;
    AdminCap: RawTransactionArgument<string>;
}
export interface AddEntityOptions {
    package?: string;
    arguments: AddEntityArguments | [
        factory: RawTransactionArgument<string>,
        AdminCap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
export function addEntity(options: AddEntityOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_factory::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::stable_factory::FactoryCap<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["factory", "AdminCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_factory',
        function: 'add_entity',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BanEntityArguments {
    factory: RawTransactionArgument<string>;
    AdminCap: RawTransactionArgument<string>;
}
export interface BanEntityOptions {
    package?: string;
    arguments: BanEntityArguments | [
        factory: RawTransactionArgument<string>,
        AdminCap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
export function banEntity(options: BanEntityOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_factory::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::stable_factory::FactoryCap<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["factory", "AdminCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_factory',
        function: 'ban_entity',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AssertSenderIsClaimerArguments {
    factory: RawTransactionArgument<string>;
    accReq: RawTransactionArgument<string>;
}
export interface AssertSenderIsClaimerOptions {
    package?: string;
    arguments: AssertSenderIsClaimerArguments | [
        factory: RawTransactionArgument<string>,
        accReq: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Public Funs */
export function assertSenderIsClaimer(options: AssertSenderIsClaimerOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_factory::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::account::AccountRequest`
    ] satisfies string[];
    const parameterNames = ["factory", "accReq"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_factory',
        function: 'assert_sender_is_claimer',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MintArguments {
    factory: RawTransactionArgument<string>;
    uCoin: RawTransactionArgument<string>;
}
export interface MintOptions {
    package?: string;
    arguments: MintArguments | [
        factory: RawTransactionArgument<string>,
        uCoin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
export function mint(options: MintOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_factory::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["factory", "uCoin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_factory',
        function: 'mint',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RequestBurnArguments {
    factory: RawTransactionArgument<string>;
    stableCoin: RawTransactionArgument<string>;
}
export interface RequestBurnOptions {
    package?: string;
    arguments: RequestBurnArguments | [
        factory: RawTransactionArgument<string>,
        stableCoin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function requestBurn(options: RequestBurnOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_factory::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["factory", "stableCoin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_factory',
        function: 'request_burn',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface FulfillBurnArguments {
    factory: RawTransactionArgument<string>;
    burnRequest: RawTransactionArgument<string>;
}
export interface FulfillBurnOptions {
    package?: string;
    arguments: FulfillBurnArguments | [
        factory: RawTransactionArgument<string>,
        burnRequest: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function fulfillBurn(options: FulfillBurnOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_factory::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::sheet::Request<${options.typeArguments[1]}, ${packageAddress}::stable_factory::StableFactoryEntity<${options.typeArguments[0]}, ${options.typeArguments[1]}>>`
    ] satisfies string[];
    const parameterNames = ["factory", "burnRequest"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_factory',
        function: 'fulfill_burn',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SheetArguments {
    factory: RawTransactionArgument<string>;
}
export interface SheetOptions {
    package?: string;
    arguments: SheetArguments | [
        factory: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Getter Fun */
export function sheet(options: SheetOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_factory::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["factory"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_factory',
        function: 'sheet',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}