/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as sheet_1 from './deps/bucket_v2_framework/sheet.js';
import * as object from './deps/sui/object.js';
import * as vec_set from './deps/sui/vec_set.js';
import * as coin from './deps/sui/coin.js';
const $moduleName = '@local-pkg/stable_factory.move::stable_layer';
export const NewStable = new MoveStruct({ name: `${$moduleName}::NewStable`, fields: {
        u_type: bcs.string(),
        stable_type: bcs.string(),
        factory_id: bcs.Address,
        factory_cap_id: bcs.Address
    } });
export const Mint = new MoveStruct({ name: `${$moduleName}::Mint`, fields: {
        u_type: bcs.string(),
        stable_type: bcs.string(),
        mint_amount: bcs.u64(),
        farm_type: bcs.string()
    } });
export const Burn = new MoveStruct({ name: `${$moduleName}::Burn`, fields: {
        u_type: bcs.string(),
        stable_type: bcs.string(),
        burn_amount: bcs.u64(),
        farm_types: bcs.vector(sheet_1.Entity),
        repayment_amounts: bcs.vector(bcs.u64())
    } });
export const StableFactoryEntity = new MoveStruct({ name: `${$moduleName}::StableFactoryEntity`, fields: {
        dummy_field: bcs.bool()
    } });
export const StableRegistry = new MoveStruct({ name: `${$moduleName}::StableRegistry`, fields: {
        id: object.UID,
        versions: vec_set.VecSet(bcs.u16()),
        total_supply: bcs.u64()
    } });
export const AdminCap = new MoveStruct({ name: `${$moduleName}::AdminCap`, fields: {
        id: object.UID
    } });
export const StableFactory = new MoveStruct({ name: `${$moduleName}::StableFactory`, fields: {
        id: object.UID,
        treasury_cap: coin.TreasuryCap,
        max_supply: bcs.u64(),
        sheet: sheet_1.Sheet,
        managers: vec_set.VecSet(bcs.Address)
    } });
export const FactoryCap = new MoveStruct({ name: `${$moduleName}::FactoryCap`, fields: {
        id: object.UID,
        factory_id: bcs.Address
    } });
