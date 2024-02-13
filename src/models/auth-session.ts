export interface AuthJWTData {
  /**
   * Issuer
   *
   */
  iss: string;
  /**
   * Subject
   * The "sub" (subject) claim identifies the principal that is the
   * subject of the JWT.  The claims in a JWT are normally statements
   * about the subject.  The subject value MUST either be scoped to be
   * locally unique in the context of the issuer or be globally unique.
   * The processing of this claim is generally application specific.  The
   * "sub" value is a case-sensitive string containing a StringOrURI
   * value.  Use of this claim is OPTIONAL.
   *
   */
  sub: string;
  /**
   * Audience (allowed clients)
   *
   */
  aud?: string;
  /**
   * Expiration Time
   *
   */
  exp?: Date;
  /**
   * Not Before
   *
   */
  nbf?: Date;
  /**
   * Issued At
   *
   */
  iat?: Date;
  /**
   * JWT ID
   *
   */
  jti?: string;
  /**
   * Full name
   *
   */
  name: string;
  /**
   * Given name(s) or first name(s)
   *
   */
  given_name?: string;
  /**
   * Surname(s) or last name(s)
   *
   */
  family_name?: string;
  /**
   * Middle name(s)
   *
   */
  middle_name?: string;
  /**
   * Casual name
   *
   */
  nickname?: string;
  /**
   * Shorthand name by which the End-User wishes to be referred to
   *
   */
  preferred_username: string;
  /**
   * Profile page URL
   *
   */
  profile?: string;
  /**
   * Profile picture URL
   *
   */
  picture?: string;
  /**
   * Web page or blog URL
   *
   */
  website?: string;
  /**
   * Preferred e-mail address
   *
   */
  email?: string;
  /**
   * True if the e-mail address has been verified; otherwise false
   *
   */
  email_verified?: string;
  /**
   * Gender
   *
   */
  gender?: string;
  /**
   * Birthday
   *
   */
  birthdate?: string;
  /**
   * Time zone
   *
   */
  zoneinfo?: string;
  /**
   * Locale
   *
   */
  locale?: string;
  /**
   * Preferred telephone number
   *
   */
  phone_number?: string;
  /**
   * True if the phone number has been verified; otherwise false
   *
   */
  phone_number_verified?: boolean;
  /**
   * Preferred postal address
   *
   */
  address?: string;
  /**
   * Time the information was last updated
   *
   */
  updated_at?: Date;

  /**
   * Value used to associate a Client session with an ID Token (MAY also be used for nonce values in other applications of JWTs)
   *
   */
  nonce?: string;
  /**
   * Time when the authentication occurred
   *
   */
  auth_time?: Date;

  /**
   * Session ID
   *
   */
  sid?: string;

  /**
   * Scope Values (example  "scope"?:"email profile phone address")
   *
   */
  scope?: string;
  /**
   * The client_id claim carries the client identifier of the OAuth 2.0 [RFC6749] client that requested the token
   *
   */
  client_id?: string;

  /**
   * Expires in  Lifetime of the token in seconds
   * from the time the RS first sees it.  Used to implement a weaker
   * from of token expiration for devices that cannot synchronize their
   * internal clocks.
   *
   */
  exi?: number;
  /**
   * A list of roles for the user that collectively represent who the
   * user is, e.g., "Student", "Faculty".  No vocabulary or syntax is
   * specified, although it is expected that a role value is a String
   * or label representing a collection of entitlements.  This value
   * has no canonical types.
   *
   */
  roles?: string[];
  /**
   * A list of groups to which the user belongs, either through direct
   * membership, through nested groups, or dynamically calculated.  The
   * values are meant to enable expression of common group-based or
   * role-based access control models, although no explicit
   * authorization model is defined.  It is intended that the semantics
   * of group membership and any behavior or authorization granted as a
   * result of membership are defined by the service provider.  The
   * canonical types "direct" and "indirect" are defined to describe
   * how the group membership was derived.  Direct group membership
   * indicates that the user is directly associated with the group and
   * SHOULD indicate that clients may modify membership through the
   * "Group" resource.  Indirect membership indicates that user
   * membership is transitive or dynamic and implies that clients
   * cannot modify indirect group membership through the "Group"
   * resource but MAY modify direct group membership through the
   * "Group" resource, which may influence indirect memberships.  If
   * the SCIM service provider exposes a "Group" resource, the "value"
   *
   */
  groups?: string[];
  /**
   * A list of entitlements for the user that represent a thing the
   * user has.  An entitlement may be an additional right to a thing,
   * object, or service.  No vocabulary or syntax is specified; service
   * providers and clients are expected to encode sufficient
   * information in the value so as to accurately and without ambiguity
   * determine what the user has access to.  This value has no
   * canonical types, although a type may be useful as a means to scope
   * entitlements.
   *
   */
  entitlements?: string[];

  /**
   * The geographic location (TEMPORARY - registered 2022-03-23, extension registered 2023-02-13, expires 2024-03-23)
   *
   */
  location?: string;

  /**
   * A structured Claim representing the End-User's place of birth.
   *
   */
  place_of_birth?: string;
  /**
   * String array representing the End-User's nationalities.
   *
   */
  nationalities?: string;
  /**
   * Family name(s) someone has when they were born, or at least from the time they were a child. This term can be used by a person who changes the family name(s) later in life for any reason. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters.
   *
   */
  birth_family_name?: string;
  /**
   * Given name(s) someone has when they were born, or at least from the time they were a child. This term can be used by a person who changes the given name later in life for any reason. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.
   *
   */
  birth_given_name?: string;
  /**
   * Middle name(s) someone has when they were born, or at least from the time they were a child. This term can be used by a person who changes the middle name later in life for any reason. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used.
   *
   */
  birth_middle_name?: string;
  /**
   * End-User's salutation, e.g., "Mr."
   *
   */
  salutation?: string;
  /**
   * End-User's title, e.g., "Dr."
   *
   */
  title?: string;
  /**
   * End-User's mobile phone number formatted according to ITU-T recommendation
   *
   */
  msisdn?: string;
  /**
   * Stage name, religious name or any other type of alias/pseudonym with which a person is known in a specific context besides its legal name. This must be part of the applicable legislation and thus the trust framework (e.g., be an attribute on the identity card).
   *
   */
  also_known_as?: string;
}
