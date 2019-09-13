var apiController = require('../controllers/apicontroller');
var passport = require('passport');

var multer = require('multer');
var multipart = multer();

const dbConfig = {
    user: 'uchet',
    host: 'localhost',
    database: 'uchet',
    password: '18121983',
    port: 5432,
};

const {Pool} = require('pg');
const pool = new Pool(dbConfig);

var d = new Date();
var n = d.toJSON();

var models = require("../models");

/* Init Page as p and Count per page as cpp for pagination*/
var p = 0;
var cpp = 20;
pagination = function (pgn) {
    if (pgn['page'] && pgn['page'] > 0) {
        p = (pgn['page'] - 1) * pgn['cpp']
    } else {
        p = 0
    }
    if (pgn['cpp']) {
        cpp = pgn['cpp']
    }
    return " LIMIT " + cpp + " OFFSET " + p;
};

module.exports = function (app) {

//Get's
    app.get('/api', apiController.api);

    /* Get all company */
    app.get('/api/company', isLoggedIn, function (req, res) {
        qc = "SELECT * FROM company";
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(qc);
                return res.send(result.rows);
            } finally {
                client.release()
            }
        })().catch(e => {
            console.log(e.stack);
            return res.send({error: e.detail})
        });
    });

    /* Get all addresses or addresses by company */
    app.get('/api/address', isLoggedIn, function (req, res) {
        qa = "SELECT * FROM company_address";
        if (req.query['company_id']) {
            qa = qa + " WHERE company_id = " + req.query['company_id'];
        }
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(qa);
                return res.send(result.rows);
            } finally {
                client.release()
            }
        })().catch(e => {
            console.log(e.stack);
            return res.send({error: e.detail})
        });
    });

    /* Get members of company */
    app.get('/api/members', isLoggedIn, function (req, res) {
        qm = "SELECT * FROM company_member WHERE";
        if (req.query['company_id']) {
            qm = qm + " company_id = " + req.query['company_id'];
            if (req.query['address_id']) {
                qm = qm + " AND address_id = " + req.query['address_id'];
            }
            (async () => {
                const client = await pool.connect();
                try {
                    const result = await client.query(qm);
                    return res.send(result.rows);
                } finally {
                    client.release()
                }
            })().catch(e => {
                console.log(e.stack);
                return res.send({error: e.detail})
            });
        } else {
            res.send({error: 'company_id is required'});
        }
    });

    /* Get all status */
    app.get('/api/status', isLoggedIn, function (req, res) {
        qs = "SELECT * FROM status_spr";
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(qs);
                return res.send(result.rows);
            } finally {
                client.release()
            }
        })().catch(e => {
            console.log(e.stack);
            return res.send({error: e.detail})
        });
    });

    /* Get all worklist */
    app.get('/api/worklist', isLoggedIn, function (req, res) {
        qw = "SELECT * FROM works_spr";
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(qw);
                return res.send(result.rows);
            } finally {
                client.release()
            }
        })().catch(e => {
            console.log(e.stack);
            return res.send({error: e.detail})
        });
    });

    /* Get all device list ?by type */
    app.get('/api/devicelist', isLoggedIn, function (req, res) {
        qd = "SELECT * FROM device_spr";
        if (req.query['type']) {
            qd = qd + " WHERE device_spr.device_type = '" + req.query['type'] + "'";
        }
        qd = qd + " ORDER BY device_spr.id " + pagination(req.query);
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(qd);
                return res.send(result.rows);
            } finally {
                client.release()
            }
        })().catch(e => {
            console.log(e.stack);
            return res.send({error: e.detail})
        });
    });

    /* Get all device ?by type */
    app.get('/api/device', isLoggedIn, function (req, res) {
        qdv = "SELECT device.serial_number, device.article, device.inventory_number, device_spr.device_title, " +
            "device_spr.device_resource, device_spr.device_partcode, device_spr.device_price, device_spr.device_type " +
            "FROM device " +
            "LEFT JOIN device_spr ON device.title_id = device_spr.id ";
        if (req.query['type']) {
            qdv = qdv + req.query['type'] + "'" + pagination(req.query);
        } else {
            qdv = qdv + pagination(req.query);
        }
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(qdv);
                return res.send(result.rows);
            } finally {
                client.release()
            }
        })().catch(e => {
            console.log(e.stack);
            return res.send({error: e.detail})
        });
    });

    /* Get all engineers */
    app.get('/api/engineers', isLoggedIn, function (req, res) {
        qe = "SELECT * FROM engineers_spr";
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(qe);
                return res.send(result.rows);
            } finally {
                client.release()
            }
        })().catch(e => {
            console.log(e.stack);
            return res.send({error: e.detail})
        });
    });

    /* Get all tasks or tasks by company id */
    app.get('/api/tasks', isLoggedIn, function (req, res) {
        qtasks = "SELECT task.id, task.task_title as task, task.description as desc, company.name as company, " +
            "company_address.name, company_address.identification, company_member.name as contact, " +
            "company_member.position, company_member.phone, task.date_time as creat_time, " +
            "task.deadline, status_spr.status, users.firstname as author " +
            "FROM task " +
            "LEFT JOIN company_address ON task.company_address_id = company_address.id " +
            "LEFT JOIN status_spr ON task.status_id = status_spr.id " +
            "LEFT JOIN company_member ON task.company_member_id = company_member.id " +
            "LEFT JOIN users ON  task.author_id = users.id " +
            "LEFT JOIN company ON company_address.company_id = company.id ";
        if (req.query['company_id']) {
            cid = req.query['company_id'];
            qtasks = qtasks + " WHERE task.company_id = " + cid + pagination(req.query);
        } else {
            qtasks = qtasks + pagination(req.query);
        }
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(qtasks);
                return res.send(result.rows);
            } finally {
                client.release()
            }
        })().catch(e => {
            console.log(e.stack);
            return res.send({error: e.detail})
        });
    });

    /* Get device history company_id */
    app.get('/api/dev-history', isLoggedIn, function (req, res) {
        qh = "SELECT device_history.id as id, company.name as company, device_spr.device_title as device, device.serial_number, " +
            "device.article, device.inventory_number, device_history.page_count as print, " +
            "device_history.scan_count as scan, device_spr.device_resource as resource, " +
            "device_spr.device_partcode as partcode, device_history.list_works as works, " +
            "device_history.device_expense as expense, device_history.total_summa as summa, " +
            "device_history.date_time, status_spr.status, engineers_spr.name as enginer " +
            "FROM device_history " +
            "LEFT JOIN company ON device_history.company_id= company.id " +
            "LEFT JOIN device ON device_history.device_id= device.id " +
            "LEFT JOIN status_spr ON device_history.status_id = status_spr.id " +
            "LEFT JOIN engineers_spr ON device_history.service_engineer= engineers_spr.id " +
            "LEFT JOIN company_device ON company_device.company_id = company.id AND company_device.device_id = device.id " +
            "LEFT JOIN device_spr ON device.title_id = device_spr.id ";
        if (req.query['company_id']) {
            cid = req.query['company_id'];
            qh = qh + " WHERE company.id = " + cid;
        }
        qh = qh + pagination(req.query);
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(qh);
                return res.send(result.rows);
            } finally {
                client.release()
            }
        })().catch(e => {
            console.log(e.stack);
            return res.send({error: e.detail})
        });
    });

