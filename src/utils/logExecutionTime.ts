export function LogExecutionTime() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - start;

      console.log(`Execution time for ${propertyKey}: ${duration}ms`);
      return result;
    };

    return descriptor;
  };
}
