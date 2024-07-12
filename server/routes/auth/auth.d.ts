declare module '#auth-utils' {
  interface User {
  "id": string, 
  "tokens": 
    { 
      "access_token": string, 
      "expires_in": number, 
      "refresh_token": string, 
      "scope": Array<string>, 
      "token_type": string 
    },
  "loggedInAt": string,
  }
}

export {}
