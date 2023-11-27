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
