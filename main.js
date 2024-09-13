document.getElementById('registroCostosForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Capturar los datos del formulario
  const formData = {
      llaveMinutos: document.getElementById('llaveMinutos').value,
      alicateMinutos: document.getElementById('alicateMinutos').value,
      fichasAmarillas: document.getElementById('fichasAmarillas').value,
      fichasAzules: document.getElementById('fichasAzules').value,
      fichasRojas: document.getElementById('fichasRojas').value,
      fichasBlancas: document.getElementById('fichasBlancas').value,
      fichasOtrosColores: document.getElementById('fichasOtrosColores').value,
      nominaTiempo: document.getElementById('nominaTiempo').value,
      aguaConsumo: document.getElementById('aguaConsumo').value,
      luzConsumo: document.getElementById('luzConsumo').value,
      internetConsumo: document.getElementById('internetConsumo').value
  };

  try {
      const response = await fetch('http://localhost:3001/submit', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      });

      if (response.ok) {
          alert('Costos registrados correctamente');
      } else {
          alert('Error al registrar los costos');
      }
  } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Error en la conexión con el servidor');
  }
});
