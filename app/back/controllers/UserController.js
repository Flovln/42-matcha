"use strict"
const userModel = require('../models/UserModel');

const user = {
  listAllSearchedUsers: (req, res) => {
    userModel.listAllSearchedUsers(req.app.db, req.decoded, req.body).then((list) => {
      res.status(200).json({ users:  list})
    }).catch((err) => {
      res.status(500).json({ error: err });
    });    
  },
  listAllMatchingUsers: (req, res) => {
    userModel.listAllMatchingUsers(req.app.db, req.decoded).then((list) => {
      res.status(200).json({ users:  list})
    }).catch((err) => {
      res.status(500).json({ error: err });
    });    
  },
  getPrivateInfos: (req, res) => {
    userModel.userGetPrivateInfos(req.app.db, req.decoded).then((infos) => {
      res.status(200).json({ private_infos: infos});
    }).catch((err) => {
      res.status(500).json({ error: err });      
    });
  },
  getVisitedUserPrivateInfos: (req, res) => {
    const username = req.params.username

    userModel.userVisitedGetPrivateInfos(req.app.db, username).then((infos) => {
      res.status(200).json({ private_infos: infos});
    }).catch((err) => {
      res.status(500).json({ error: err });      
    });
  },
  getPublicInfos: (req, res) => {
    userModel.userGetPublicInfos(req.app.db, req.decoded.user_id).then((infos) => {
      res.status(200).json({ public_infos: infos});
    }).catch((err) => {
      res.status(500).json({ error: err});
    });
  },
  searchUserPublicProfile: (req, res) => {
    const username = req.params.username; //user to find

    userModel.searchUserPublicInfos(req.app.db, username).then((infos) => {
      res.status(200).json({ user_infos: infos});
    }).catch((err) => {
      res.status(500).json({ error: err});
    });
  },
  updateAccount: (req, res) => {
    userModel.updateAccount(req.app.db, req.decoded, req.body).then(() => {
      res.status(200).json({ message: 'Private informations successfully edited'});
    }).catch((err) => {
      res.status(500).json({ error: err});
    });
  },  
  editUserNames: (req, res) => {
    userModel.editUserNames(req.app.db, req.decoded.user_id, req.body).then((infos) => {
      res.status(200).json({ public_infos: infos});
    }).catch((error) => {
      res.status(200).json({ error: error});
    });    
  },
  editUserBio: (req, res) => {
    userModel.editUserBio(req.app.db, req.decoded.user_id, req.body).then((infos) => {
      res.status(200).json({ public_infos: infos});
    }).catch((err) => {
      res.status(500).json({ error: err});
    });    
  },
  editUserGender: (req, res) => {
    userModel.editUserGender(req.app.db, req.decoded.user_id, req.body).then((infos) => {
      res.status(200).json({ public_infos: infos});
    }).catch((err) => {
      console.log('error: ', err)
      res.status(500).json({ error: err});
    });
  },
  editUserOrientation: (req, res) => {
    userModel.editUserOrientation(req.app.db, req.decoded.user_id, req.body).then((infos) => {
      res.status(200).json({ public_infos: infos});
    }).catch((err) => {
      res.status(500).json({ error: err});
    });
  },
  editUserInterests: (req, res) => {
    userModel.editUserInterests(req.app.db, req.decoded.user_id, req.body).then((infos) => {
      res.status(200).json({ public_infos: infos});
    }).catch((err) => {
      res.status(200).json({ error: err});
    });
  },
  setUserBirthdate: (req, res) => {
    userModel.setUserBirthdate(req.app.db, req.decoded.user_id, req.body).then((infos) => {
      res.status(200).json({ public_infos: infos});
    }).catch((err) => {
      res.status(200).json({ error: err});
    });
  },
  searchLocation: (req, res) => {
    userModel.searchLocation(req.app.db, req.decoded.user_id, req.body).then((infos) => {
      res.status(200).json({ public_infos: infos});
    })
    .catch((err) => {
      res.status(200).json({ error: err});
    })
  },
  saveUserVisiting: (req, res) => {
    const user_to_query = req.params.username

    userModel.saveUserVisting(req.app.db, req.decoded, user_to_query).then((message) => {
      const ioClients = req.app.get('ioClients')
      const guest = req.decoded.username
      const visitedUser = req.params.username

      if (ioClients[visitedUser] !== undefined) {
        ioClients[visitedUser].emit('view', {content: 'new view'})
      }

      res.status(200).json({ message: message});
    })
    .catch((err) => {
      res.status(200).json({ error: err});
    })    
  },
  handleLikes: (req, res) => {
    const user_liked = req.params.username

    userModel.saveUserLiked(req.app.db, req.decoded, user_liked).then(() => {
      const ioClients = req.app.get('ioClients')
      const liked = req.params.username

      if (ioClients[liked] !== undefined) {
        ioClients[liked].emit('like', {content: 'new like'})
      }
      
      userModel.handleLikes(req.app.db, req.decoded, user_liked).then((data) => {
        if (data.match) {
          const userCurrent = req.decoded.username
          const ioClients = req.app.get('ioClients')

          if (ioClients[userCurrent] !== undefined) {
            ioClients[userCurrent].emit('match', {content: 'new match'})
          }

          if (ioClients[liked] !== undefined) {
            ioClients[liked].emit('match', {content: 'new match'})
          }
        }
        res.status(200).json({ message: 'user liked or matched'})
      })
      .catch((err) => {
        console.log('error: ', err)
        res.status(500).json({ error: err});
      })
    })
    .catch((err) => {
      res.status(500).json({ error: err});
    })
  },
  unlikeUser: (req, res) => {
    const user_to_unliked = req.params.username
    userModel.unlikeUser(req.app.db, req.decoded, user_to_unliked).then((message) => {

      const ioClients = req.app.get('ioClients')

      if (ioClients[user_to_unliked] !== undefined) {
        ioClients[user_to_unliked].emit('unlike', {content: 'you have been unliked'})
      }

      res.status(200).json({ message: message});
    })
    .catch((err) => {
      res.status(200).json({ error: err});
    })    
  },
  blockUser: (req, res) => {
    const user_to_block = req.params.username

    userModel.blockUser(req.app.db, req.decoded, user_to_block).then((message) => {
      res.status(200).json({ message: message});
    })
    .catch((err) => {
      res.status(500).json({ error: err});
    });   
  },
  unblockUser: (req, res) => {
    const user_to_unblock = req.params.username

    userModel.unblockUser(req.app.db, req.decoded, user_to_unblock).then((message) => {
      res.status(200).json({ message: message});
    })
    .catch((err) => {
      res.status(500).json({ error: err});
    });   
  },
  setViewsToDefault: (req, res) => {
    userModel.setViewsToDefault(req.app.db, req.decoded).then((message) => {
      res.status(200).json({ message: message})
    })
    .catch((err) => {
      res.status(500).json({ error: err});
    });    
  },
  setLikesToDefault: (req, res) => {
    userModel.setLikesToDefault(req.app.db, req.decoded).then((message) => {
      res.status(200).json({ message: message})
    })
    .catch((err) => {
      res.status(500).json({ error: err});
    });    
  },
  setUnlikesToDefault: (req, res) => {
    userModel.setUnlikesToDefault(req.app.db, req.decoded).then((message) => {
      res.status(200).json({ message: message})
    })
    .catch((err) => {
      res.status(500).json({ error: err});
    });    
  },
  setMatchesToDefault: (req, res) => {
    userModel.setMatchesToDefault(req.app.db, req.decoded).then((message) => {
      res.status(200).json({ message: message})
    })
    .catch((err) => {
      res.status(500).json({ error: err});
    });    
  },
  setMessagesToDefault: (req, res) => {
    userModel.setMessagesToDefault(req.app.db, req.decoded).then((message) => {
      res.status(200).json({ message: message})
    })
    .catch((err) => {
      res.status(500).json({ error: err});
    });    
  }
}

module.exports = user;