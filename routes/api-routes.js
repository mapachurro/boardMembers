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

  // GET route for getting all of the members
  app.get("/api/members", function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Member.findAll({
      where: {
        complete: false
      }
    }).then(function(dbMember) {
      // We have access to the todos as an argument inside of the callback function
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
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbTodo);
    })
      .catch(function(err) {
      // Whenever a validation or flag fails, an error is thrown
      // We can "catch" the error to prevent it from being "thrown", which could crash our node app
        res.json(err);
      });
  });

  // DELETE route for deleting members. We can get the id of the todo to be deleted from
  // req.params.id
  app.delete("/api/members/:id", function(req, res) {
    // We just have to specify which todo we want to destroy with "where"
    db.Member.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbMember) {
      res.json(dbMember);
    });

  });

  // PUT route for updating members. We can get the updated todo data from req.body
  app.put("/api/members", function(req, res) {

    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
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
      // Whenever a validation or flag fails, an error is thrown
      // We can "catch" the error to prevent it from being "thrown", which could crash our node app
        res.json(err);
      });
  });
};
