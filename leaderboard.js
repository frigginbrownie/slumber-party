// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");
Slides = new Meteor.Collection("slides");

if (Meteor.isClient) {

  Meteor.Router.add({
    '/ipad': 'leaderboard',
    '/': 'playerScore',
    '/admin': 'admin',
  });

  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.playerScore.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.playerScore.players = function () {
    return Players.find({}, {sort: {id: 1}});
  };

  Template.admin.players = function () {
    return Players.find({}, {sort: {name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.slideDisplay.helpers({
    slides: function() {
      return Slides.find();
    }
  })

  var randomScore = function() {
    return Math.floor(Math.random() * 351) - 250;
  }

  Template.leaderboard.events({
    'click input.add50': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 50}});
    },
    'click input.add100': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 100}});
    },
    'click input.add250': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 250}});
    },
    'click input.add500': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 500}});
    },
    'click input.take50': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: -50}});
    },
    'click input.take100': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: -100}});
    },
    'click input.take250': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: -250}});
    },
    'click input.take500': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: -500}});
    },
    'click input.lose': function () {
      Players.update(Session.get("selected_player"), {$set: {score: 0}});
    },
    'click input.random': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: randomScore() }});
    },
  });

Template.slideDisplay.events({
    'click input.lastSlide': function () {
      Slides.update({$inc: {slide: -1}});
    },
    'click input.nextSlide': function () {
      Slides.update({$inc: {slide: 1}});
    },
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });

  Template.admin.events = {
    'click input.add': function () {
      var new_player_name = document.getElementById("new_player_name").value;
      Players.insert({_id: {name: new_player_name, score: 0});
    },
    'click input.delete': function () { // <-- here it is
    Players.remove(this._id);
    } 
  };

}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    Slides.insert({slide: 1});
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({_id: seq:0,name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
