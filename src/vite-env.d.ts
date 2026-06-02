/// <reference types="vite/client" />

declare module '*.glb?inline' {
  const dataUrl: string
  export default dataUrl
}
