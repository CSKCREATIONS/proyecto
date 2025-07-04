// frontend/js/auth.js
export async function login(email, password) {
  const apiUrl = 'http://localhost:3000/api/auth/signin';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password: password.trim() })
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.user._id);
      localStorage.setItem('userRole', result.user.role);

      return { success: true, result };
    } else {
      return { success: false, result };
    }

  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return { success: false, error: 'No se pudo conectar con el servidor' };
  }
}
