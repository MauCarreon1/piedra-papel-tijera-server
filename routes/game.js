var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const {
  jugar, 
  regresarPartida, 
  verHistorial, 
  validarSesion
} = require('../controllers/game.controller');


//Servicio o boton de "Regresar partida"
router.post('/jugar', validarSesion, jugar);    1
router.post('/regresar-partida', regresarPartida);   
router.post('/ver-historial', validarSesion, verHistorial);   


module.exports = router;