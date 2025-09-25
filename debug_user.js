// Script temporal para debuggear el usuario actual
// Ejecutar desde la consola del navegador o Metro

const debugUser = async () => {
  try {
    // Simular obtener token desde AsyncStorage
    const token = await AsyncStorage.getItem('token');
    console.log('Token stored:', token ? 'exists' : 'not found');
    
    if (token) {
      // Simular llamada al backend
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Response from /auth/me:', data);
      
      if (data.success) {
        console.log('User data:', data.data);
        console.log('User role:', data.data?.role);
      }
    }
  } catch (error) {
    console.error('Error in debugUser:', error);
  }
};

// Para ejecutar: debugUser();
console.log('Debug function ready. Execute: debugUser()');