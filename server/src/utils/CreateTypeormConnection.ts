import { createConnection, getConnectionOptions } from "typeorm";

export const createTypeormConnection = async () => {
    const environment = process.env.NODE_ENV || "dev";
    const connectionOptions = await getConnectionOptions(environment);
    return createConnection({ ...connectionOptions, name: "default" });
}