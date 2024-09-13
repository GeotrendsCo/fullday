let chartHerramientas = null;
let datosIniciales = [];  // Almacenar los datos al cargar por primera vez
// Función para calcular la media de un conjunto de valores
function calcularMedia(valores) {
    const suma = valores.reduce((a, b) => a + b, 0);  // Sumar todos los valores
    return suma / valores.length;  // Dividir por la cantidad de valores para obtener la media
}
// Función para convertir minutos decimales a formato minutos:segundos
function convertirMinutosASegundos(minutosDecimales) {
    const minutos = Math.floor(minutosDecimales);
    const segundos = Math.round((minutosDecimales - minutos) * 60);
    return `${minutos}m ${segundos}s`;
}
// Función para obtener los datos desde el servidor
async function obtenerDatosHerramientas() {
    try {
        const response = await fetch('http://44.213.153.17:3001/ensambles');
        const data = await response.json();

        // Multiplicadores
        const valorLlave = 10;
        const valorAlicate = 12.3;

        // Procesar los datos para el gráfico
        const nombresEquipos = data.map(item => `Equipo ${item.numero_grupo}`);
        const valoresLlave = data.map(item => parseFloat(item.llave_minutos) * valorLlave);
        const valoresAlicate = data.map(item => parseFloat(item.alicate_minutos) * valorAlicate);
        const tiemposLlave = data.map(item => parseFloat(item.llave_minutos));
        const tiemposAlicate = data.map(item => parseFloat(item.alicate_minutos));
        const tiemposTotales = data.map(item => parseFloat(item.llave_minutos) + parseFloat(item.alicate_minutos));
        const costosTotales = data.map(item => (parseFloat(item.llave_minutos) * valorLlave) + (parseFloat(item.alicate_minutos) * valorAlicate));

        // Calcular las medias
        const mediaLlave = calcularMedia(valoresLlave);
        const mediaAlicate = calcularMedia(valoresAlicate);
        const mediaCostoTotal = calcularMedia(costosTotales);

        // Actualizar los gráficos si ya están creados
        if (chartHerramientas) {
            actualizarGraficoHerramientas(nombresEquipos, valoresLlave, valoresAlicate, tiemposLlave, tiemposAlicate, tiemposTotales, costosTotales);
        } else {
            crearGraficoHerramientas(nombresEquipos, valoresLlave, valoresAlicate, tiemposLlave, tiemposAlicate, tiemposTotales, costosTotales, mediaLlave, mediaAlicate, mediaCostoTotal);
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}


// Función para crear el gráfico por primera vez
function crearGraficoHerramientas(nombresEquipos, valoresLlave, valoresAlicate, tiemposLlave, tiemposAlicate, tiemposTotales, costosTotales, mediaLlave, mediaAlicate, mediaCostoTotal) {
    const ctx = document.getElementById('graficoHerramientas').getContext('2d');
    chartHerramientas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombresEquipos,
            datasets: [
                {
                    label: 'Llave de Tuercas (Valor Total)',
                    data: valoresLlave,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    borderRadius: 5,  // Bordes redondeados
                    hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)'
                },
                {
                    label: 'Alicate (Valor Total)',
                    data: valoresAlicate,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    borderRadius: 5,  // Bordes redondeados
                    hoverBackgroundColor: 'rgba(153, 102, 255, 0.5)'
                },
                {
                    label: 'Costo Total (Valor Total)',
                    data: costosTotales,
                    backgroundColor: 'rgba(255, 165, 0, 0.2)',  // Naranja
                    borderColor: 'rgba(255, 165, 0, 1)',  // Naranja oscuro
                    borderWidth: 2,
                    borderRadius: 5,  // Bordes redondeados
                    hoverBackgroundColor: 'rgba(255, 165, 0, 0.5)'
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Costo Total ($)'  // Nombre del eje Y
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Equipos'  // Nombre del eje X
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            let label = '';
                            if (context.dataset.label === 'Llave de Tuercas (Valor Total)') {
                                const tiempoLlave = convertirMinutosASegundos(tiemposLlave[index]);
                                label = `Tiempo Llave: ${tiempoLlave}`;
                            } else if (context.dataset.label === 'Alicate (Valor Total)') {
                                const tiempoAlicate = convertirMinutosASegundos(tiemposAlicate[index]);
                                label = `Tiempo Alicate: ${tiempoAlicate}`;
                            } else if (context.dataset.label === 'Costo Total (Valor Total)') {
                                const tiempoTotal = convertirMinutosASegundos(tiemposTotales[index]);
                                label = `Tiempo Total: ${tiempoTotal}`;
                            }
                            return [
                                label,
                                `Media Llave: $${mediaLlave.toFixed(2)}`,
                                `Media Alicate: $${mediaAlicate.toFixed(2)}`,
                                `Media Costo Total: $${mediaCostoTotal.toFixed(2)}`
                            ];
                        }
                    }
                },
                // Líneas de la media
                annotation: {
                    annotations: {
                        lineaMediaLlave: {
                            type: 'line',
                            yMin: mediaLlave,
                            yMax: mediaLlave,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: 'Media Llave',
                                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                position: 'center'
                            }
                        },
                        lineaMediaAlicate: {
                            type: 'line',
                            yMin: mediaAlicate,
                            yMax: mediaAlicate,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: 'Media Alicate',
                                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                                position: 'center'
                            }
                        },
                        lineaMediaCostoTotal: {
                            type: 'line',
                            yMin: mediaCostoTotal,
                            yMax: mediaCostoTotal,
                            borderColor: 'rgba(255, 165, 0, 1)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: 'Media Costo Total',
                                backgroundColor: 'rgba(255, 165, 0, 0.5)',
                                position: 'center'
                            }
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutBounce'
            }
        }
    });
}


