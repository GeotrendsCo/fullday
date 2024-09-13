

// Función para crear un gráfico simple
function crearGraficoPrueba() {
    const ctx = document.getElementById('graficoPrueba').getContext('2d');

    // Crear un gráfico de barras simple con datos estáticos
    const myChart = new Chart(ctx, {
        type: 'bar',  // Tipo de gráfico: barras
        data: {
            labels: ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4', 'Equipo 5'],  // Etiquetas para el eje X
            datasets: [{
                label: 'Puntaje',
                data: [12, 19, 3, 5, 2],  // Datos de prueba
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
}

// Llamar a la función para crear el gráfico al cargar la página
crearGraficoPrueba();
