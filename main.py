from flask import Flask, request, render_template
import os

app = Flask(__name__, static_url_path='')

# Configura la carpeta donde se guardarán los archivos
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 30 * 1024 * 1024 * 1024 

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])

def upload_files():
    if 'archivos' not in request.files:
        return 'No se ha seleccionado ningún archivo'
    
    archivos = request.files.getlist('archivos')
    
    if not archivos or archivos[0].filename == '':
        return 'No hay archivos para subir'
    
    # Guardar cada archivo
    for archivo in archivos:
        if archivo.filename:
            archivo.save(os.path.join(app.config['UPLOAD_FOLDER'], archivo.filename))
    
    return f'Se han subido {len(archivos)} archivos correctamente'

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')