// Función para actualizar el gráfico cuando llegan nuevos datos
function actualizarGraficoHerramientas(nombresEquipos, valoresLlave, valoresAlicate, tiemposLlave, tiemposAlicate, tiemposTotales, costosTotales) {
    // Recalcular las medias con los nuevos datos
    const mediaLlave = calcularMedia(valoresLlave);
    const mediaAlicate = calcularMedia(valoresAlicate);
    const mediaCostoTotal = calcularMedia(costosTotales);

    // Actualizar los datos del gráfico
    chartHerramientas.data.labels = nombresEquipos;
    chartHerramientas.data.datasets[0].data = valoresLlave;
    chartHerramientas.data.datasets[1].data = valoresAlicate;
    chartHerramientas.data.datasets[2].data = costosTotales;

    // Actualizar las líneas de media con las nuevas medias calculadas
    chartHerramientas.options.plugins.annotation.annotations.lineaMediaLlave.yMin = mediaLlave;
    chartHerramientas.options.plugins.annotation.annotations.lineaMediaLlave.yMax = mediaLlave;
    chartHerramientas.options.plugins.annotation.annotations.lineaMediaAlicate.yMin = mediaAlicate;
    chartHerramientas.options.plugins.annotation.annotations.lineaMediaAlicate.yMax = mediaAlicate;
    chartHerramientas.options.plugins.annotation.annotations.lineaMediaCostoTotal.yMin = mediaCostoTotal;
    chartHerramientas.options.plugins.annotation.annotations.lineaMediaCostoTotal.yMax = mediaCostoTotal;

    // Actualizar el gráfico
    chartHerramientas.update();
}



// Llamar a la función para obtener los datos al cargar la página
obtenerDatosHerramientas();

// Actualizar el gráfico cada 10 segundos
setInterval(obtenerDatosHerramientas, 3000);  // Actualizar cada 10 segundos
// Función para resetear el dashboard
// Función para resetear el dashboard
function resetearDashboard() {
    chartHerramientas.data.labels = [];
    chartHerramientas.data.datasets.forEach(dataset => dataset.data = []);
    chartHerramientas.update();

    console.log('Dashboard reseteado. Solo se tomarán nuevos datos.');
}
let graficosDonas = {};  // Almacenar los gráficos de donas por equipo

// Valores unitarios de las fichas
const valorFichas = {
    'amarillas': 5.25,
    'azules': 8.6,
    'rojas': 1.2,
    'blancas': 10,
    'otros_colores': 7.2
};

