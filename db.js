const mysql = require('mysql2');

const distriConexion = mysql.createConnection({
    host: 'localhost',
    port: 3306, 
    user: 'root',
    password: '',
    database: 'distri'
});

distriConexion.connect((err) => {
    if (err) {
        console.log('Error de conexión:', err);
        return;
    }
    console.log(' Conectado a Distri');
});

module.exports = distriConexion;