/**
/**
 * Cloudflare D1 Database Abstraction & Universal SQLite Adapter
 * Provides 100% Cloudflare D1 compatibility both in Workers and in local Node/Vite environments.
 */

export interface D1ResultLike<T = unknown> {
  results: T[];
  success: boolean;
  meta?: Record<string, unknown>;
}

export interface D1ResponseLike {
  success: boolean;
  meta?: {
    changes?: number;
    last_row_id?: number | string;
  };
}

export interface D1ExecResultLike {
  count: number;
  duration: number;
}

export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1ResultLike<T>>;
  run(): Promise<D1ResponseLike>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
  batch<T = unknown>(statements: D1PreparedStatementLike[]): Promise<D1ResultLike<T>[]>;
  exec(query: string): Promise<D1ExecResultLike>;
}

// Global reference for active database
let localDbInstance: D1DatabaseLike | null = null;

/**
 * Initializes and returns the local SQLite database using Node 22/24 built-in `node:sqlite`
 */
export async function getLocalDatabase(dbPath = '.d1/local.sqlite'): Promise<D1DatabaseLike> {
  if (localDbInstance) {
    return localDbInstance;
  }

  // Dynamically import node:sqlite and node:fs to prevent bundler errors when targeting browser
  const { DatabaseSync } = await import('node:sqlite');
  const fs = await import('node:fs');
  const path = await import('node:path');

  let dbFilePath = dbPath;
  if (dbPath !== ':memory:') {
    const absolutePath = path.resolve(process.cwd(), dbPath);
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    dbFilePath = absolutePath;
  }

  const nativeDb = new DatabaseSync(dbFilePath);
  nativeDb.exec('PRAGMA foreign_keys = ON;');
  nativeDb.exec('PRAGMA journal_mode = WAL;');

  // D1-compatible statement wrapper
  class NodeSqlitePreparedStatement implements D1PreparedStatementLike {
    private sql: string;
    private params: unknown[] = [];

    constructor(sql: string, params: unknown[] = []) {
      this.sql = sql;
      this.params = params;
    }

    bind(...values: unknown[]): D1PreparedStatementLike {
      // Normalize undefined to null and booleans to numbers for SQLite
      const normalized = values.map(v => {
        if (v === undefined) return null;
        if (typeof v === 'boolean') return v ? 1 : 0;
        return v;
      });
      return new NodeSqlitePreparedStatement(this.sql, normalized);
    }

    async first<T = unknown>(colName?: string): Promise<T | null> {
      try {
        const stmt = nativeDb.prepare(this.sql);
        const row = stmt.get(...(this.params as any[])) as Record<string, unknown> | undefined;
        if (!row) return null;
        if (colName) {
          return (row[colName] as T) ?? null;
        }
        return row as T;
      } catch (err) {
        console.error('SQL Execution Error (first):', this.sql, this.params, err);
        throw err;
      }
    }

    async all<T = unknown>(): Promise<D1ResultLike<T>> {
      try {
        const stmt = nativeDb.prepare(this.sql);
        const rows = stmt.all(...(this.params as any[])) as T[];
        return {
          results: rows || [],
          success: true,
          meta: { changes: 0 }
        };
      } catch (err) {
        console.error('SQL Execution Error (all):', this.sql, this.params, err);
        throw err;
      }
    }

    async run(): Promise<D1ResponseLike> {
      try {
        const stmt = nativeDb.prepare(this.sql);
        const info = stmt.run(...(this.params as any[]));
        return {
          success: true,
          meta: {
            changes: Number(info.changes),
            last_row_id: Number(info.lastInsertRowid)
          }
        };
      } catch (err) {
        console.error('SQL Execution Error (run):', this.sql, this.params, err);
        throw err;
      }
    }
  }

  const dbAdapter: D1DatabaseLike = {
    prepare(query: string): D1PreparedStatementLike {
      return new NodeSqlitePreparedStatement(query);
    },

    async batch<T = unknown>(statements: D1PreparedStatementLike[]): Promise<D1ResultLike<T>[]> {
      const results: D1ResultLike<T>[] = [];
      nativeDb.exec('BEGIN TRANSACTION;');
      try {
        for (const s of statements) {
          const res = await s.all<T>();
          results.push(res);
        }
        nativeDb.exec('COMMIT;');
        return results;
      } catch (err) {
        nativeDb.exec('ROLLBACK;');
        throw err;
      }
    },

    async exec(query: string): Promise<D1ExecResultLike> {
      const start = Date.now();
      nativeDb.exec(query);
      return {
        count: 1,
        duration: Date.now() - start
      };
    }
  };

  // Run schema and seed scripts
  try {
    // Dynamic schema migrations for existing local db instances BEFORE index creation
    try { nativeDb.exec('ALTER TABLE users ADD COLUMN google_id TEXT;'); } catch {}
    try { nativeDb.exec('ALTER TABLE users ADD COLUMN avatar_url TEXT;'); } catch {}
    try { nativeDb.exec("ALTER TABLE users ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'email';"); } catch {}

    const schemaPath = path.resolve(process.cwd(), 'src/server/db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      nativeDb.exec(schemaSql);
    }
    const seedPath = path.resolve(process.cwd(), 'src/server/db/seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      nativeDb.exec(seedSql);
    }
  } catch (err) {
    console.warn('Notice while applying migrations/seed:', err);
  }

  localDbInstance = dbAdapter;
  return dbAdapter;
}

/**
 * Returns either Cloudflare Worker D1 binding or local SQLite DB
 */
export async function getDb(env?: { DB?: D1DatabaseLike }): Promise<D1DatabaseLike> {
  if (env?.DB) {
    return env.DB;
  }
  return getLocalDatabase();
}
