var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var multer = require('multer');
var multipart = multer();

const env = require('./env.js');
const {Pool} = require('pg');
const pool = new Pool(env.dbConfig);

router.get('/', function (req, res, next) {
    res.render('api', {result: 'RestAPI'});
});

/* Check auth */
function authValid(token) {
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    let valid;
    q = "SELECT * FROM users WHERE token = '"+token+"'";
    check = new Promise(function (resolve, reject) {
        pool.query(q, function(err, result) {
            if (err) {
                return reject(err);
            } else {
                if (result.rowCount > 0) {
                    return resolve(true);
                }
            }
            return resolve(false);
        });
    }).then(r => {
        valid = r;
        console.log(valid);
        return valid;
    });
}

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

/* Get all company */
router.get('/company', function (req, res) {
    let check = authValid(req.headers.authorization);
    if(req.headers.authorization && authValid(req.headers.authorization)) {
        q = "SELECT * FROM company";
        (async () => {
            const client = await pool.connect();
            try {
                const result = await client.query(q);
                rslt = result.rows;
                return res.send(rslt);
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack));
    } else {
        return res.send('Token is not valid');
    }
});

/* Get all company */
router.get('/address', function (req, res) {
    q = "SELECT * FROM company_address";
    if (req.query['company_id']) {
        cid = req.query['company_id'];
        q = q + "WHERE company_id = " + cid;
    }
    (async () => {
        const client = await pool.connect();
        try {
            const result = await client.query(q);
            rslt = result.rows;
            return res.send(rslt);
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack));
});

/* Get all status */
router.get('/status', function (req, res) {
    q = "SELECT * FROM status_spr";
    (async () => {
        const client = await pool.connect();
        try {
            const result = await client.query(q);
            rslt = result.rows;
            return res.send(rslt);
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack));
});

/* Get all device ?by type */
router.get('/device', function (req, res) {
    if (req.query['type']) {
        t = req.query['type'];
        q = "SELECT * FROM device_spr WHERE device_spr.device_type = '" + t + "'" + pagination(req.query);
    } else {
        q = "SELECT * FROM device_spr ORDER BY device_spr.id" + pagination(req.query);
    }
    (async () => {
        const client = await pool.connect();
        try {
            const result = await client.query(q);
            rslt = result.rows;
            return res.send(rslt);
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack));
});

/* Get tasks by company id */
router.get('/tasks', function (req, res) {
    if (req.query['company_id']) {
        cid = req.query['company_id'];
        q = "SELECT task.id, task.task_title as task, task.description as desc, company.name as company, " +
            "company_address.address, company_address.identification, company_member.name as contact, " +
            "company_member.position, company_member.phone, task.date_time as creat_time, " +
            "task.deadline, status_spr.status, users.name as author " +
            "FROM task " +
            "LEFT JOIN company_address ON task.company_address_id = company_address.id " +
            "LEFT JOIN status_spr ON task.status_id = status_spr.id " +
            "LEFT JOIN company_member ON task.company_member_id = company_member.id " +
            "LEFT JOIN users ON  task.author_id = users.id " +
            "LEFT JOIN company ON company_address.company_id = company.id " +
            "WHERE task.company_id = " + cid + pagination(req.query);
    } else {
        q = "SELECT * FROM all_models ORDER BY all_models.id" + pagination(req.query);
    }
    (async () => {
        const client = await pool.connect();
        try {
            const result = await client.query(q);
            rslt = result.rows;
            return res.send(rslt);
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack));
});

/* Get device history company_id */
router.get('/dev-history', function (req, res) {
    q = "SELECT company.name as company, device_spr.device_title as device, device.serial_number, " +
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
        q = q + "WHERE company.id = " + cid;
    }
    q = q + pagination(req.query);
    console.log(q);
    (async () => {
        const client = await pool.connect();
        try {
            const result = await client.query(q);
            rslt = result.rows;
            return res.send(rslt);
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack));
});

module.exports = router;
