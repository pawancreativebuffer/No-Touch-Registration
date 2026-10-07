export interface UserDetails {
  userName: string;
  login: string;
  password: string;
  email: string;
  division: string;
  landline: string;
  mobile: string;
  address1: string;
  address2: string;
  state: string;
  postcode: string;
  country: string;
  region: string;
  notes: string;
}

export const EMPTY_USER_DETAILS: UserDetails = {
  userName: '',
  login: '',
  password: '',
  email: '',
  division: '',
  landline: '',
  mobile: '',
  address1: '',
  address2: '',
  state: '',
  postcode: '',
  country: '',
  region: '',
  notes: '',
};

export const COUNTRIES = ['New Zealand', 'Australia', 'United Kingdom', 'India', 'United States'];
export const REGIONS = ['North', 'South', 'East', 'West', 'Central'];
