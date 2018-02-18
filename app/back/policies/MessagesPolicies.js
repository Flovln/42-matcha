"use strict"

const policies = {
  appendNewContact: (sender, sender_id, receiver, threads, data) => {
    const id = Math.random().toString(36).slice(2)
    const time = Date.now()

    threads[receiver] = [];
    threads[receiver].push({_id: id, time: time, sender_id: sender_id, sender: sender, content: data});
    return threads;
  },
  appendNewContactReceiver: (sender, sender_id, receiver, threads, data) => {
    const id = Math.random().toString(36).slice(2)
    const time = Date.now()

    threads[sender] = [];
    threads[sender].push({_id: id, time: time, sender_id: sender_id, sender: sender, content: data});
    return threads;
  },
  appendNewMessage: (sender, sender_id, receiver, threads, data) => {
    const id = Math.random().toString(36).slice(2)
    const time = Date.now()

    threads[receiver].push({_id: id, time: time, sender_id: sender_id, sender: sender, content: data});
    return threads;
  },
  appendNewMessageReceiver: (sender, sender_id, receiver, threads, data) => {
    const id = Math.random().toString(36).slice(2)
    const time = Date.now()

    threads[sender].push({_id: id, time: time, sender_id: sender_id, sender: sender, content: data});
    return threads;
  }
}

module.exports = policies;