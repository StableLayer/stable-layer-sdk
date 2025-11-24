/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as balance_1 from './deps/sui/balance.js';
import * as double from './deps/bucket_v2_framework/double.js';
const $moduleName = '@local-pkg/yield_usdb.move::buffer';
export const Buffer = new MoveStruct({ name: `${$moduleName}::Buffer`, fields: {
        balance: balance_1.Balance,
        flow_rate: double.Double,
        timestamp: bcs.u64()
    } });
export interface NewArguments {
    flowRate: RawTransactionArgument<string>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        flowRate: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Public Funs */
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `${packageAddress}::double::Double`
    ] satisfies string[];
    const parameterNames = ["flowRate"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'buffer',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyArguments {
    buffer: RawTransactionArgument<string>;
}
export interface DestroyOptions {
    package?: string;
    arguments: DestroyArguments | [
        buffer: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function destroy(options: DestroyOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::buffer::Buffer<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["buffer"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'buffer',
        function: 'destroy',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface JoinArguments {
    buffer: RawTransactionArgument<string>;
    input: RawTransactionArgument<string>;
}
export interface JoinOptions {
    package?: string;
    arguments: JoinArguments | [
        buffer: RawTransactionArgument<string>,
        input: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function join(options: JoinOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::buffer::Buffer<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `0x0000000000000000000000000000000000000000000000000000000000000002::balance::Balance<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["buffer", "input"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'buffer',
        function: 'join',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ReleaseArguments {
    buffer: RawTransactionArgument<string>;
}
export interface ReleaseOptions {
    package?: string;
    arguments: ReleaseArguments | [
        buffer: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function release(options: ReleaseOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::buffer::Buffer<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["buffer"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'buffer',
        function: 'release',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SetFlowRateArguments {
    buffer: RawTransactionArgument<string>;
    flowRate: RawTransactionArgument<string>;
}
export interface SetFlowRateOptions {
    package?: string;
    arguments: SetFlowRateArguments | [
        buffer: RawTransactionArgument<string>,
        flowRate: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function setFlowRate(options: SetFlowRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::buffer::Buffer<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
        `${packageAddress}::double::Double`
    ] satisfies string[];
    const parameterNames = ["buffer", "flowRate"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'buffer',
        function: 'set_flow_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface BalanceArguments {
    buffer: RawTransactionArgument<string>;
}
export interface BalanceOptions {
    package?: string;
    arguments: BalanceArguments | [
        buffer: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Getter Funs */
export function balance(options: BalanceOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::buffer::Buffer<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["buffer"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'buffer',
        function: 'balance',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface FlowRateArguments {
    buffer: RawTransactionArgument<string>;
}
export interface FlowRateOptions {
    package?: string;
    arguments: FlowRateArguments | [
        buffer: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function flowRate(options: FlowRateOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::buffer::Buffer<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["buffer"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'buffer',
        function: 'flow_rate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface TimestampArguments {
    buffer: RawTransactionArgument<string>;
}
export interface TimestampOptions {
    package?: string;
    arguments: TimestampArguments | [
        buffer: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function timestamp(options: TimestampOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::buffer::Buffer<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["buffer"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'buffer',
        function: 'timestamp',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ReleasableAmountArguments {
    buffer: RawTransactionArgument<string>;
}
export interface ReleasableAmountOptions {
    package?: string;
    arguments: ReleasableAmountArguments | [
        buffer: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function releasableAmount(options: ReleasableAmountOptions) {
    const packageAddress = options.package ?? '@local-pkg/yield_usdb.move';
    const argumentsTypes = [
        `${packageAddress}::buffer::Buffer<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["buffer"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'buffer',
        function: 'releasable_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}