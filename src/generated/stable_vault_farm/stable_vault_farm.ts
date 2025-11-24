/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object.js';
import * as sheet from './deps/bucket_v2_framework/sheet.js';
import * as table from './deps/sui/table.js';
import * as balance from './deps/sui/balance.js';
const $moduleName = '@local-pkg/stable_vault_farm.move::stable_vault_farm';
export const Claim = new MoveStruct({ name: `${$moduleName}::Claim`, fields: {
        reward_type: bcs.string(),
        amount: bcs.u64(),
        claimer: bcs.Address
    } });
export const StableVaultFarmEntity = new MoveStruct({ name: `${$moduleName}::StableVaultFarmEntity`, fields: {
        dummy_field: bcs.bool()
    } });
export const StableVaultFarmWitness = new MoveStruct({ name: `${$moduleName}::StableVaultFarmWitness`, fields: {
        dummy_field: bcs.bool()
    } });
export const StableVaultFarm = new MoveStruct({ name: `${$moduleName}::StableVaultFarm`, fields: {
        id: object.UID,
        sheet: sheet.Sheet,
        yield_table: table.Table,
        u_surplus: balance.Balance
    } });
export const AdminCap = new MoveStruct({ name: `${$moduleName}::AdminCap`, fields: {
        id: object.UID
    } });
