import { Knex } from 'knex'
import path from 'node:path'

import { Configuration } from '.'

export default function buildKnexConfiguration(): Knex.Config {
  return {
    client: 'pg',
    connection: Configuration.databaseUrl,
    searchPath: [Configuration.databaseSchema],
    pool: {
      min: 2,
      max: 20,
      afterCreate: (conn, done) => {
        if (process.env.DATABASE_ROLE) {
          conn
            .query('SET ROLE ' + process.env.DATABASE_ROLE)
            .catch((error) => done(error, conn))
            .then(() => done(null, conn))
        } else {
          done(null, conn)
        }
      },
    },
    migrations: {
      extension: 'ts',
      directory: path.join(__dirname, '..', 'migrations'),
    },
  }
}