//-----
//Put's
    /* Put company */
    app.put('/api/company', isLoggedIn, multipart.array(), function (req, res) {
        if (req.body['name']) {
            pc = "INSERT INTO company (name) VALUES ('" + req.body['name'] + "')";
            (async () => {
                const client = await pool.connect();
                try {
                    const result = await client.query(pc);
                    rslt = result.rows;
                    return res.send({result: 'success'});
                } finally {
                    client.release()
                }
            })().catch(e => {
                console.log(e.stack);
                return res.send({error: e.detail})
            });
        } else {
            res.send({error: 'name filed required'});
        }
    });

    /* Put company address */
    app.put('/api/address', isLoggedIn, multipart.array(), function (req, res) {
        pa = "INSERT INTO company_address (company_id ,address, identification, description) VALUES (";
        if (req.body['company_id'] && req.body['address']) {
            pa = pa + req.body['company_id'] + ", '" + req.body['address'] + "'";
            if (req.body['identification']) {
                pa = pa + ", '" + req.body['identification'] + "'";
            } else {
                pa = pa + ", ''";
            }
            if (req.body['description']) {
                pa = pa + ", '" + req.body['description'] + "'";
            } else {
                pa = pa + ", ''";
            }
            pa = pa + ")";
            (async () => {
                const client = await pool.connect();
                try {
                    const result = await client.query(pa);
                    rslt = result.rows;
                    return res.send({result: 'success'});
                } finally {
                    client.release()
                }
            })().catch(e => {
                console.log(e.stack);
                return res.send({error: e.detail})
            });
        } else {
            res.send({error: 'company_id and address required'});
        }
    });

    /* Put members of company */
    app.put('/api/members', isLoggedIn, multipart.array(), function (req, res) {
        pm = "INSERT INTO company_member (name, company_id, address_id, position, phone) VALUES (";
        if (req.body['name'] && req.body['company_id']) {
            pm = pm + "'" + req.body['name'] + "', " + req.body['company_id'];
            if (req.body['address_id']) {
                pm = pm + ", " + req.body['address_id'];
            } else {
                pm = pm + ", " + null;
            }
            if (req.body['position']) {
                pm = pm + ", '" + req.body['position'] + "'";
            } else {
                pm = pm + ", ''"
            }
            if (req.body['phone']) {
                pm = pm + ", '" + req.body['phone'] + "'";
            } else {
                pm = pm + ", ''"
            }
            pm = pm + ")";
            (async () => {
                const client = await pool.connect();
                try {
                    const result = await client.query(pm);
                    rslt = result.rows;
                    return res.send({result: 'success'});
                } finally {
                    client.release()
                }
            })().catch(e => {
                console.log(e.stack);
                return res.send({error: e.detail})
            });
        } else {
            res.send({error: 'name and company_id is required'});
        }
    });

    /* Put new devicelist */
    app.put('/api/devicelist', isLoggedIn, multipart.array(), function (req, res) {
        pdl = "INSERT INTO device_spr (device_title, device_type, device_resource, device_partcode, device_price) VALUES ( ";
        if (req.body['device_title'] && req.body['device_type'] && req.body['device_resource'] && req.body['device_partcode']) {
            pdl = pdl + "'" + req.body['device_title'] + "', '" + req.body['device_type'] + "', '" + req.body['device_resource']
                + "', '" + req.body['device_partcode'];
            if (req.body['device_price']) {
                pdl = pdl + "', '" + req.body['device_price'] + "'"
            } else {
                pdl = pdl + "', " + null
            }
            pdl = pdl + ")";
            (async () => {
                const client = await pool.connect();
                try {
                    const result = await client.query(pdl);
                    rslt = result.rows;
                    return res.send({result: 'success'});
                } finally {
                    client.release()
                }
            })().catch(e => {
                console.log(e.stack);
                return res.send({error: e.detail})
            });
        } else {
            res.send({error: 'title_id, serial_number, article and inventory_number is required'});
        }
    });

    /* Put new device */
    app.put('/api/device', isLoggedIn, multipart.array(), function (req, res) {
        pd = "INSERT INTO device (title_id, serial_number, article, inventory_number) VALUES ( ";
        if (req.body['title_id'] && req.body['serial_number'] && req.body['article'] && req.body['inventory_number']) {
            pd = pd + req.body['title_id'] + ", '" + req.body['serial_number'] + "', '" + req.body['article']
                + "', '" + req.body['inventory_number'] + "')";
            (async () => {
                const client = await pool.connect();
                try {
                    const result = await client.query(pd);
                    rslt = result.rows;
                    return res.send({result: 'success'});
                } finally {
                    client.release()
                }
            })().catch(e => {
                console.log(e.stack);
                return res.send({error: e.detail})
            });
        } else {
            res.send({error: 'title_id, serial_number, article and inventory_number is required'});
        }
    });

    /* Put new device history */
    app.put('/api/dev-history', isLoggedIn, multipart.array(), function (req, res) {
        pdh = "INSERT INTO device_history (company_id, device_id, status_id, service_engineer, list_works, page_count, scan_count, total_summa, device_expense, date_time) VALUES (";
        if (req.body['company_id'] && req.body['device_id'] && req.body['status_id'] && req.body['service_engineer']) {
            pdh = pdh + req.body['company_id'] + ", " + req.body['device_id'] + ", " + req.body['status_id'] + ", "
                + req.body['service_engineer'];
            if (req.body['list_works']) {
                pdh = pdh + ", '[" + req.body['list_works'] + "]'";
            } else {
                pdh = pdh + ", null"
            }
            if (req.body['page_count']) {
                pdh = pdh + ", '" + req.body['page_count'] + "'";
            } else {
                pdh = pdh + ", null"
            }
            if (req.body['scan_count']) {
                pdh = pdh + ", '" + req.body['scan_count'] + "'";
            } else {
                pdh = pdh + ", null"
            }
            if (req.body['total_summa']) {
                pdh = pdh + ", '" + req.body['total_summa'] + "'";
            } else {
                pdh = pdh + ", null"
            }
            if (req.body['device_expense']) {
                pdh = pdh + ", '[" + req.body['device_expense'] + "]'";
            } else {
                pdh = pdh + ", null"
            }
            if (req.body['date_time']) { pdh += ", '"+req.body['date_time']+"'"} else {
                pdh = pdh + ", '" + n + "')";
            }
            console.log(pdh);
            (async () => {
                const client = await pool.connect();
                try {
                    const result = await client.query(pdh);
                    rslt = result.rows;
                    return res.send({result: 'success'});
                } finally {
                    client.release()
                }
            })().catch(e => {
                console.log(e.stack);
                return res.send({error: e.detail})
            });
        } else {
            res.send({error: 'company_id, device_id, status_id and service_engineer is required'});
        }
    });

    /* Put new task */
    app.put('/api/task', isLoggedIn, multipart.array(), function (req, res) {
        pt = "INSERT INTO task (task_title, company_id, company_address_id, author_id, status_id, company_member_id, deadline, description, date_time) VALUES (";
        if (req.body['task_title'] && req.body['company_id'] && req.body['company_address_id'] && req.body['author_id'] && req.body['status_id']) {
            pt = pt + "'" + req.body['task_title'] + "', " + req.body['company_id'] + ", " + req.body['company_address_id']
                + ", " + req.body['author_id'] + ", " + req.body['status_id'];
            if(req.body['company_member_id']) {
                pt = pt + ", " + req.body['company_member_id'];
            } else { pt = pt + ", null"}
            if(req.body['deadline']) {
                pt = pt + ", '" + req.body['deadline'] + "'";
            } else { pt = pt + ", null"}
            if(req.body['description']) {
                pt = pt + ", '" + req.body['description'] + "'";
            } else { pt = pt + ", null"}
            if (req.body['date_time']) { pt += ", '"+req.body['date_time']+"'"} else {
                pt = pt + ", '" + n + "')";
            }
            (async () => {
                const client = await pool.connect();
                try {
                    const result = await client.query(pt);
                    rslt = result.rows;
                    return res.send({result: 'success'});
                } finally {
                    client.release()
                }
            })().catch(e => {
                console.log(e.stack);
                return res.send({error: e.detail})
            });
        } else {
            res.send({error: 'task_title, company_id, company_address_id, author_id and status_id is required'});
        }
    });

