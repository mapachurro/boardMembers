// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting current members
  app.get("/api/members", function(req, res) {
    db.Member.findAll({
      where: {
        complete: false
      }
    }).then(function(dbMember) {
      res.json(dbMember);
    });
  });

    // GET route for former members
    app.get("/api/formers", function(req, res) {
      db.Member.findAll({
        where: {
          complete: true
        }
      }).then(function(dbMember) {
        res.json(dbMember);
      });
    });

  // POST route for saving a new member
  app.post("/api/members", function(req, res) {
    db.Member.create({
      text: req.body.text,
      complete: req.body.complete
    }).then(function(dbMember) {
      res.json(dbTodo);
    })
      .catch(function(err) {

        res.json(err);
      });
  });

  // DELETE route for deleting members
  app.delete("/api/members/:id", function(req, res) {
    db.Member.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbMember) {
      res.json(dbMember);
    });

  });

  // PUT route for updating members.
  app.put("/api/members", function(req, res) {
    db.Member.update({
      text: req.body.text,
      complete: req.body.complete
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbMember) {
      res.json(dbMember);
    })
      .catch(function(err) {
        res.json(err);
      });
  });
};
