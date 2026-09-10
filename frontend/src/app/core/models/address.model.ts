export interface Address {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  building: string;
  floor?: string;
  apartment?: string;
  notes?: string;
  isDefault?: boolean;
}

export type AddressPayload = Omit<Address, 'id'>;
