export {};

declare global {
  interface MappedLoveSession {
    user?: MappedLoveUser
  }
  interface MappedLoveUser {
    id: number,
    name: string,
    email: string,
    showAvatar: number,
    confirmed: number,
    bond?: MappedLoveBond
  }
  interface MappedLovePartner {
    id: number,
    name: string,
    showAvatar: number,
    country: string | null
  }
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
  interface MappedLoveBond {
    id: number
    code: string,
    partner1: MappedLovePartner | number | null,
    partner2: MappedLovePartner | number | null,
    coupleDate: number | null,
    bonded: number,
    public: number
  }
  interface MappedLoveStory {
    id: number,
    marker: number,
    description: string,
    year: number,
    month: number
  }
  interface MappedLoveMap {
    markers: MappedLoveMarker[],
    stories: MappedLoveStory[]
  }
}
