const form = document.getElementById('upload_form');
const progressBar = document.getElementById('barra_progreso');
const statusDiv = document.getElementById('status');
const fileInput = document.getElementById('archivos');

// Variables para calcular la velocidad
let lastLoaded = 0;
let lastTime = Date.now();

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const files = fileInput.files;
    if (files.length === 0) {
        statusDiv.textContent = 'Se debe seleccionar un archivo :V';
        return;
    }
   
    const formData = new FormData();
    for (let file of files) {
        formData.append('archivos', file);
    }
    
    try {
        const xhr = new XMLHttpRequest();
        
        // Reiniciar variables de velocidad al inicio de la subida
        lastLoaded = 0;
        lastTime = Date.now();
        
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percentComplete + '%';
                
                // Calcular la velocidad
                const currentTime = Date.now();
                const timeDiff = (currentTime - lastTime) / 1000; // Convertir a segundos
                const loadedDiff = e.loaded - lastLoaded;
                const speed = loadedDiff / timeDiff; // bytes por segundo
                
                // Convertir la velocidad a una unidad más legible
                let speedText = '';
                if (speed > 1048576) { // 1MB
                    speedText = `${(speed / 1048576).toFixed(2)} MB/s`;
                } else if (speed > 1024) { // 1KB
                    speedText = `${(speed / 1024).toFixed(2)} KB/s`;
                } else {
                    speedText = `${Math.round(speed)} B/s`;
                }
                
                // Mostrar progreso y velocidad
                progressBar.textContent = `${percentComplete}% - ${speedText}`;
                
                // Actualizar variables para el próximo cálculo
                lastLoaded = e.loaded;
                lastTime = currentTime;
                
                // Modificar el color de la barra en función del progreso
                if (percentComplete < 50) {
                    progressBar.style.backgroundColor = '#ff9800';
                } else if (percentComplete < 90) {
                    progressBar.style.backgroundColor = '#2196f3';
                } else {
                    progressBar.style.backgroundColor = '#4caf50';
                }
            }
        });

        xhr.onload = function() {
            if (xhr.status === 200) {
                statusDiv.textContent = 'Archivos subidos correctamente =)';
                statusDiv.style.color = 'green';
                setTimeout(() => {
                    form.reset();
                    progressBar.style.width = '0%';
                    progressBar.textContent = '0%';
                    statusDiv.textContent = '';
                }, 3000);
            } else {
                statusDiv.textContent = 'Error al subir los archivos: ' + xhr.statusText;
                statusDiv.style.color = 'red';
            }
        };

        xhr.onerror = function() {
            statusDiv.textContent = 'Error de red al intentar subir los archivos =(';
            statusDiv.style.color = 'red';
        };

        xhr.open('POST', '/upload', true);
        xhr.send(formData);
        
        statusDiv.textContent = 'Subiendo archivos ';
        statusDiv.style.color = 'blue';
    } catch (error) {
        statusDiv.textContent = 'Error: ' + error.message;
        statusDiv.style.color = 'red';
    }
});
