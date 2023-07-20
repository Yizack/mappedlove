export {};

declare global {
  interface MappedLoveMarker {
    bond?: number,
    id: number,
    lat: number,
    lng: number,
    group: number,
    title: string,
    description: string,
    order: number
  }
}
