import {
  GQLQueryData,
  GQLQueryObject,
  QueryExecutor,
  gqlparse,
  queryDataToQueryObject,
  throwGQLErrors
} from 'graphql-client-utilities';
import { SessionData } from '../models/auth-session-data';
import { clearAuthSessionData, getAuthSessionData, setAuthSessionData } from './session-storage';

export const isSigned = (): boolean => {
  const data = getAuthSessionData();
  return !!data;
};

export const getSessionDataFragment = (): GQLQueryObject => {
  const fragment = gqlparse`
  fragment sessionData on SessionData {
    user{
      fullName
      firstName
      lastName
      username 
      email
      picture
   
    }
    roles,
    permissions{
      resource
      access
      value
      scope
    }
    jwt
    data{
      iss
      sub
      aud
      exp
      nbf
      iat
      jti
      name
      given_name
      family_name
      middle_name
      nickname
      preferred_username
      profile
      picture
      website
      email
      email_verified
      gender
      birthdate
      zoneinfo
      locale
      phone_number
      phone_number_verified
      address
      updated_at
      nonce
      auth_time
      sid
      scope
      client_id
      exi
      roles
      groups
      entitlements
      location
      place_of_birth
      nationalities
      birth_family_name
      birth_given_name
      birth_middle_name
      salutation
      title
      msisdn
      also_known_as
      
    }
  }
  `;
  return fragment;
};

export const login = async (
  queryExecutor: QueryExecutor,
  username: string,
  password: string,
  fragment?: GQLQueryData
): Promise<SessionData | undefined> => {
  const finalFragment = fragment ? queryDataToQueryObject(fragment) : getSessionDataFragment();
  const query = gqlparse`
  query QueryLogin($username: String!, $password: String!){
  
    sessionData:login(username: $username, password: $password){
      
      ...${finalFragment.operationName}
    }
    
  }
    ${finalFragment.query}
  `;

  return queryExecutor<{ sessionData: SessionData }>(query, { username, password })
    .then(throwGQLErrors)
    .then((result) => result.data.sessionData)
    .then(setAuthSessionData);
};

export const logout = async (): Promise<void> => {
  clearAuthSessionData();
};