// Función para obtener los datos desde el servidor
async function obtenerDatosEquipos() {
    try {
        const response = await fetch('http://44.213.153.17:3001/ensambles');
        const data = await response.json();

        // Procesar los datos y crear o actualizar gráficos de donas por equipo
        data.forEach((equipo) => {
            const equipoId = `equipo${equipo.numero_grupo}`;
            if (graficosDonas[equipoId]) {
                // Si el gráfico ya existe, actualizarlo
                actualizarGraficoDona(equipo);
            } else {
                // Si el gráfico no existe, crearlo
                crearGraficoDona(equipo);
            }
        });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Función para crear el gráfico de dona por equipo
function crearGraficoDona(equipo) {
    const equipoId = `equipo${equipo.numero_grupo}`;

    // Calcular el valor total de las fichas usadas por equipo
    const valorTotalFichas = [
        equipo.fichas_amarillas * valorFichas['amarillas'],
        equipo.fichas_azules * valorFichas['azules'],
        equipo.fichas_rojas * valorFichas['rojas'],
        equipo.fichas_blancas * valorFichas['blancas'],
        equipo.fichas_otros_colores * valorFichas['otros_colores']
    ];

    // Crear un contenedor para el gráfico de dona de cada equipo en una columna
    const contenedor = document.createElement('div');
    contenedor.classList.add('col-lg-2', 'col-md-4', 'col-sm-6', 'mb-4');  // 5 columnas en pantallas grandes, 4 en medianas, 2 en pequeñas
    contenedor.innerHTML = `<h3 class="text-center">Equipo ${equipo.numero_grupo}</h3><canvas id="graficoDona${equipoId}" width="400" height="400"></canvas><p id="costoTotal${equipoId}" class="text-center"></p>`;
    document.getElementById('graficosDonas').appendChild(contenedor);

    // Crear el gráfico de dona y almacenarlo en graficosDonas
    const ctx = document.getElementById(`graficoDona${equipoId}`).getContext('2d');
    const graficoDona = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Amarillas', 'Azules', 'Rojas', 'Blancas', 'Otros Colores'],
            datasets: [{
                label: `Equipo ${equipo.numero_grupo}`,
                data: [equipo.fichas_amarillas, equipo.fichas_azules, equipo.fichas_rojas, equipo.fichas_blancas, equipo.fichas_otros_colores],
                backgroundColor: [
                    'rgba(255, 255, 153, 0.6)',    // Amarillo pastel
                    'rgba(153, 204, 255, 0.6)',    // Azul pastel
                    'rgba(255, 153, 153, 0.6)',    // Rojo pastel
                    'rgba(255, 255, 255, 0.6)',    // Blanco pastel
                    'rgba(192, 192, 192, 0.6)'     // Gris pastel
                ],
                borderColor: [
                    'rgba(255, 255, 153, 1)',    // Amarillo pastel
                    'rgba(153, 204, 255, 1)',    // Azul pastel
                    'rgba(255, 153, 153, 1)',    // Rojo pastel
                    'rgba(128, 128, 128, 1)',    // Borde gris claro para el blanco
                    'rgba(192, 192, 192, 1)'     // Gris pastel
                ],
                borderWidth: 2  // Aumentar el grosor del borde para visibilidad
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false  // Ocultar leyenda en todos los gráficos
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const index = tooltipItem.dataIndex;
                            const labels = ['amarillas', 'azules', 'rojas', 'blancas', 'otros_colores'];
                            const color = labels[index];
                            const cantidad = tooltipItem.raw || 0;
                            const valorUnitario = valorFichas[color];
                            const costoTotal = (cantidad * valorUnitario).toFixed(2);
                            return `${tooltipItem.label}: ${cantidad} fichas, Costo: $${costoTotal}`;
                        }
                    }
                }
            }
        }
    });

    // Calcular el costo total de las fichas y mostrarlo debajo del gráfico
    const costoTotal = valorTotalFichas.reduce((a, b) => a + b, 0);
    document.getElementById(`costoTotal${equipoId}`).textContent = `Costo Total: $${costoTotal.toFixed(2)}`;

    // Almacenar el gráfico en graficosDonas para futuras actualizaciones
    graficosDonas[equipoId] = graficoDona;
}

