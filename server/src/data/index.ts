import { Sequelize } from "sequelize-typescript";
import { QueryTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USERNAME!,
  process.env.DB_PASSWORD!,
  {
    dialect: "postgres",
    host: process.env.DB_HOSTNAME,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

async function deleteDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Conexion exitosa a la base de datos");

    // Consulta las tablas que se encuentren en la base de datos
    const tables: any[] = await sequelize.query(
      `SELECT tableName FROM pg_tables WHERE schemaname = 'public';`,
      { type: QueryTypes.SELECT }
    );

    for (const row of tables) {
      const tableName = row.tablename;

      if (!tableName) {
        console.warn("Se encontro una fila sin nombre", row);
        continue;
      }

      // Elimina los datos de la tablas encontradas
      await sequelize.query(
        `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`
      );
      console.log(`Tabla truncada: ${tableName}`);
    }

  } catch (error) {
    console.error("Error al limpiar la base de datos", error);
  } finally {
    await sequelize.close();
  }
}

deleteDatabase();
