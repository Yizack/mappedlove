module "~~/node_modules/@cf-wasm/photon/dist/esm/lib/photon_rs" {
  export * from "@cf-wasm/photon";
}

module "@cf-wasm/photon/photon.wasm?module" {
  const module: WebAssembly.Module;
  export default module;
}
