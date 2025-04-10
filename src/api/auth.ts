export async function login(username: string, password: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: username, password }),
    },
  );

  const data = await res.json();

  localStorage.setItem("token", data.token);
  return data;
}

export async function register(
  username: string,
  email: string,
  password: string,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    },
  );

  const data = await res.json();

  return data;
}

export function logout() {
  localStorage.removeItem("token");
}
