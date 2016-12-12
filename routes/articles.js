var express = require('express');
var router = express.Router();
var passport = require('passport');

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var db = require(libs + 'mongoose');

var Article = require('../models/article');

router.get('/', passport.authenticate('bearer', {
  session: false
}), function (req, res) {

  Article.find(function (err, articles) {
    if (!err) {
      return res.json(articles);
    } else {
      res.statusCode = 500;

      log.error('Internal error(%d): %s', res.statusCode, err.message);

      return res.json({
        error: 'Server error'
      });
    }
  });

});

router.post('/', passport.authenticate('bearer', {
  session: false
}), function (req, res) {

  var article = new Article({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    images: req.body.images
  });

  article.save(function (err) {
    if (!err) {
      log.info("New article created with id: %s", article.id);
      return res.send({
        status: 'OK',
        article: article
      });
    } else {
      if (err.name == 'ValidationError') {
        res.statusCode = 400;
        res.send({
          error: 'Validation error'
        });
      } else {
        res.statusCode = 500;
        res.send({
          error: 'Server error'
        });
      }
      log.error('Internal error(%d): %s', res.statusCode, err.message);
    }
  });

});

router.get('/api/articles/:id', passport.authenticate('bearer', {
  session: false
}), function (req, res) {

  Article.findById(req.params.id, function (err, article) {

    if (!article) {
      res.statusCode = 404;

      return res.json({
        error: 'Articles not found'
      });
    }

    if (!err) {
      return res.json({
        status: 'OK',
        article: article
      });
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s', res.statusCode, err.message);

      return res.json({
        error: 'Server error'
      });
    }
  });

});

router.put('/:id', passport.authenticate('bearer', {
  session: false
}), function (req, res) {

  Article.findById(req.params.id, function (err, article) {
    if (!article) {
      res.statusCode = 404;
      log.error('Article with id: %s Not Found', articleId);
      return res.json({
        error: 'Not found'
      });
    }

    article.title = req.body.title;
    article.description = req.body.description;
    article.author = req.body.author;
    article.images = req.body.images;

    article.save(function (err) {
      if (!err) {
        log.info("Article with id: %s updated", article.id);
        return res.json({
          status: 'OK',
          article: article
        });
      } else {
        if (err.name === 'ValidationError') {
          res.statusCode = 400;
          return res.json({
            error: 'Validation error'
          });
        } else {
          res.statusCode = 500;
          log.error('Internal error (%d): %s', res.statusCode, err.message);

          return res.json({
            error: 'Server error'
          });
        }ß
      }
    });
  });

});

router.delete('/:id', passport.authenticate('bearer', {
  session: false
}), function (req, res) {

  Article.findById(req.params.id, function (err, article) {
    if (!article) {
      res.statusCode = 404;
      return res.send({
        error: 'Not found'
      });
    }
    return article.remove(function (err) {
      if (!err) {
        log.info("article removed");
        return res.send({
          status: 'OK'
        });
      } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({
          error: 'Server error'
        });
      }
    });
  });

});

module.exports = router;