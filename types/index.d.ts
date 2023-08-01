export {};

declare global {
  interface MappedUser {
    user : {
      id: number,
      name: string,
      email: string,
      showAvatar: number,
      confirmed: number,
      bond?: MappedLoveBond
    }
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
    partner1: number | null,
    partner2: number | null,
    coupleDate: number | null,
    bonded: number,
    public: number
  }
  interface MappedLoveStory {
    id: number,
    marker: number,
    title: string,
    description: string,
    date: number
  }
}
