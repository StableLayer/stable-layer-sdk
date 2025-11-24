/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object.js';
import * as coin from './deps/sui/coin.js';
import * as account from './deps/bucket_v2_framework/account.js';
import * as buffer_1 from './buffer.js';
import * as vec_set from './deps/sui/vec_set.js';
const $moduleName = '@local-pkg/yield_usdb.move::yield_usdb';
export const Created = new MoveStruct({ name: `${$moduleName}::Created`, fields: {
        vault_id: bcs.Address,
        max_lp_supply: bcs.u64(),
        abstract_address: bcs.Address
    } });
export const MaxSupplyUpdated = new MoveStruct({ name: `${$moduleName}::MaxSupplyUpdated`, fields: {
        vault_id: bcs.Address,
        previous_max_lp_supply: bcs.u64(),
        current_max_lp_supply: bcs.u64()
    } });
export const Minted = new MoveStruct({ name: `${$moduleName}::Minted`, fields: {
        vault_id: bcs.Address,
        usdb_amount: bcs.u64(),
        lp_amount: bcs.u64()
    } });
export const Burned = new MoveStruct({ name: `${$moduleName}::Burned`, fields: {
        vault_id: bcs.Address,
        lp_amount: bcs.u64(),
        usdb_amount: bcs.u64()
    } });
export const Claimed = new MoveStruct({ name: `${$moduleName}::Claimed`, fields: {
        vault_id: bcs.Address,
        reward_type: bcs.string(),
        reward_amount: bcs.u64()
    } });
export const Collected = new MoveStruct({ name: `${$moduleName}::Collected`, fields: {
        vault_id: bcs.Address,
        usdb_amount: bcs.u64()
    } });
export const YieldVault = new MoveStruct({ name: `${$moduleName}::YieldVault`, fields: {
        id: object.UID,
        max_lp_supply: bcs.u64(),
        lp_treasury_cap: coin.TreasuryCap,
        abstract_account: account.Account,
        buffer: buffer_1.Buffer,
        managers: vec_set.VecSet(bcs.Address),
        versions: vec_set.VecSet(bcs.u16())
    } });
