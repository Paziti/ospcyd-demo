export type AffiliateType = "Titular" | "Familiar a cargo";

export interface Plan {
  code: string;
  name: string;
}

export interface Employer {
  name: string;
  cuit: string;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  cuil: string;
  birthDate: string; // ISO yyyy-mm-dd
  email: string;
  phone: string;
  address: Address;
  photoUrl: string | null;
  affiliateNumber: string;
  affiliateType: AffiliateType;
  relationship: string | null; // parentesco cuando es familiar a cargo
  regime: string;
  plan: Plan;
  employer: Employer;
  memberSince: string; // ISO
}

/** Campos que el afiliado puede modificar por su cuenta. */
export type EditableContactFields = Pick<Member, "email" | "phone" | "address">;
