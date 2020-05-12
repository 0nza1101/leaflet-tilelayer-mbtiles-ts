export default class MBTiles {
    private initialized;
    private db;
    private metadataStmt;
    private tilesStmt;
    constructor(buffer: ArrayBuffer);
    get isLoaded(): boolean;
    getTile(x: number, y: number, z: number): Uint8Array;
    getMetadata(key: string): {
        [columnName: string]: string | number | Uint8Array;
    };
    get attribution(): string;
    get description(): string;
    get center(): string[];
    get format(): string;
    get bounds(): string[];
    get minZoom(): number;
    get maxZoom(): number;
    get name(): string;
    close(): void;
}
