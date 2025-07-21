import type { localization } from "#shared/utils/localization";

declare global {
  interface MappedLoveUser {
    id: number;
    name: string;
    email: string;
    country: string | null;
    birthDate: number | null;
    showAvatar: boolean;
    confirmed: boolean;
    language: MappedLoveLocales;
    createdAt: number;
    updatedAt: number;
  }
  interface MappedLovePartner {
    id: number;
    hash: string;
    name: string;
    showAvatar: boolean;
    birthDate: number | null;
    country: string | null;
    updatedAt: number;
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
    id: number;
    code: string;
    partner1: number | null;
    partner2: number | null;
    partners?: MappedLovePartner[];
    coupleDate: number | null;
    bonded: boolean;
    public: boolean;
    premium: boolean;
    subscriptionId?: string | null;
    nextPayment: number | null;
    createdAt: number;
    updatedAt: number;
  }
  interface MappedLoveStory {
    id: number;
    hash?: string;
    marker: number;
    user: number;
    description: string | null;
    year: number;
    month: number;
    updatedAt: number;
    createdAt: number;
  }
  interface MappedLoveMap {
    markers: MappedLoveMarker[];
    stories: MappedLoveStory[];
  }
  interface MappedLovePublicMap extends MappedLoveBond {
    partners: MappedLovePartner[];
    markers: MappedLoveMarker[];
    stories: MappedLoveStory[];
  }
  interface MappedLoveSelectedMarker extends MappedLoveMarker {
    stories: MappedLoveStory[];
  }
  interface MappedLoveAccountData {
    user: Omit<User, | "bond"> & {
      bond?: Omit<MappedLoveBond, "partner1" | "partner2", "partners"> & {
        partners?: Omit<MappedLovePartner, "updatedAt" | "showAvatar" | "hash">[];
        markers?: MappedLoveMarker[];
        stories?: MappedLoveStory[];
      };
    };
  }
  interface MappedLoveSeoOptions {
    title?: string;
    description?: string;
    path?: string;
    name?: string;
    image?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAlt?: string;
    robots?: boolean;
  }

  type MappedLoveLocales = typeof localization["code"];
}

export {};