export interface PackageVersionOptions {
    package?: string;
    arguments?: [
    ];
}
export function packageVersion(options: PackageVersionOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'package_version',
    });
}
export interface NewArguments {
    AdminCap: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    lpTreasuryCap: RawTransactionArgument<string>;
    accountObj: RawTransactionArgument<string>;
    maxLpSupply: RawTransactionArgument<number | bigint>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        AdminCap: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        lpTreasuryCap: RawTransactionArgument<string>,
        accountObj: RawTransactionArgument<string>,
        maxLpSupply: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Admin Funs */
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::admin::AdminCap`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::TreasuryCap<${options.typeArguments[0]}>`,
        `${packageAddress}::account::Account`,
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["AdminCap", "savingPool", "lpTreasuryCap", "accountObj", "maxLpSupply"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DefaultArguments {
    adminCap: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    lpTreasuryCap: RawTransactionArgument<string>;
    accountObj: RawTransactionArgument<string>;
    maxLpSupply: RawTransactionArgument<number | bigint>;
}
export interface DefaultOptions {
    package?: string;
    arguments: DefaultArguments | [
        adminCap: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        lpTreasuryCap: RawTransactionArgument<string>,
        accountObj: RawTransactionArgument<string>,
        maxLpSupply: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function _default(options: DefaultOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::admin::AdminCap`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::TreasuryCap<${options.typeArguments[0]}>`,
        `${packageAddress}::account::Account`,
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["adminCap", "savingPool", "lpTreasuryCap", "accountObj", "maxLpSupply"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'default',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyArguments {
    vault: RawTransactionArgument<string>;
    AdminCap: RawTransactionArgument<string>;
}
export interface DestroyOptions {
    package?: string;
    arguments: DestroyArguments | [
        vault: RawTransactionArgument<string>,
        AdminCap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function destroy(options: DestroyOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["vault", "AdminCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'destroy',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddManagerArguments {
    vault: RawTransactionArgument<string>;
    AdminCap: RawTransactionArgument<string>;
    manager: RawTransactionArgument<string>;
}
export interface AddManagerOptions {
    package?: string;
    arguments: AddManagerArguments | [
        vault: RawTransactionArgument<string>,
        AdminCap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function addManager(options: AddManagerOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::admin::AdminCap`,
        'address'
    ] satisfies string[];
    const parameterNames = ["vault", "AdminCap", "manager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'add_manager',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveManagerArguments {
    vault: RawTransactionArgument<string>;
    AdminCap: RawTransactionArgument<string>;
    manager: RawTransactionArgument<string>;
}
export interface RemoveManagerOptions {
    package?: string;
    arguments: RemoveManagerArguments | [
        vault: RawTransactionArgument<string>,
        AdminCap: RawTransactionArgument<string>,
        manager: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function removeManager(options: RemoveManagerOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::admin::AdminCap`,
        'address'
    ] satisfies string[];
    const parameterNames = ["vault", "AdminCap", "manager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'remove_manager',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddVersionArguments {
    vault: RawTransactionArgument<string>;
    AdminCap: RawTransactionArgument<string>;
    version: RawTransactionArgument<number>;
}
export interface AddVersionOptions {
    package?: string;
    arguments: AddVersionArguments | [
        vault: RawTransactionArgument<string>,
        AdminCap: RawTransactionArgument<string>,
        version: RawTransactionArgument<number>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function addVersion(options: AddVersionOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::admin::AdminCap`,
        'u16'
    ] satisfies string[];
    const parameterNames = ["vault", "AdminCap", "version"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'add_version',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveVersionArguments {
    vault: RawTransactionArgument<string>;
    AdminCap: RawTransactionArgument<string>;
    version: RawTransactionArgument<number>;
}
export interface RemoveVersionOptions {
    package?: string;
    arguments: RemoveVersionArguments | [
        vault: RawTransactionArgument<string>,
        AdminCap: RawTransactionArgument<string>,
        version: RawTransactionArgument<number>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function removeVersion(options: RemoveVersionOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::admin::AdminCap`,
        'u16'
    ] satisfies string[];
    const parameterNames = ["vault", "AdminCap", "version"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'remove_version',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UpdateMaxLpSupplyArguments {
    vault: RawTransactionArgument<string>;
    AdminCap: RawTransactionArgument<string>;
    maxLpSupply: RawTransactionArgument<number | bigint>;
}
export interface UpdateMaxLpSupplyOptions {
    package?: string;
    arguments: UpdateMaxLpSupplyArguments | [
        vault: RawTransactionArgument<string>,
        AdminCap: RawTransactionArgument<string>,
        maxLpSupply: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function updateMaxLpSupply(options: UpdateMaxLpSupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::admin::AdminCap`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["vault", "AdminCap", "maxLpSupply"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'update_max_lp_supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MintArguments {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    usdbCoin: RawTransactionArgument<string>;
}
export interface MintOptions {
    package?: string;
    arguments: MintArguments | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        usdbCoin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Public Fun */
export function mint(options: MintOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::usdb::Treasury`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${packageAddress}::usdb::USDB>`
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "savingPool", "usdbCoin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'mint',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ReleaseArguments {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
}
export interface ReleaseOptions {
    package?: string;
    arguments: ReleaseArguments | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function release(options: ReleaseOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::usdb::Treasury`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "savingPool"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'release',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BurnArguments {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    lpCoin: RawTransactionArgument<string>;
}
export interface BurnOptions {
    package?: string;
    arguments: BurnArguments | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        lpCoin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function burn(options: BurnOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::usdb::Treasury`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "savingPool", "lpCoin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'burn',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimArguments {
    vault: RawTransactionArgument<string>;
    rewardManager: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    accountReq: RawTransactionArgument<string>;
}
export interface ClaimOptions {
    package?: string;
    arguments: ClaimArguments | [
        vault: RawTransactionArgument<string>,
        rewardManager: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        accountReq: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
/** Manager Funs */
export function claim(options: ClaimOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[1]}>`,
        `${packageAddress}::incentive_config::GlobalConfig`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `${packageAddress}::account::AccountRequest`
    ] satisfies string[];
    const parameterNames = ["vault", "rewardManager", "config", "savingPool", "accountReq"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'claim',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface CollectArguments {
    vault: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    usdbCoin: RawTransactionArgument<string>;
    accountReq: RawTransactionArgument<string>;
    bufferTime: RawTransactionArgument<number | bigint>;
}
export interface CollectOptions {
    package?: string;
    arguments: CollectArguments | [
        vault: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        usdbCoin: RawTransactionArgument<string>,
        accountReq: RawTransactionArgument<string>,
        bufferTime: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function collect(options: CollectOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::usdb::Treasury`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${packageAddress}::usdb::USDB>`,
        `${packageAddress}::account::AccountRequest`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["vault", "treasury", "savingPool", "usdbCoin", "accountReq", "bufferTime"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'collect',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface IdArguments {
    vault: RawTransactionArgument<string>;
}
export interface IdOptions {
    package?: string;
    arguments: IdArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
/** Getter Funs */
export function id(options: IdOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MaxLpSupplyArguments {
    vault: RawTransactionArgument<string>;
}
export interface MaxLpSupplyOptions {
    package?: string;
    arguments: MaxLpSupplyArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function maxLpSupply(options: MaxLpSupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'max_lp_supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UsdbReserveArguments {
    vault: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
}
export interface UsdbReserveOptions {
    package?: string;
    arguments: UsdbReserveArguments | [
        vault: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function usdbReserve(options: UsdbReserveOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["vault", "savingPool"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'usdb_reserve',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface LpSupplyArguments {
    vault: RawTransactionArgument<string>;
}
export interface LpSupplyOptions {
    package?: string;
    arguments: LpSupplyArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function lpSupply(options: LpSupplyOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'lp_supply',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MintRatioArguments {
    vault: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
}
export interface MintRatioOptions {
    package?: string;
    arguments: MintRatioArguments | [
        vault: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function mintRatio(options: MintRatioOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["vault", "savingPool"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'mint_ratio',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BurnRatioArguments {
    vault: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
}
export interface BurnRatioOptions {
    package?: string;
    arguments: BurnRatioArguments | [
        vault: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function burnRatio(options: BurnRatioOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["vault", "savingPool"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'burn_ratio',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimableRewardAmountArguments {
    vault: RawTransactionArgument<string>;
    rewardManager: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
}
export interface ClaimableRewardAmountOptions {
    package?: string;
    arguments: ClaimableRewardAmountArguments | [
        vault: RawTransactionArgument<string>,
        rewardManager: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string
    ];
}
export function claimableRewardAmount(options: ClaimableRewardAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::saving_incentive::RewardManager<${options.typeArguments[1]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["vault", "rewardManager", "savingPool"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'claimable_reward_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AbstractAddressArguments {
    vault: RawTransactionArgument<string>;
}
export interface AbstractAddressOptions {
    package?: string;
    arguments: AbstractAddressArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function abstractAddress(options: AbstractAddressOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'abstract_address',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BufferArguments {
    vault: RawTransactionArgument<string>;
}
export interface BufferOptions {
    package?: string;
    arguments: BufferArguments | [
        vault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function buffer(options: BufferOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[0]}, ${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'yield_usdb',
        function: 'buffer',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}