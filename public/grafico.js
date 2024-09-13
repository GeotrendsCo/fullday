// Función para obtener los datos desde la ruta /ensambles
async function obtenerDatosDesdeBase() {
    try {
        const response = await fetch('http://localhost:3001/ensambles');
        const data = await response.json();

        // Verificar qué datos estamos obteniendo
        console.log('Datos obtenidos:', data);

        // Procesar los datos para el gráfico
        const nombres = data.map(item => item.id);  // Nombres de los equipos
        const tiemposLlave = data.map(item => item.llave_minutos);  // Tiempo de uso de la llave de tuercas
        const tiemposAlicate = data.map(item => item.alicate_minutos);  // Tiempo de uso del alicate

        // Verificar los ejes X y Y antes de graficar
        console.log('Ejes X (nombres):', nombres);
        console.log('Ejes Y (tiempos llave):', tiemposLlave);
        console.log('Ejes Y (tiempos alicate):', tiemposAlicate);

        // Crear el gráfico
        const ctx = document.getElementById('graficoDatos').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',  // Tipo de gráfico: barras
            data: {
                labels: nombres,  // Nombres de los equipos (Eje X)
                datasets: [{
                    label: 'Tiempo de Uso de Llave (minutos)',
                    data: tiemposLlave,  // Datos del tiempo de uso de la llave (Eje Y)
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Tiempo de Uso de Alicate (minutos)',
                    data: tiemposAlicate,  // Datos del tiempo de uso del alicate (Eje Y)
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true  // Asegurar que el eje Y comienza en 0
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Llamar a la función para obtener los datos y crear el gráfico al cargar la página
obtenerDatosDesdeBase();
