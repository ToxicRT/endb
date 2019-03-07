// Type definitions for endb
// Project: https://github.com/chroventer/endb
// Definitions by: chroventer <https://github.com/chroventer>
// License: MIT

declare module 'endb' {
    export const version: string;
    export class Database {
        constructor(options?: EndbOptions);
        public name: string;
        public path: string;
        public memory: boolean;
        public timeout: number;
        public db: object;

        public add(key: string | number, value: number): number;
        public backup(name: string): void;
        private _check(): null;
        public close(): any;
        public delete(key: string | number): boolean;
        public deleteAll(): boolean;
        public destroy(): null;
        public find(prefix: string | number): object; 
        public get(key: string | number): string | number | object;
        public getAll(): object[];
        public has(key: string | number): boolean;
        public set(key: string | number, value: string | number | object): object;
        public subtract(key: string | number, value: number): number;
    }

    type EndbOptions = {
        name: string;
        path: string;
        memory: number;
        timeout: number;
    }
}