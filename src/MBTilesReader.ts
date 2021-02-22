import * as SQL from 'sql.js';

export default class MBTilesReader {

    private initialized: boolean;
    private db: SQL.Database;

    private metadataStmt: SQL.Statement;

    private tilesStmt: SQL.Statement;

    constructor(buffer: ArrayBuffer) {
        const uInt8Array = new Uint8Array(buffer);
        try {
            this.db = new SQL.Database(uInt8Array);
            this.metadataStmt = this.db.prepare(
                'SELECT value FROM metadata WHERE name = :key'
            );
            this.tilesStmt = this.db.prepare(
                'SELECT tile_data FROM tiles WHERE tile_column = :x AND tile_row = :y AND zoom_level = :z'
            );
            this.initialized = true;
        } catch (e) {
            throw e;
        }
    }

    public get isLoaded(): boolean {
        return this.initialized;
    }

    public getTile(x: number, y: number, z: number): Uint8Array {
        return this.tilesStmt.getAsObject({
            ':x': x,
            ':y': y,
            ':z': z
        }).tile_data as Uint8Array;
    }

    public getMetadata(key: string) {
        return this.metadataStmt.getAsObject({
            ':key': key
        });
    }

    public get attribution(): string {
        const value = this.getMetadata('attribution').value.toString();

        return value ? value : null;
    }

    public get description(): string {
        const value = this.getMetadata('description').value.toString();

        return value ? value : null;
    }

    public get center(): string[] {
        const value = this.getMetadata('center').value.toString().split(',');

        return value ? value : null;
    }

    public get format(): string {
        const value = this.getMetadata('format').value.toString();

        return value ? value : null;
    }

    public get bounds(): string[] {
        const value = this.getMetadata('bounds').value.toString().split(',');

        return value ? value : null;
    }

    public get minZoom(): number {
        const value = this.getMetadata('minZoom').value;

        return value ? Number(value) : null;
    }

    public get maxZoom(): number {
        const value = this.getMetadata('maxZoom').value;

        return value ? Number(value) : null;
    }

    public get name(): string {
        const value = this.getMetadata('name').value.toString();

        return value ? value : null;
    }

    public close(): void {
        if (this.initialized) {
            // this.metadataStmt.free();
            // this.tilesStmt.free();
            this.db.close();
        }
    }
}