//-----
// Post's
    /* Edit task */
    app.post('/api/task', isLoggedIn, multipart.array(), function (req, res) {
       pot = "UPDATE task SET ( ";
       if(req.body['id']) {
           if (req.body['task_title']) { pot += "task_title, " }
           if (req.body['company_id']) { pot += "company_id, " }
           if (req.body['company_address_id']) { pot += "company_address_id, " }
           if (req.body['author_id']) { pot += "author_id, " }
           if (req.body['status_id']) { pot += "status_id, " }
           if (req.body['company_member_id']) { pot += "company_member_id, " }
           if (req.body['deadline']) { pot += "deadline, " }
           if (req.body['description']) { pot += "description, " }
           pot += "date_time";
           pot += ") = (";
           if (req.body['task_title']) { pot += "'"+req.body['task_title']+"', " }
           if (req.body['company_id']) { pot += req.body['company_id']+", " }
           if (req.body['company_address_id']) { pot += req.body['company_address_id']+", " }
           if (req.body['author_id']) { pot += req.body['author_id']+", " }
           if (req.body['status_id']) { pot += req.body['status_id']+", " }
           if (req.body['company_member_id']) { pot += req.body['company_member_id']+", " }
           if (req.body['deadline']) { pot += "'"+req.body['deadline']+"', " }
           if (req.body['description']) { pot += "'"+req.body['description']+"', " }
           if (req.body['date_time']) { pot += "'"+req.body['date_time']+"'"} else {
               pot += "'" + n + "'";
           }
           pot += ") WHERE id =" + req.body['id'];
           console.log(pot);
           (async () => {
               const client = await pool.connect();
               try {
                   const result = await client.query(pot);
                   rslt = result.rows;
                   return res.send({result: 'success'});
               } finally {
                   client.release()
               }
           })().catch(e => {
               console.log(e.stack);
               return res.send({error: e.detail})
           });
       } else {
           res.send({error: 'id is required'});
       }
    });
//-----
    // custom callback
    var options = { // not required
        session: true, // default false - typically no need to change.
        badHeaderMessage: 'Authentication failure, bad header format ', // Message displayed when Authorization header format is incorrect.
        missingTokenMessage: 'Token is missing ' // Message displayed when token is not present.
    };

    function isLoggedIn(req, res, next) {
        passport.authenticate('bearer', options, function (error, user, info) {
            if (info === true) {
                return next();
            } else {
                res.send('Authentication failure ');
            }
        })(req, res, next);
    }

    function isAdmin(req, res, next) {
        passport.authenticate('bearer', options, function (error, user, info) {
            if (user.role_id === 1) {
                return next();
            } else {
                res.send('Authentication failure ');
            }
        })(req, res, next);
    }
};