export interface NewArguments {
    Cap: RawTransactionArgument<string>;
    initUCoin: RawTransactionArgument<string>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        Cap: RawTransactionArgument<string>,
        initUCoin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_vault_farm.move';
    const argumentsTypes = [
        `${packageAddress}::stable_vault_farm::AdminCap`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["Cap", "initUCoin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_vault_farm',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DefaultArguments {
    cap: RawTransactionArgument<string>;
    initUCoin: RawTransactionArgument<string>;
}
export interface DefaultOptions {
    package?: string;
    arguments: DefaultArguments | [
        cap: RawTransactionArgument<string>,
        initUCoin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function _default(options: DefaultOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_vault_farm.move';
    const argumentsTypes = [
        `${packageAddress}::stable_vault_farm::AdminCap`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["cap", "initUCoin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_vault_farm',
        function: 'default',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ReceiveArguments {
    farm: RawTransactionArgument<string>;
    loan: RawTransactionArgument<string>;
    stableVault: RawTransactionArgument<string>;
    usdbTreasury: RawTransactionArgument<string>;
    psmPool: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    yieldVault: RawTransactionArgument<string>;
    uPrice: RawTransactionArgument<string>;
}
export interface ReceiveOptions {
    package?: string;
    arguments: ReceiveArguments | [
        farm: RawTransactionArgument<string>,
        loan: RawTransactionArgument<string>,
        stableVault: RawTransactionArgument<string>,
        usdbTreasury: RawTransactionArgument<string>,
        psmPool: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        yieldVault: RawTransactionArgument<string>,
        uPrice: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string,
        string,
        string
    ];
}
export function receive(options: ReceiveOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_vault_farm.move';
    const argumentsTypes = [
        `${packageAddress}::stable_vault_farm::StableVaultFarm<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::sheet::Loan<${options.typeArguments[1]}, ${packageAddress}::stable_layer::StableFactoryEntity<${options.typeArguments[2]}, ${options.typeArguments[1]}>, ${packageAddress}::stable_vault_farm::StableVaultFarmEntity<${options.typeArguments[0]}, ${options.typeArguments[1]}>>`,
        `${packageAddress}::stable_vault::StableVault<${options.typeArguments[0]}, ${options.typeArguments[1]}, ${options.typeArguments[3]}>`,
        `${packageAddress}::usdb::Treasury`,
        `${packageAddress}::pool::Pool<${options.typeArguments[1]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[4]}>`,
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[3]}, ${options.typeArguments[4]}>`,
        `${packageAddress}::result::PriceResult<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["farm", "loan", "stableVault", "usdbTreasury", "psmPool", "savingPool", "yieldVault", "uPrice"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_vault_farm',
        function: 'receive',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PayArguments {
    farm: RawTransactionArgument<string>;
    request: RawTransactionArgument<string>;
    stableVault: RawTransactionArgument<string>;
    usdbTreasury: RawTransactionArgument<string>;
    psmPool: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    yieldVault: RawTransactionArgument<string>;
    uPrice: RawTransactionArgument<string>;
}
export interface PayOptions {
    package?: string;
    arguments: PayArguments | [
        farm: RawTransactionArgument<string>,
        request: RawTransactionArgument<string>,
        stableVault: RawTransactionArgument<string>,
        usdbTreasury: RawTransactionArgument<string>,
        psmPool: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        yieldVault: RawTransactionArgument<string>,
        uPrice: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string,
        string,
        string
    ];
}
export function pay(options: PayOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_vault_farm.move';
    const argumentsTypes = [
        `${packageAddress}::stable_vault_farm::StableVaultFarm<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::sheet::Request<${options.typeArguments[1]}, ${packageAddress}::stable_layer::StableFactoryEntity<${options.typeArguments[2]}, ${options.typeArguments[1]}>>`,
        `${packageAddress}::stable_vault::StableVault<${options.typeArguments[0]}, ${options.typeArguments[1]}, ${options.typeArguments[3]}>`,
        `${packageAddress}::usdb::Treasury`,
        `${packageAddress}::pool::Pool<${options.typeArguments[1]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[4]}>`,
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[3]}, ${options.typeArguments[4]}>`,
        `${packageAddress}::result::PriceResult<${options.typeArguments[1]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["farm", "request", "stableVault", "usdbTreasury", "psmPool", "savingPool", "yieldVault", "uPrice"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_vault_farm',
        function: 'pay',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimArguments {
    farm: RawTransactionArgument<string>;
    stableRegistry: RawTransactionArgument<string>;
    stableVault: RawTransactionArgument<string>;
    usdbTreasury: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    yieldVault: RawTransactionArgument<string>;
}
export interface ClaimOptions {
    package?: string;
    arguments: ClaimArguments | [
        farm: RawTransactionArgument<string>,
        stableRegistry: RawTransactionArgument<string>,
        stableVault: RawTransactionArgument<string>,
        usdbTreasury: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        yieldVault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string,
        string,
        string
    ];
}
export function claim(options: ClaimOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_vault_farm.move';
    const argumentsTypes = [
        `${packageAddress}::stable_vault_farm::StableVaultFarm<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::stable_layer::StableRegistry`,
        `${packageAddress}::stable_vault::StableVault<${options.typeArguments[0]}, ${options.typeArguments[1]}, ${options.typeArguments[3]}>`,
        `${packageAddress}::usdb::Treasury`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[4]}>`,
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[3]}, ${options.typeArguments[4]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["farm", "stableRegistry", "stableVault", "usdbTreasury", "savingPool", "yieldVault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_vault_farm',
        function: 'claim',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimableAmountArguments {
    farm: RawTransactionArgument<string>;
    savingPool: RawTransactionArgument<string>;
    yieldVault: RawTransactionArgument<string>;
}
export interface ClaimableAmountOptions {
    package?: string;
    arguments: ClaimableAmountArguments | [
        farm: RawTransactionArgument<string>,
        savingPool: RawTransactionArgument<string>,
        yieldVault: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string,
        string,
        string,
        string
    ];
}
export function claimableAmount(options: ClaimableAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_vault_farm.move';
    const argumentsTypes = [
        `${packageAddress}::stable_vault_farm::StableVaultFarm<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `${packageAddress}::saving::SavingPool<${options.typeArguments[4]}>`,
        `${packageAddress}::yield_usdb::YieldVault<${options.typeArguments[3]}, ${options.typeArguments[4]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["farm", "savingPool", "yieldVault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_vault_farm',
        function: 'claimable_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddSurplusArguments {
    farm: RawTransactionArgument<string>;
    coin: RawTransactionArgument<string>;
}
export interface AddSurplusOptions {
    package?: string;
    arguments: AddSurplusArguments | [
        farm: RawTransactionArgument<string>,
        coin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function addSurplus(options: AddSurplusOptions) {
    const packageAddress = options.package ?? '@local-pkg/stable_vault_farm.move';
    const argumentsTypes = [
        `${packageAddress}::stable_vault_farm::StableVaultFarm<${options.typeArguments[0]}, ${options.typeArguments[1]}>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[1]}>`
    ] satisfies string[];
    const parameterNames = ["farm", "coin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'stable_vault_farm',
        function: 'add_surplus',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}