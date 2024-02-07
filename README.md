## GQL-PDSS-Auth-Web-client

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Libreria con utilidades para la api gql-pdss-auth

## Funciones

- isSigned: Recupera true si hay datos del usuario false en caso contrario.

```
    const signed =isSigned();
```

- setAuthStorageKey: Establece la clave o nombre con el que se va a guardar y recuperar los datos de la sesión. Solo se puede ejecutar una vez en la aplicación

```
    setAuthStorageKey('myAuthStorageKey')
```

- getAuthStorageKey: Recupera la clave o nombre con el que se guardan y recuperan los datos de la sesión, Su valor predeterminado es 'gqlpdssauthsessionstoragekey'

```
    const key = getAuthStorageKey();
```

- setAuthStorage: Establece el tipo de almacenamiento (SCRIPT, LOCALSTORAGE, SESSIONSTORAGE o COOKIES). Solo se puede ejecutar una vez en la aplicación;
  - SCRIPT: Guarda los datos en una variable global
  - LOCALSTORAGE: Guarda los datos en localStorage
  - SESSIONSTORAGE: Guarda los datos en sessionStorage
  - COOKIES: Guarda los datos en cookies

```
    setAuthStorage('COOKIES');
```

- getAuthStorage: Recupera el tipo de almacenamiento (SCRIPT, LOCALSTORAGE, SESSIONSTORAGE o COOKIES) como valor predeterminado retorna SCRIPT;

```
    const storageType = getAuthStorage();
```

- setAuthStorageTimelife: Establece el tiempo en milisegundos en los que van a ser válidos los datos de la sesión después de haber sido inicializados.Solo se puede ejecutar una vez en la aplicación

```
    setAuthStorageTimelife(20*60*1000); // establece la vigencia a 20 minutos
```

- getAuthStorageTimelife: Recupera el tiempo en milisegundos en los que van a ser válidos los datos de la sesión después de haber sido inicializados. Como valor predeterminado tiene 30 minutos

```
    const lifetime = getAuthStorageTimelife();
```

- setAuthSessionData: Establece los datos de la sesión utilizando los valores globales asignados para authStorageKey, authStorage y authStorageTimeLife.

Argumentos:

- data: SessionData
- lifetimeInMiliSeconds: number

```
    setAuthSessionData(data,lifetimeInMiliSeconds);
```

- getAuthSessionData: Recupera los datos de la sesión utilizando los valores globales asignados para authStorageKey, authStorage y authStorageTimeLife.

```
    const session: SessionData = getAuthSessionData();
```

- clearAuthSessionData: Elimina los datos de la sesión guardados utilizando los valores globales asignados para authStorageKey y authStorage.

```
    clearAuthSessionData();
```

- getAuthSessionDataFromScript: Recupera los datos de la sesión guardados en la variable global en el script utilizando los valores globales asignados para authStorageKey y authStorageTimeLife

- getAuthSessionDataFromLocalStorage: Recupera los datos de la sesión guardados en localStorage utilizando los valores globales asignados para authStorageKey y authStorageTimeLife

- getAuthSessionDataFromSessionStorage: Recupera los datos de la sesión guardados en sessionStorage utilizando los valores globales asignados para authStorageKey y authStorageTimeLife

- getAuthSessionDataFromCookies: Recupera los datos de la sesión guardados en cookies utilizando los valores globales asignados para authStorageKey y authStorageTimeLife

- setAuthSessionDataToSessionStorage: Guarda los datos de la sesión en la variable global en el script utilizando los valores globales asignados para authStorageKey y authStorageTimeLife

- setAuthSessionDataToLocalStorage: Guarda los datos de la sesión en localStorage utilizando los valores globales asignados para authStorageKey y authStorageTimeLife

- setAuthSessionDataToCookies: Guarda los datos de la sesión en sessionStorage utilizando los valores globales asignados para authStorageKey y authStorageTimeLife

- setAuthSessionDataToScript: Guarda los datos de la sesión en cookies utilizando los valores globales asignados para authStorageKey y authStorageTimeLife

- clearAuthSessionDataToScript: Elimina los datos de la sesión guardados en la variable global en el script utilizando los valores globales asignados para authStorageKey.

- clearAuthSessionDataToCookies: Elimina los datos de la sesión guardados en cookies utilizando los valores globales asignados para authStorageKey.

- clearAuthSessionDataToLocalStorage: Elimina los datos de la sesión guardados en localStorage utilizando los valores globales asignados para authStorageKey.

- clearAuthSessionDataToSessionStorage: Elimina los datos de la sesión guardados en sessionStorage utilizando los valores globales asignados para authStorageKey.
