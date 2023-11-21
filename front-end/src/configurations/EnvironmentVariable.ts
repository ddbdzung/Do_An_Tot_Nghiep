// import { ObjectSchema } from "joi";
// import * as Joi from "joi";
// import * as dotenv from "dotenv";

// export const environments = {
//   DEVELOPMENT: "development",
//   PRODUCTION: "production",
//   TEST: "test",
// };

// const getEnvFilePath = () => {
//   const { NODE_ENV } = process.env;
//   if (Object.values(environments).includes(NODE_ENV)) {
//     return `.env.${NODE_ENV}`;
//   }

//   // throw new Error(
//   //   `Invalid NODE_ENV: ${NODE_ENV}. Valid values are: ${Object.values(
//   //     environments
//   //   )}`
//   // );
// };
// dotenv.config({ path: getEnvFilePath() });

// const validationSchema = Joi.object({
//   NODE_ENV: Joi.string()
//     .valid(...Object.values(environments))
//     .required(),
//   FRONTEND_PORT: Joi.number().required(),
//   FRONTEND_BASE_URL: Joi.string().required(),
//   BACKEND_PORT: Joi.number().required(),
//   BACKEND_BASE_URL: Joi.string().required(),
//   BACKEND_PREFIX_ENTRY_POINT: Joi.string().required(),
// });

// class JoiValidation {
//   constructor(private readonly schema: ObjectSchema) {
//     this.transform(this._loadEnvFromDotEnv());
//   }

//   private _loadEnvFromDotEnv() {
//     const env = dotenv.config({ path: getEnvFilePath() });
//     // if (env.error) {
//     //   throw new Error(
//     //     `Failed to load environment variables from ${getEnvFilePath()}`
//     //   );
//     // }
//     return Object.assign(
//       {
//         NODE_ENV: process.env.NODE_ENV,
//       },
//       env.parsed
//     );
//   }

//   transform(incoming: unknown) {
//     const { value, error } = this.schema.validate(incoming);
//     if (error) {
//       throw new Error(`Validation failed: ${error.message}`);
//     }

//     return value;
//   }
// }

// let hasInitialized = false;
// export class Configuration {
//   static initialize() {
//     if (!hasInitialized) {
//       console.log("Initializing configuration");
//       new JoiValidation(validationSchema);
//       hasInitialized = true;
//       return;
//     }

//     throw new Error("Configuration already initialized");
//   }
// }

export class EnvironmentVariables {
  static getVariables() {
    return {
      app: {
        env: process.env.NODE_ENV?.toString()?.trim(),
        port: process.env.NEXT_PUBLIC_FRONTEND_PORT
          ? parseInt(process.env.NEXT_PUBLIC_FRONTEND_PORT)
          : 3000,
        baseUrl: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL?.toString()?.trim(),
      },
      backend: {
        port: process.env.NEXT_PUBLIC_BACKEND_PORT
          ? parseInt(process.env.NEXT_PUBLIC_BACKEND_PORT)
          : 3000,
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL?.toString()?.trim(),
        prefixEntryPoint:
          process.env.NEXT_PUBLIC_BACKEND_PREFIX_ENTRY_POINT?.toString()?.trim(),
      },
    };
  }
  static get(accessors: string) {
    const accessorsArray = accessors.split(".");

    let value: any = this.getVariables();
    for (const accessor of accessorsArray) {
      //@ts-nocheck
      value = value[accessor];
    }

    return value;
  }
}

export function initializeConfiguration() {
  // Configuration.initialize();
  new EnvironmentVariables();
}
initializeConfiguration();
