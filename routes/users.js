var express = require('express');
var router = express.Router();
var URL = require('url');

var errors = require('../models/errors');
var User = require('../models/user');

function getUserURL(user) {
    return '/users/' + encodeURIComponent(user.username);
}

/**
 * GET /users
 */
router.get('/', function (req, res, next) {
    User.getAll(function (err, users) {
        if (err) return next(err);
        res.json({
            User: User,
            users: users,
            username: req.query.username,   // Support pre-filling create form
            error: req.query.error,     // Errors creating; see create route
        });
    });
});

/**
 * POST /users {username, ...}
 */
router.post('/', function (req, res, next) {
    User.create({
        username: req.body.username
    }, function (err, user) {
        if (err) {
            if (err instanceof errors.ValidationError) {
                return res.redirect(URL.format({
                    pathname: '/users',
                    query: {
                        username: req.body.username,
                        error: err.message,
                    },
                }));
            } else {
                return next(err);
            }
        }
        res.redirect(getUserURL(user));
    });
});

/**
 * GET /users/:username
 */
router.get('/:username', function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        // TODO: Also fetch and show followers? (Not just follow*ing*.)
        user.getKarma(function (err, karma) {
            if (err) return next(err);
            user.karma = karma;
            res.json({
                User: User,
                user: user,
                username: req.query.username,   // Support pre-filling edit form
                error: req.query.error,     // Errors editing; see edit route
            });
        });
    });
});

/**
 * POST /users/:username {username, ...}
 */
router.post('/:username', function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        user.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.ValidationError) {
                    return res.redirect(URL.format({
                        pathname: getUserURL(user),
                        query: {
                            username: req.body.username,
                            error: err.message,
                        },
                    }));
                } else {
                    return next(err);
                }
            }
            res.redirect(getUserURL(user));
        });
    });
});

/**
 * DELETE /users/:username
 */
router.delete('/:username', function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully handle "no such user" error somehow.
        // E.g. redirect back to /users with an info message?
        if (err) return next(err);
        user.del(function (err) {
            if (err) return next(err);
            res.redirect('/users');
        });
    });
});

/**
 * POST /users/:username/follow {otherUsername}
 */
// exports.follow = function (req, res, next) {
//     User.get(req.params.username, function (err, user) {
//         // TODO: Gracefully handle "no such user" error somehow.
//         // This is the source user, so e.g. 404 page?
//         if (err) return next(err);
//         User.get(req.body.otherUsername, function (err, other) {
//             // TODO: Gracefully handle "no such user" error somehow.
//             // This is the target user, so redirect back to the source user w/
//             // an info message?
//             if (err) return next(err);
//             user.follow(other, function (err) {
//                 if (err) return next(err);
//                 res.redirect(getUserURL(user));
//             });
//         });
//     });
// };

/**
 * POST /users/:username/unfollow {otherUsername}
 */
// router.get('/users/:username/unfollow', function (req, res, next) {
//     User.get(req.params.username, function (err, user) {
//         // TODO: Gracefully handle "no such user" error somehow.
//         // This is the source user, so e.g. 404 page?
//         if (err) return next(err);
//         User.get(req.body.otherUsername, function (err, other) {
//             // TODO: Gracefully handle "no such user" error somehow.
//             // This is the target user, so redirect back to the source user w/
//             // an info message?
//             if (err) return next(err);
//             user.unfollow(other, function (err) {
//                 if (err) return next(err);
//                 res.redirect(getUserURL(user));
//             });
//         });
//     });
// });

module.exports = router;