// Función para actualizar el gráfico de dona
function actualizarGraficoDona(equipo) {
    const equipoId = `equipo${equipo.numero_grupo}`;
    const graficoDona = graficosDonas[equipoId];
    
    // Actualizar los datos de las fichas usadas
    graficoDona.data.datasets[0].data = [equipo.fichas_amarillas, equipo.fichas_azules, equipo.fichas_rojas, equipo.fichas_blancas, equipo.fichas_otros_colores];
    graficoDona.update();  // Actualizar el gráfico

    // Actualizar el costo total de las fichas
    const valorTotalFichas = [
        equipo.fichas_amarillas * valorFichas['amarillas'],
        equipo.fichas_azules * valorFichas['azules'],
        equipo.fichas_rojas * valorFichas['rojas'],
        equipo.fichas_blancas * valorFichas['blancas'],
        equipo.fichas_otros_colores * valorFichas['otros_colores']
    ];
    const costoTotal = valorTotalFichas.reduce((a, b) => a + b, 0);
    document.getElementById(`costoTotal${equipoId}`).textContent = `Costo Total: $${costoTotal.toFixed(2)}`;
}

// Llamar a la función para obtener los datos al cargar la página
obtenerDatosEquipos();

// Actualizar los gráficos de donas cada 10 segundos
setInterval(obtenerDatosEquipos, 3000);  // Actualizar cada 10 segundos

// Añadir el botón de reset al dashboard
const resetButton = document.createElement('button');
resetButton.textContent = 'Resetear Dashboard';
resetButton.className = 'btn btn-danger mt-4';
resetButton.onclick = resetearDashboard;
document.body.appendChild(resetButton);

// Función para obtener los datos de los ensambles desde la base de datos
async function obtenerEnsambles() {
    try {
        const response = await fetch('http://localhost:3001/ensambles');
        const datosEnsambles = await response.json();

        // Procesar los datos obtenidos y actualizar la tabla
        actualizarTablaCostos(datosEnsambles);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Función para calcular los totales y actualizar la tabla
function actualizarTablaCostos(datosEnsambles) {
    const tabla = document.getElementById('tablaCostos');
    const thead = tabla.querySelector('thead tr');
    const tbody = tabla.querySelector('tbody').rows;

    // Limpiar columnas existentes (excepto la columna de "Concepto")
    while (thead.children.length > 1) {
        thead.removeChild(thead.lastChild);
    }

    // Limpiar celdas existentes de la tabla para no duplicar datos
    for (let i = 0; i < tbody.length; i++) {
        while (tbody[i].cells.length > 1) {
            tbody[i].removeChild(tbody[i].lastChild);
        }
    }

    // Iterar sobre los datos obtenidos y crear columnas dinámicamente
    datosEnsambles.forEach((equipo, index) => {
        const equipoId = `equipo${equipo.numero_grupo}`;

        // Crear columna para cada equipo
        const th = document.createElement('th');
        th.textContent = `Equipo ${equipo.numero_grupo}`;
        thead.appendChild(th);

        // Calcular costos para las diferentes categorías
        const costoHerramienta = parseFloat(equipo.llave_minutos) + parseFloat(equipo.alicate_minutos);
        const costoMateriaPrima = equipo.fichas_amarillas*valorFichas['amarillas'] + equipo.fichas_azules*valorFichas['azules'] + equipo.fichas_rojas*valorFichas['rojas'] + equipo.fichas_blancas*valorFichas['blancas'] + equipo.fichas_otros_colores*valorFichas['otros_colores'];
        const costoManoObra = 12;  // Agrega lógica de cálculo según corresponda
        const costoCIF = parseFloat(equipo.agua_consumo) + parseFloat(equipo.luz_consumo) + parseFloat(equipo.internet_consumo);
        const totalProyecto = costoHerramienta + costoMateriaPrima + costoManoObra + costoCIF;

        // Actualizar las filas correspondientes con los costos calculados
        tbody[0].insertCell(index + 1).textContent = costoHerramienta.toFixed(2);  // Herramienta
        tbody[1].insertCell(index + 1).textContent = costoMateriaPrima.toFixed(2);  // Materia Prima
        tbody[2].insertCell(index + 1).textContent = costoManoObra.toFixed(2);      // Mano de Obra
        tbody[3].insertCell(index + 1).textContent = costoCIF.toFixed(2);           // CIF
        tbody[4].insertCell(index + 1).textContent = totalProyecto.toFixed(2);      // Total del Proyecto
    });
}

// Llamar a la función para obtener los datos al cargar la página
obtenerEnsambles();

// Actualizar los gráficos y la tabla de costos cada 10 segundos
setInterval(obtenerEnsambles, 3000);  // Actualizar cada 10 segundos
