import type { ErrorCode } from "~/types/enums/errors";

export {};

declare global {
  interface MappedLoveSession {
    user?: MappedLoveUser;
  }
  interface MappedLoveUser {
    id: number;
    name: string;
    email: string;
    country: string | null;
    birthDate: number | null;
    showAvatar: number;
    confirmed: number;
    createdAt: number;
    updatedAt: number;
    bond?: MappedLoveBond;
  }
  interface MappedLovePartner {
    id: number;
    name: string;
    showAvatar: number;
    country: string | null;
  }
  interface MappedLoveMarker {
    bond?: number;
    id: number;
    lat: number;
    lng: number;
    group: number;
    title: string;
    description: string;
    order: number;
  }
  interface MappedLoveBond {
    id: number
    code: string;
    partner1: MappedLovePartner | number | null;
    partner2: MappedLovePartner | number | null;
    coupleDate: number | null;
    bonded: number;
    public: number;
  }
  interface MappedLoveStory {
    id: number;
    marker: number;
    description: string;
    year: number;
    month: number;
    updatedAt: number;
  }
  interface MappedLoveMap {
    markers: MappedLoveMarker[];
    stories: MappedLoveStory[];
  }
  interface MappedLoveToast {
    message: string;
    success: boolean;
    id?: number;
  }
  interface MappedLovePublicMap extends MappedLoveBond {
    markers: MappedLoveMarker[];
    stories: MappedLoveStory[];
  }
  interface MappedLoveSelectedMarker extends MappedLoveMarker {
    stories: MappedLoveStory[];
  }
  type ErrorCode = typeof ErrorCode;
}
