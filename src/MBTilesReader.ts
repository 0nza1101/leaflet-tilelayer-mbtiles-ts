import * as SQL from 'sql.js';

export default class MBTilesReader {
  private initialized = false;
  private db: SQL.Database;

  private metadataStmt: SQL.Statement;

  private tilesStmt: SQL.Statement;

  constructor(buffer: ArrayBuffer) {
    const uInt8Array = new Uint8Array(buffer);
    try {
      this.db = new SQL.Database(uInt8Array);
      this.metadataStmt = this.db.prepare('SELECT value FROM metadata WHERE name = :key');
      this.tilesStmt = this.db.prepare(
        'SELECT tile_data FROM tiles WHERE tile_column = :x AND tile_row = :y AND zoom_level = :z'
      );
      this.initialized = true;
    } catch (e) {
      throw new Error(e);
    }
  }

  public get isLoaded(): boolean {
    return this.initialized;
  }

  public getTile(x: number, y: number, z: number): Uint8Array | null {
    const data = this.tilesStmt.getAsObject({
      ':x': x,
      ':y': y,
      ':z': z,
    }) as { tile_data: Uint8Array } | null;

    return data && data.tile_data ? data.tile_data : null;
  }

  public getMetadata(key: string) {
    return this.metadataStmt.getAsObject({
      ':key': key,
    }) as { value: string };
  }

  public get attribution(): string | null {
    const value = this.getMetadata('attribution').value;

    return value ? value.toString() : null;
  }

  public get description(): string | null {
    const value = this.getMetadata('description').value;

    return value ? value.toString() : null;
  }

  public get center(): string[] | null {
    const value = this.getMetadata('center').value;

    return value ? value.toString().split(',') : null;
  }

  public get format(): string | null {
    const value = this.getMetadata('format').value;

    return value ? value.toString() : null;
  }

  public get bounds(): string[] | null {
    const value = this.getMetadata('bounds').value;

    return value ? value.toString().split(',') : null;
  }

  public get minZoom(): number | null {
    const value = this.getMetadata('minZoom').value;

    return value ? Number(value) : null;
  }

  public get maxZoom(): number | null {
    const value = this.getMetadata('maxZoom').value;

    return value ? Number(value) : null;
  }

  public get name(): string | null {
    const value = this.getMetadata('name').value;

    return value ? value.toString() : null;
  }

  public close(): void {
    if (this.initialized) {
      // this.metadataStmt.free();
      // this.tilesStmt.free();
      this.db.close();
    }
  }
}
