const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : 'C:\\Users\\Lenovo\\Desktop\\backend\\tmp\\' // Corrected path with double backslashes
}));
app.use(express.json());

// Rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/songs', require('./routes/songRoutes')); // Corrected line
app.use('/api/emotion', require('./routes/emotionRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Lyric-Flow funcionando!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});