export interface PackageVersionOptions {
    package?: string;
    arguments?: [
    ];
}
export function packageVersion(options: PackageVersionOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'package_version',
    });
}
export interface NewArguments {
    registry: RawTransactionArgument<string>;
    treasuryCap: RawTransactionArgument<string>;
    maxSupply: RawTransactionArgument<number | bigint>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        registry: RawTransactionArgument<string>,
        treasuryCap: RawTransactionArgument<string>,
        maxSupply: RawTransactionArgument<number | bigint>
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
        `${packageAddress}::stable_layer::StableRegistry`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::TreasuryCap<${options.typeArguments[0]}>`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["registry", "treasuryCap", "maxSupply"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DefaultArguments {
    registry: RawTransactionArgument<string>;
    treasuryCap: RawTransactionArgument<string>;
    maxSupply: RawTransactionArgument<number | bigint>;
}
export interface DefaultOptions {
    package?: string;
    arguments: DefaultArguments | [
        registry: RawTransactionArgument<string>,
        treasuryCap: RawTransactionArgument<string>,
        maxSupply: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function _default(options: DefaultOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableRegistry`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::TreasuryCap<${options.typeArguments[0]}>`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["registry", "treasuryCap", "maxSupply"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'default',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddVersionArguments {
    AdminCap: RawTransactionArgument<string>;
    registry: RawTransactionArgument<string>;
    version: RawTransactionArgument<number>;
}
export interface AddVersionOptions {
    package?: string;
    arguments: AddVersionArguments | [
        AdminCap: RawTransactionArgument<string>,
        registry: RawTransactionArgument<string>,
        version: RawTransactionArgument<number>
    ];
}
/** Admin Funs */
export function addVersion(options: AddVersionOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::AdminCap`,
        `${packageAddress}::stable_layer::StableRegistry`,
        'u16'
    ] satisfies string[];
    const parameterNames = ["AdminCap", "registry", "version"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'add_version',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemoveVersionArguments {
    AdminCap: RawTransactionArgument<string>;
    registry: RawTransactionArgument<string>;
    version: RawTransactionArgument<number>;
}
export interface RemoveVersionOptions {
    package?: string;
    arguments: RemoveVersionArguments | [
        AdminCap: RawTransactionArgument<string>,
        registry: RawTransactionArgument<string>,
        version: RawTransactionArgument<number>
    ];
}
export function removeVersion(options: RemoveVersionOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::AdminCap`,
        `${packageAddress}::stable_layer::StableRegistry`,
        'u16'
    ] satisfies string[];
    const parameterNames = ["AdminCap", "registry", "version"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'remove_version',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddEntityArguments {
    registry: RawTransactionArgument<string>;
    FactoryCap: RawTransactionArgument<string>;
}
export interface AddEntityOptions {
    package?: string;
    arguments: AddEntityArguments | [
        registry: RawTransactionArgument<string>,
        FactoryCap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
/** Factory Cap Funs */
export function addEntity(options: AddEntityOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableRegistry`,
        `${packageAddress}::stable_layer::FactoryCap<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["registry", "FactoryCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'add_entity',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BanEntityArguments {
    registry: RawTransactionArgument<string>;
    FactoryCap: RawTransactionArgument<string>;
}
export interface BanEntityOptions {
    package?: string;
    arguments: BanEntityArguments | [
        registry: RawTransactionArgument<string>,
        FactoryCap: RawTransactionArgument<string>
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
        `${packageAddress}::stable_layer::StableRegistry`,
        `${packageAddress}::stable_layer::FactoryCap<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["registry", "FactoryCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'ban_entity',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddManagerArguments {
    registry: RawTransactionArgument<string>;
    FactoryCap: RawTransactionArgument<string>;
    manager: RawTransactionArgument<string>;
}
export interface AddManagerOptions {
    package?: string;
    arguments: AddManagerArguments | [
        registry: RawTransactionArgument<string>,
        FactoryCap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function addManager(options: AddManagerOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableRegistry`,
        `${packageAddress}::stable_layer::FactoryCap<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["registry", "FactoryCap", "manager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'add_manager',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveManagerArguments {
    registry: RawTransactionArgument<string>;
    FactoryCap: RawTransactionArgument<string>;
    manager: RawTransactionArgument<string>;
}
export interface RemoveManagerOptions {
    package?: string;
    arguments: RemoveManagerArguments | [
        registry: RawTransactionArgument<string>,
        FactoryCap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function removeManager(options: RemoveManagerOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableRegistry`,
        `${packageAddress}::stable_layer::FactoryCap<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["registry", "FactoryCap", "manager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'remove_manager',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SetMaxSupplyArguments {
    registry: RawTransactionArgument<string>;
    FactoryCap: RawTransactionArgument<string>;
    maxSupply: RawTransactionArgument<number | bigint>;
}
export interface SetMaxSupplyOptions {
    package?: string;
    arguments: SetMaxSupplyArguments | [
        registry: RawTransactionArgument<string>,
        FactoryCap: RawTransactionArgument<string>,
        maxSupply: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function setMaxSupply(options: SetMaxSupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableRegistry`,
        `${packageAddress}::stable_layer::FactoryCap<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["registry", "FactoryCap", "maxSupply"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'set_max_supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MintArguments {
    registry: RawTransactionArgument<string>;
    uCoin: RawTransactionArgument<string>;
}
export interface MintOptions {
    package?: string;
    arguments: MintArguments | [
        registry: RawTransactionArgument<string>,
        uCoin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
/** Public Funs */
export function mint(options: MintOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableRegistry`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["registry", "uCoin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'mint',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RequestBurnArguments {
    registry: RawTransactionArgument<string>;
    stableCoin: RawTransactionArgument<string>;
}
export interface RequestBurnOptions {
    package?: string;
    arguments: RequestBurnArguments | [
        registry: RawTransactionArgument<string>,
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
        `${packageAddress}::stable_layer::StableRegistry`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["registry", "stableCoin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'request_burn',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface FulfillBurnArguments {
    registry: RawTransactionArgument<string>;
    burnRequest: RawTransactionArgument<string>;
}
export interface FulfillBurnOptions {
    package?: string;
    arguments: FulfillBurnArguments | [
        registry: RawTransactionArgument<string>,
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
        `${packageAddress}::stable_layer::StableRegistry`,
        `${packageAddress}::sheet::Request<${options.typeArguments[1]}, ${packageAddress}::stable_layer::StableFactoryEntity<${options.typeArguments[0]}, ${options.typeArguments[1]}>>`
    ] satisfies string[];
    const parameterNames = ["registry", "burnRequest"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'fulfill_burn',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface VersionsArguments {
    registry: RawTransactionArgument<string>;
}
export interface VersionsOptions {
    package?: string;
    arguments: VersionsArguments | [
        registry: RawTransactionArgument<string>
    ];
}
/** Getter Fun */
export function versions(options: VersionsOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableRegistry`
    ] satisfies string[];
    const parameterNames = ["registry"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'versions',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TotalSupplyArguments {
    registry: RawTransactionArgument<string>;
}
export interface TotalSupplyOptions {
    package?: string;
    arguments: TotalSupplyArguments | [
        registry: RawTransactionArgument<string>
    ];
}
export function totalSupply(options: TotalSupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableRegistry`
    ] satisfies string[];
    const parameterNames = ["registry"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'total_supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface BorrowFactoryArguments {
    registry: RawTransactionArgument<string>;
}
export interface BorrowFactoryOptions {
    package?: string;
    arguments: BorrowFactoryArguments | [
        registry: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function borrowFactory(options: BorrowFactoryOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableRegistry`
    ] satisfies string[];
    const parameterNames = ["registry"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'borrow_factory',
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
export function sheet(options: SheetOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["factory"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'sheet',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface StableSupplyArguments {
    factory: RawTransactionArgument<string>;
}
export interface StableSupplyOptions {
    package?: string;
    arguments: StableSupplyArguments | [
        factory: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function stableSupply(options: StableSupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["factory"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'stable_supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MaxSupplyArguments {
    factory: RawTransactionArgument<string>;
}
export interface MaxSupplyOptions {
    package?: string;
    arguments: MaxSupplyArguments | [
        factory: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function maxSupply(options: MaxSupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["factory"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'max_supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ManagersArguments {
    factory: RawTransactionArgument<string>;
}
export interface ManagersOptions {
    package?: string;
    arguments: ManagersArguments | [
        factory: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function managers(options: ManagersOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_factory.move';
    const argumentsTypes = [
        `${packageAddress}::stable_layer::StableFactory<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["factory"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_layer',
        function: 'managers',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}