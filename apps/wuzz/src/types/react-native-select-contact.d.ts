declare module 'react-native-select-contact' {
  export interface PhoneEntry {
    number: string;
    type: string;
  }

  export interface Contact {
    name: string;
    phones: PhoneEntry[];
    emails: { address: string; type: string }[];
    postalAddresses: unknown[];
  }

  export interface ContactPhoneSelection {
    contact: Contact;
    selectedPhone: PhoneEntry;
  }

  export function selectContactPhone(): Promise<ContactPhoneSelection | null>;
  export function selectContact(): Promise<Contact | null>;
  export function selectContactEmail(): Promise<unknown>;
  export function selectContactPostalAddress(): Promise<unknown>;
}
