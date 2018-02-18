'use strict'

const ObjectId = require('mongodb').ObjectId;
const MessagesServices = require('../services/MessagesServices');

const messages = {
  getUserThreads: (db, user_id) => {
    return new Promise((resolve, reject) => {
      db.collection('users').findOne({ "_id" : new ObjectId(user_id)}, { threads: 1 }).then((threads) => {
        resolve(threads);
      }).catch((err) => {
        reject(err);
      })
    });
  },
  saveUserOwnMessages: (db, user, data) => {
    return new Promise((resolve, reject) => {
      const sender = data.sender
      const receiver = data.receiver
      const content = data.content

      db.collection('users').findOne({ "_id": new ObjectId(user.user_id)}, { threads: 1 }).then((threads_infos) => {

        /* Add contact to threads if first interaction */
        if (threads_infos.threads[receiver] == undefined){
          return MessagesServices.appendNewContact(sender, user.user_id, receiver, threads_infos.threads, content);
        /* Append new content/messages to existing contact */
        } else {
          return MessagesServices.appendNewMessage(sender, user.user_id, receiver, threads_infos.threads, content);
        }

      }).then((updatedThreads) => {
        db.collection('users').update({ "_id": new ObjectId(user.user_id)}, {$set: { threads: updatedThreads } }, null).then((res) => {
          messages.saveUserMessagesInReceiver(db, sender, user.user_id, receiver, content).then((res) => {
            resolve(res);
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    })
  },
  saveUserMessagesInReceiver: (db, sender, sender_id, receiver, data) => {
    return new Promise((resolve, reject) => {
      /* save sent messages in receiver's thread */
      db.collection('users').findOne({"username": receiver}, { threads: 1 }).then((threads_infos) => {

        /* Add contact to threads if first interaction */
        if (threads_infos.threads[sender] == undefined){
          return MessagesServices.appendNewContactReceiver(sender, sender_id, receiver, threads_infos.threads, data)
        /* Append new content/messages to existing contact */
        } else {
         return MessagesServices.appendNewMessageReceiver(sender, sender_id, receiver, threads_infos.threads, data);
        }
      }).then((updatedThreads) => {
        db.collection('users').update({ "username": receiver}, {$set: { threads: updatedThreads }, $inc: {"notifications.messages": 1} }, null).then(() => {
          resolve("Added to receiver");
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject("Receiver not found " + err);
      });
    });
  }
}

module.exports = messages;