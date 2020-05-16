var express = require('express');
var router = express.Router();
var manager = require('../db/manager');
var driver = require('../db/driver');
var ResetPassword = require('../db/ResetPassword');
var crypto = require('crypto');
var nodemailer = require('nodemailer');



module.exports = function (passport) {
    router.post('/signup', function (req, res) {
        var body = req.body;
        var f = body.fname;
        var l = body.lname;

        manager.findOne({ email: body.email }, function (err, doc) {
            if (err) {
                res.status(500).send('Error Occurred')
            }
            else {
                if (doc) {
                    res.status(500).send('Manager Already Exists')
                }
                else {
                    var record = new manager()
                    record.firstName = f;
                    record.lastName = l;
                    type = 'Manager';
                    record.cnic = body.cnic;
                    record.email = body.email;
                    record.phoneNumber = body.phone;
                    record.password = body.password;
                    record.hashedPassword = record.hashPassword(body.password);
                    record.company_address = body.companyAddress;
                    record.company_name = body.companyName;




                    record.save(function (err, manager) {
                        if (err) {
                            res.status(500).send('Error in DB')
                        }
                        else {
                            //res.send(manager)
                            res.render('dashboard');
                        }

                    })
                }
            }
        })
    });
    router.post('/login', passport.authenticate('manager', { successRedirect: '/dashboard', failureRedirect: '/', failureFlash: true }))
    router.post('/driverLogin', passport.authenticate('driver', { successRedirect: '/api/login/success', failureRedirect: '/api/login/error' }))

    router.post('/reset-password', function (req, res) {
        const email = req.body.email
        driver.findOne({ email: email }, function (err, driver) {
            if (err) {
                res.status(500).send('Error Occurred')
            }
            else {
                if (driver) {
                    ResetPassword.findOne({ userId: driver._id }, function (err, result) {
                        if (err) {
                            res.status(500).send('Error Occurred')
                        }
                        else {
                            if (result) {


                                ResetPassword.findByIdAndDelete({ _id: result._id }, function (err, reset) {
                                    if (err) {
                                        res.status(500).send('Error Occurred')
                                    }
                                    else {
                                        console.log("ResetPassword deleted");
                                    }
                                })
                            }

                        }
                    })

                    var token = crypto.randomBytes(32).toString('hex')//creating the token to be sent to the forgot password form (react)
                    let password = new ResetPassword({
                        userId: driver._id,
                        resetPasswordToken: token,
                        expire: Date.now() + 3600000,
                    });
                    password.save(function (err) {
                        if (err) throw err;
                    });
                    var smtpTrans = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {

                            user: 'asma.jamil1259@gmail.com',
                            pass: 'FAtim@05'

                        }
                    });
                    console.log(driver.email);
                    var mailOptions = {
                        to: driver.email,
                        from: 'asma.jamil1259@gmail.com',
                        subject: 'Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://localhost:3000' + '/auth/reset/' + token + '\n\n' +
                            'Please note that this link will expire within the next 1 hour, therefore recover your password within this duration. \n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    };
                    smtpTrans.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log("mail error");
                        }
                        else {
                            console.log('info, An e-mail has been sent to ' + driver.email);
                            res.send({ status: 1, message: 'info, An e-mail has been sent to ' + driver.email + ' with further instructions.' });
                        }
                    });

                }
                else {
                    console.log("No driver is registered with this email.");
                    res.send({ status: 0, message: "No driver is registered with this email." });
                }
            }
        })
    })


    router.get('/reset/:token', function (req, res) {
        ResetPassword.findOne({ resetPasswordToken: req.params.token, expire: { $gt: Date.now() } }, function (err, reset) {
            if (!reset) {
                console.log('error', 'Password reset token is invalid or has expired.');
                res.send('Password reset token is invalid or has expired.');
            }
            res.render('reset', { reset });
        });
    });

    router.post('/reset/:token', function (req, res) {
        var a = new driver();
        var driverEmail = "";
        ResetPassword.findOne({ resetPasswordToken: req.params.token, expire: { $gt: Date.now() } }, function (err, reset) {
            if (!reset) {
                console.log('error', 'Password reset token is invalid or has expired.');
                res.send('Password reset token is invalid or has expired.');
            }

            driver.findByIdAndUpdate({ _id: reset.userId },
                { password: req.body.password, hashedPassword: a.hashPassword(req.body.password) }).exec(
                    function (err, result) {
                        if (err) res.send({ status: 0, message: "Password doesn't changed successfully" });
                        else {
                            driverEmail = result.email;
                            res.send({ status: 1, message: "Password changed successfully" });
                        }
                    });
            ResetPassword.findByIdAndDelete({ _id: reset._id }, function (err, result) {
                if (err) {
                    console.log('Error Occurred')
                }
                else {
                    console.log("ResetPassword deleted");
                }
            })

            console.log(driverEmail);
            var smtpTrans = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'asma.jamil1259@gmail.com',
                    pass: 'FAtim@05'

                }
            });
            var mailOptions = {
                to: driverEmail,
                from: 'asma.jamil1259@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + driverEmail + ' has just been changed.\n'
            };
            smtpTrans.sendMail(mailOptions, function (err) {
                if (err) console.log("mail error");

                console.log('success', 'Success! Your password has been changed.');

            });
        });


    });


    router.post('/manager/reset-password', function (req, res) {
        const email = req.body.reset_email;
        manager.findOne({ email: email }, function (err, manager) {
            if (err) {
                res.status(500).send('Error Occurred')
            }
            else {
                if (manager) {
                    ResetPassword.findOne({ userId: manager._id }, function (err, result) {
                        if (err) {
                            res.status(500).send('Error Occurred')
                        }
                        else {
                            if (result) {


                                ResetPassword.findByIdAndDelete({ _id: result._id }, function (err, reset) {
                                    if (err) {
                                        res.status(500).send('Error Occurred')
                                    }
                                    else {
                                        console.log("ResetPassword deleted");
                                    }
                                })
                            }

                        }
                    })

                    var token = crypto.randomBytes(32).toString('hex')//creating the token to be sent to the forgot password form (react)
                    let password = new ResetPassword({
                        userId: manager._id,
                        resetPasswordToken: token,
                        expire: Date.now() + 3600000,
                    });
                    password.save(function (err) {
                        if (err) throw err;
                    });
                    var smtpTrans = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {

                            user: 'asma.jamil1259@gmail.com',
                            pass: 'FAtim@05'

                        }
                    });
                    console.log(manager.email);
                    var mailOptions = {
                        to: manager.email,
                        from: 'asma.jamil1259@gmail.com',
                        subject: 'Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://localhost:3000' + '/auth/manager/reset/' + token + '\n\n' +
                            'Please note that this link will expire within the next 1 hour, therefore recover your password within this duration. \n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    };
                    smtpTrans.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log("mail error");
                        }
                        else {
                            console.log('info, An e-mail has been sent to ' + manager.email);
                           //req.flash('info',   'An e-mail has been sent to ' + manager.email + ' with further instructions.' );
                            //res.redirect('/');
                        res.send({ status: 1, message: 'info, An e-mail has been sent to ' + manager.email + ' with further instructions.' });
                        }
                    });

                }
                else {
                    console.log("No manager is registered with this email.");
                    //req.flash('info',  "No manager is registered with this email." );
                    //res.redirect('/');
                    res.send({ status: 0, message: "No manager is registered with this email." });
                }
            }
        })
    })


    router.get('/manager/reset/:token', function (req, res) {
        ResetPassword.findOne({ resetPasswordToken: req.params.token, expire: { $gt: Date.now() } }, function (err, reset) {
            if (!reset) {
                console.log('error', 'Password reset token is invalid or has expired.');
                res.send('Password reset token is invalid or has expired.');
            }
            res.render('manager_reset', { reset });
        });
    });


    router.post('/manager/reset/:token', function (req, res) {
        var a = new manager();
        var managerEmail = "";
        ResetPassword.findOne({ resetPasswordToken: req.params.token, expire: { $gt: Date.now() } }, function (err, reset) {
            if (!reset) {
                console.log('error', 'Password reset token is invalid or has expired.');
                res.send('Password reset token is invalid or has expired.');
            }

            manager.findByIdAndUpdate({ _id: reset.userId },
                { password: req.body.password, hashedPassword: a.hashPassword(req.body.password) }).exec(
                    function (err, result) {
                        if (err) res.send({ status: 0, message: "Password doesn't changed successfully" });
                        else {
                            managerEmail = result.email;
                            res.send({ status: 1, message: "Password changed successfully" });
                        }
                    });
            ResetPassword.findByIdAndDelete({ _id: reset._id }, function (err, result) {
                if (err) {
                    console.log('Error Occurred')
                }
                else {
                    console.log("ResetPassword deleted");
                }
            })
        });
        console.log(managerEmail);
        var smtpTrans = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'asma.jamil1259@gmail.com',
                pass: 'FAtim@05'

            }
        });
        var mailOptions = {
            to: managerEmail,
            from: 'asma.jamil1259@gmail.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + managerEmail + ' has just been changed.\n'
        };
        smtpTrans.sendMail(mailOptions, function (err) {
            if (err) console.log("mail error");
            console.log('success', 'Success! Your password has been changed.');

        });

    });




    return router;
};
