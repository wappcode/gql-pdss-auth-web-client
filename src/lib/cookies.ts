export const setCookie = (
  name: string,
  value: string,
  lifetimeInMiliSeconds: number
) => {
  const d = new Date();
  d.setTime(d.getTime() + lifetimeInMiliSeconds);
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

export const getCookie = (name: string): string | undefined => {
  let cookieName = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cookieName) == 0) {
      return c.substring(cookieName.length, c.length);
    }
  }
  return undefined;
};
