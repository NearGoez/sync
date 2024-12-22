const form = document.getElementById('upload_form');
const progressBar = document.getElementById('barra_progreso');
const statusDiv = document.getElementById('status');
const fileInput = document.getElementById('archivos');


form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const files = fileInput.files;
    if (files.length === 0) {
        statusDiv.textContent = 'Se debe seleciconar un archivo :V';
        return;
    }
   
    const formData = new FormData();
    for (let file of files) {
        formData.append('archivos', file);
    }

    try {
        //revisar xhr request
        const xhr = new XMLHttpRequest();
        
        // evento progreso
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percentComplete + '%';
                progressBar.textContent = percentComplete + '%';
                
                //se modea el color de labarra en funcion del progreso
                if (percentComplete < 50) {
                    progressBar.style.backgroundColor = '#ff9800';
                } else if (percentComplete < 90) {
                    progressBar.style.backgroundColor = '#2196f3';
                } else {
                    progressBar.style.backgroundColor = '#4caf50';
                }
                //implementar cambio progresivo 
            }
        });

        // Manejar la respuesta del servidor
        xhr.onload = function() {
            if (xhr.status === 200) {
                statusDiv.textContent = 'Archivos subidos correctamente =)';
                statusDiv.style.color = 'green';
                // Resetear el formulario después de 3 segundos
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
