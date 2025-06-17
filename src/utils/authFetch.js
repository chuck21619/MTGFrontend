// src/utils/authFetch.js
export async function authFetch(url, options = {}, {
  accessToken,
  setAccessToken,
  navigate,
  retry = true,
  backendUrl,
}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 && retry) {
    const refreshRes = await fetch(`${backendUrl}/api/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    const refreshData = await refreshRes.json();
    if (refreshRes.ok && refreshData.access_token) {
      setAccessToken(refreshData.access_token);
      return authFetch(url, options, {
        accessToken: refreshData.access_token,
        setAccessToken,
        navigate,
        retry: false,
        backendUrl,
      });
    } else {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }
  }

  return res;
}
