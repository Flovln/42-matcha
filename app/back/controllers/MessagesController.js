"use strict"
const ObjectId = require('mongodb').ObjectId;

const messageModel = require('../models/MessagesModel');

const messages = {
  saveMessage: (req, res) => {
    messageModel.saveUserOwnMessages(req.app.db, req.decoded, req.body)
      .then((infos) => {
        const ioClients = req.app.get('ioClients')
        const sender = req.body.sender
        const receiver = req.body.receiver
        const message = req.body.content

        if (ioClients[sender] !== undefined) {
          ioClients[sender].emit('message', {content: message})
        }
  
        /* If receiver is online send socket notification */
        if (ioClients[receiver] !== undefined) {
          ioClients[receiver].emit('message', {content: message})
          ioClients[receiver].emit('messageNotif', {content: message})
        }

        res.status(200).json({ message: 'Message sent'});
      })
      .catch((err) => {
        console.log('error: ', err)
        res.status(500).json({ error: err });
      })
  }
}

module.exports = messages;