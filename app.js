// Bibliotecas necessarias
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');


const app = express()



// Configurar express json 
app.use(express.json())

app.use(cors());

// Configurar o fornecimento de arquivos estáticos
app.use(express.static('public'));


//Models
const User = require('./models/User');


// Open Route - Rota Publica
app.get('/', (req, res) => {
res.status(200).json({message: "Bem vindo a API"})
}) 

//Private Route 

app.get('/user/:id', checkToken, async (req, res) => {

    const id = req.params.id

    // check if uses exits 

    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({
            message: 'usuario nao encontrado'
        })
    }

    res.status(200).json({
      user
    })

})

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado' });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido!' });
  }
}

// Registrar Usuario 

app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
  
    // Validações
    const validations = [
      { field: 'name', message: 'Nome é obrigatório' },
      { field: 'email', message: 'Email é obrigatório' },
      { field: 'password', message: 'Senha é obrigatória' },
      { field: 'password', message: 'As senhas não conferem', condition: password !== confirmpassword },
    ];
  
    for (const validation of validations) {
      if (!req.body[validation.field] || (validation.condition && validation.condition)) {
        return res.status(422).json({ message: validation.message });
      }
    }
  
    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      return res.status(422).json({ message: 'Por favor, utilize outro email!' });
    }
  
    // Criar a senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
  
    // Criar o usuário
    const user = new User({
      name,
      email,
      password: passwordHash,
    });
  
    try {
      await user.save();
      res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Aconteceu um erro no servidor' });
    }

    console.log("Novo usuario:",user);
  });

  

// Rota de login

app.post('/auth/login', async (req, res) => {

const  {email, password} = req.body

const validations = [
{
  field: 
  email, 
  message: 'Email e obrigatorio',
  status: 422
},

{
  field: 
  password, 
  message: 'Senha e obrigatoria',
  status: 422
}
                  ];

    for (const validation of validations) {
      if(!validation.field) {
        return res.status(validation.status).json({message: validation.message  });
      }
    }
  
    //Check if user exist
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }
    
    const checkPassword = await bcrypt.compare(password, user.password);
    
    if (!checkPassword) {
      return res.status(422).json({
        message: 'Senha inválida',
      });
    }
    
    try {
      const secret = process.env.SECRET;
      const token = jwt.sign({ id: user._id }, secret);

      console.log(' usuário conectado:', user);
    
      return res.status(200).json({
        message: 'Autenticação realizada com sucesso',
        token,
      });
      
    } catch (err) {
      console.log(err);
    
      return res.status(500).json({
        message: 'Aconteceu um erro no servidor. Tente novamente mais tarde.',
      });
    }
    


})

// Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
.connect('mongodb+srv://enzzof:enzzo@cluster0.qwf9sni.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    app.listen(5500)
    console.log("conectou a o banco!")
} )
.catch( (err) => console.log(err))





