const soap = require('strong-soap').soap;
const http = require('http');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'motoristas'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

const service = {
  MotoristaService: {
    MotoristaPort: {
      salvarMotorista(args, cb) {
        const m = args;
        const sql = `
          INSERT INTO motoristas (
            nome, cpf, cnh, email, celular, cep, rua, bairro, cidade, estado,
            placa, marca, modelo, ano, cor, kmAtual
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
          m.nome, m.cpf, m.cnh, m.email, m.celular,
          m.cep, m.rua, m.bairro, m.cidade, m.estado,
          m.placa, m.marca, m.modelo, m.ano, m.cor, m.kmAtual
        ];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.log('Erro ao inserir:', err);
            cb({ resultado: 'erro' });
          } else {
            cb({ resultado: 'ok' });
          }
        });
      }
    }
  }
};

const xml = require('fs').readFileSync('motorista.wsdl', 'utf8');

const server = http.createServer((req, res) => {
  res.end('SOAP server');
});

server.listen(8000, '0.0.0.0', () => {
  console.log('Servidor SOAP rodando em http://192.168.0.17:8000 via roteador celular');
});
soap.listen(server, '/wsdl', service, xml);
