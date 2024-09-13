document.getElementById('ensambleForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        nombre: document.getElementById('nombre').value,
        tiempo: document.getElementById('tiempo').value,
        costo: document.getElementById('costo').value,
        problemas: document.getElementById('problemas').value
    };

    try {
        const response = await fetch('http://localhost:3001/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const result = await response.text();
        alert(result);
    } catch (error) {
        console.error('Error enviando los datos:', error);
    }
});

async function obtenerDatosEnsambles() {
    try {
        const response = await fetch('http://localhost:3001/ensambles');
        const data = await response.json();
        console.log('Datos obtenidos:', data);
        // Aquí es donde usaremos Chart.js para graficar los datos
        mostrarGrafico(data);
    } catch (error) {
        console.error('Error al obtener los ensambles:', error);
    }
}

