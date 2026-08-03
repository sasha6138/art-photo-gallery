// Node-only validation shim. Workerd resolves cloudflare:workers natively.
export async function resolve(specifier, context, nextResolve) {
  if (specifier === "cloudflare:workers") {
    return {
      url: "data:text/javascript,export const env = {};",
      shortCircuit: true,
    };
  }
  return nextResolve(specifier, context);
}
