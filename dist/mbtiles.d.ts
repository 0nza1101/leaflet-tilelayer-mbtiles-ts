export default class MBTiles {
    private initialized;
    private db;
    private metadataStmt;
    private tilesStmt;
    constructor(buffer: ArrayBuffer);
    readonly isLoaded: boolean;
    getTile(x: number, y: number, z: number): Uint8Array;
    getMetadata(key: string): {
        [columnName: string]: string | number | Uint8Array;
    };
    readonly attribution: string;
    readonly description: string;
    readonly center: string[];
    readonly format: string;
    readonly bounds: string[];
    readonly minZoom: number;
    readonly maxZoom: number;
    readonly name: string;
    close(): void;
}
