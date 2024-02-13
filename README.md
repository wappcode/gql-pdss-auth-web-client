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

```
    setAuthSessionData(data);
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

- getAuthUser: Recupera los datos de un usuario (AuthSessionUser | undefined)

- getRoles: Recupera los roles del usuario (string[])

- hasRole: Recupera true si el usuario tiene el rol

- hasSomeRoles: Recupera true si el usuario tiene almenos uno de los roles de la lista

- hasAllRoles: Recupera true solo si el usuario tiene todos los roles de la lista

- getPermissions: Recupera los permisos del usuario (SessionDataPermission[])

- hasPermission: Recupera true si el usuario tiene permisos para el recurso

- hasSomePermissions: Recupera true si el usuario tiene alguno de los permisos para alguno de los recursos

- hasAllPermissions: Recupera true solo si el usuario tiene todos los permisos para todos los recursos

- getJWT: Recupera el JWT asignado a la sesión

- getSessionDataFragment: Recupera un fragmento graphql con los datos de la sesión

- login: Ejecuta el query graphql para hacer login

- logout: Limpia los datos de la sesión (Por el momento no envia solicitud al api para cerrar sesión)

- getSessionData: Recupera los datos de la sesión de un usuario logueado

- extractJWTDataFromSession: Recupera los datos del JWT que estan guardados en la sesión

- extractJWTData: Recupera los datos del un JWT
