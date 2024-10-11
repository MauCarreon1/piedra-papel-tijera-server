const mongoose = require('mongoose');

const {
    SesionModel
  } = require('../models/game.model');

async function jugar(req, res){
    const opciones = ["fire", "water", "grass"];
    const jugador2 = opciones[Math.floor(Math.random() * (opciones.length - 0 + 1))];
  
    const jugador1 = req.body.eleccion;
    const sesionUsuario = req.body.sesionUsuario;
  
    const respuestaJuego = {
      resultado: "Empato",
      ganados: sesionUsuario.ganados,
      perdidos: sesionUsuario.perdidos
    }
  
    // Actualizar resultado de juego
    if (jugador1 === jugador2) {
      return res.status(200).json(respuestaJuego);
    } else {
      if (
          (jugador1 === "fire" && jugador2 === "grass") ||
          (jugador1 === "water" && jugador2 === "fire") ||
          (jugador1 === "grass" && jugador2 === "water")
      ) {
        sesionUsuario.ganados += 1;
        respuestaJuego.resultado = "Ganaste";
  
      } else {
        sesionUsuario.perdidos += 1;
        respuestaJuego.resultado = "Perdiste";
      }
  
      respuestaJuego.ganados = sesionUsuario.ganados;
      respuestaJuego.perdidos = sesionUsuario.perdidos;
  
      // Actualizar historial
      sesionUsuario.historiaUsuario.push(jugador1);
      sesionUsuario.historiaCPU.push(jugador2);
  
      // Guardar actualización en base de datos
      await sesionUsuario.save();
  
      res.status(200).json(respuestaJuego);
    }
  };
  
  async function regresarPartida(req, res){
    const userName = req.query.nombUs;
  
    try {
      // Check sesion existense
      const userSesion = await SesionModel.findOne({
        nombreUsuario: userName
      })
      // Return sesion if exists
      if (userSesion) {
        res.status(200).json({
          infoPartida: userSesion
        })
      } else {
        const newSesion = await new SesionModel({
          nombreUsuario: userName
        }).save();
  
        res.status(200).json({
          infoPartida: newSesion
        })
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  async function verHistorial(req,res) {
    const userSesion = req.body.sesionUsuario;
  
    try {
      if (userSesion) {
        const historialUsuario = userSesion.historiaUsuario;
        const historialCPU = userSesion.historiaCPU;
  
        res.status(200).json({ historialUsuario, historialCPU });
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      } 
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  async function validarSesion(req, res, next){
    const idSesion = req.body.idSes;
  
    const sesionUsuario = await SesionModel.findOne({
      _id:idSesion
    })
  
    if (sesionUsuario) {
      req.body.sesionUsuario = sesionUsuario;
      next();
    } else {
      res.status(400).json({
        mensaje: "Sesión Inválida"
      })
    }
  };

  module.exports = {
    jugar,
    regresarPartida,
    verHistorial,
    validarSesion
  };