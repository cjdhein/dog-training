var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 24561);
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var request = require('request');

var mysql = require('mysql');
var pool = mysql.createPool({
    host :  'classmysql.engr.oregonstate.edu',
    user :  'cs340_dheinc',
    password : '6144',
    database : 'cs340_dheinc',
    dateStrings: true
});


app.get('/reset-table',function(req,res,next){
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "lbs BOOLEAN)";
        pool.query(createString, function(err){
            context.results = "Table reset";
            res.render('home',context);
        })
    });
});

app.get('/',function(req,res, next){
    var  context = {results: "Words"};
    res.render('home', context);
});

app.get('/get-clients',function(req,res, next){
    var context = {};
    console.log(req.query);

    pool.query("SELECT CONCAT(firstName, ' ', lastName) AS Name, CONCAT(houseNum, ' ', street, ', ', city, ', ', state, ' ', zip) AS Address, phone, email, idClient FROM Client;", function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        console.log(rows);
       res.send(rows);

    });
});

app.post('/dog-info', function(req,res,next) {
    var fromClient = req.body;

    switch (fromClient.option) {
        case 0: // all info (id, name, breed)
            pool.query("SELECT idDog, name, breed FROM Dog", function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                console.log(rows);
                res.send(rows);
            });
            break;
        case 1: // unowned dogs
            pool.query("SELECT CONCAT(name, ', ', breed) AS dog, idDog FROM Dog LEFT JOIN Dog_ownership on idDog = fk_idDog WHERE fk_idDog IS NULL;", function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                console.log(rows);
                res.send(rows);

            });
            break;
        case 2: // search breed
            pool.query("SELECT idDog, name, breed FROM Dog WHERE breed LIKE '%?%';", [fromClient.searchData],
                function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log(rows)
                    res.send(rows);
                });
    }
});




app.get('/get-clients-selection',function(req,res, next){
    var context = {};
    console.log(req.query);

    pool.query("SELECT idClient, CONCAT(Client.firstName, ' ', Client.lastName) AS Owner FROM Client;", function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        console.log(rows);
       res.send(rows);

    });
});

app.get('/get-unowned-dogs',function(req,res, next){
    var context = {};
    console.log(req.query);

    pool.query("SELECT CONCAT(name, ', ', breed) AS dog, idDog FROM Dog LEFT JOIN Dog_ownership on idDog = fk_idDog WHERE fk_idDog IS NULL;", function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        console.log(rows);
       res.send(rows);

    });
});

app.post('/post-client', function(req,res, next){

    var fromClient = req.body; //data passed in post request
	
    console.log(fromClient);
    pool.query('INSERT INTO Client SET firstname=?, lastName=?, houseNum=? , street=? , city=? , state=? , zip=? , phone=? , email=?',
        [fromClient.fName, fromClient.lName, fromClient.houseNum, fromClient.street, fromClient.city, fromClient.state, fromClient.zip, fromClient.phone, fromClient.email],
		function(err, result){
			if(err){
				next(err);
				return;
			}
			console.log(result);
			res.send(result);
	});

});

app.post('/edit-client', function(req,res, next){
	
	var fromClient = req.body; //data passed in post request

    console.log(fromClient);

	//confirm there is only one result; ie: confirm only one record with the unique id
	pool.query('SELECT * FROM Client WHERE idClient=?', [fromClient.idClient], function(err, result){
		if(err){
			next(err);
			return;
		}

		
		// if there was a single result
		if(result.length == 1){
			pool.query('UPDATE Client SET firstname=?, lastName=?, houseNum=? , street=? , city=? , state=? , zip=? , phone=? , email=? WHERE idClient=?',
			[fromClient.fName, fromClient.lName, fromClient.houseNum, fromClient.street, fromClient.city, fromClient.state, fromClient.zip, fromClient.phone, fromClient.email, fromClient.idClient],
			function(err, result){
				if(err){
					next(err);
					return;
				}
				console.log(result);
				res.send(result);
		});
			
		}else{	//duplicate records with id exist
            console.log("found more than one");
            //send response to client
            res.send('bad');
		}
	});

});

app.post('/post-dog', function(req,res, next){

    var fromClient = req.body; //data passed in post request
	
    console.log(fromClient);
	
    pool.query('INSERT INTO Dog SET name=?, breed=?;',
        [fromClient.name, fromClient.breed],
		function(err, result){
			if(err){
				next(err);
				return;
			}
			console.log(result);
			res.send(result);
	});

});

app.post('/edit-dog', function(req,res, next){
	
	var fromClient = req.body; //data passed in post request


    console.log(fromClient);

	//confirm there is only one result; ie: confirm only one record with the unique id
	pool.query('SELECT * FROM Dog WHERE idDog=?', [fromClient.idDog], function(err, result){
		if(err){
			next(err);
			return;
		}

		
		// if there was a single result
		if(result.length == 1){
			pool.query('UPDATE Dog SET name=?, breed=? WHERE idDog=?',
			[fromClient.name, fromClient.breed, fromClient.idDog],
			function(err, result){
				if(err){
					next(err);
					return;
				}
				console.log(result);
				res.send(result);
		});
			
		}else{	//duplicate records with id exist
            console.log("found more than one");
            //send response to client
            res.send('bad');
		}
	});

});

app.post('/post-plan', function(req,res,next){
	
    var fromClient = req.body; //data passed in post request
	
    console.log(fromClient);
	
    pool.query('INSERT INTO Plan SET name=?, description=?;',
        [fromClient.name, fromClient.description],
		function(err, result){
			if(err){
				next(err);
				return;
			}
			console.log(result);
			res.send(result);
	});
	
});

app.post('/edit-plan', function(req,res, next){
	
	var fromClient = req.body; //data passed in post request


    console.log(fromClient);

	//confirm there is only one result; ie: confirm only one record with the unique id
	pool.query('SELECT * FROM Plan WHERE idPlan=?', [fromClient.idPlan], function(err, result){
		if(err){
			next(err);
			return;
		}

		
		// if there was a single result
		if(result.length == 1){
			pool.query('UPDATE Plan SET name=?, description=? WHERE idPlan=?',
			[fromClient.name, fromClient.description, fromClient.idPlan],
			function(err, result){
				if(err){
					next(err);
					return;
				}
				console.log(result);
				res.send(result);
		});
			
		}else{	//duplicate records with id exist
            console.log("found more than one");
            //send response to client
            res.send('bad');
		}
	});

});


app.post('/post-package', function(req,res,next){
	
    var fromClient = req.body; //data passed in post request
	
    console.log(fromClient);
	
    pool.query('INSERT INTO Package SET name=?, cost=?, numIncludedSessions=?;',
        [fromClient.name, fromClient.cost, fromClient.numIncludedSessions],
		function(err, result){
			if(err){
				next(err);
				return;
			}
			console.log(result);
			res.send(result);
	});
	
});

app.post('/edit-package', function(req,res, next){
	
	var fromClient = req.body; //data passed in post request


    console.log(fromClient);

	//confirm there is only one result; ie: confirm only one record with the unique id
	pool.query('SELECT * FROM Package WHERE idPackage=?', [fromClient.idPackage], function(err, result){
		if(err){
			next(err);
			return;
		}

		
		// if there was a single result
		if(result.length == 1){
			pool.query('UPDATE Package SET name=?, cost=?, numIncludedSessions=? WHERE idPackage=?',
			[fromClient.name, fromClient.cost, fromClient.numIncludedSessions, fromClient.idPackage],
			function(err, result){
				if(err){
					next(err);
					return;
				}
				console.log(result);
				res.send(result);
		});
			
		}else{	//duplicate records with id exist
            console.log("found more than one");
            //send response to client
            res.send('bad');
		}
	});

});

app.post('/post-session', function(req,res,next){
	
    var fromClient = req.body; //data passed in post request
	
    console.log(fromClient);
	
    pool.query('INSERT INTO Session SET date=?, length=?, fk_idClient=?, fk_idPlanTaught=?;',
        [dateFormat(fromClient.date, "yyyy-mm-dd"), fromClient.length, fromClient.fk_idClient, fromClient.fk_idPlanTaught],
		function(err, result){
			if(err){
				next(err);
				return;
			}
			console.log(result);
			res.send(result);
	});
	
});

app.post('/edit-session', function(req,res, next){
	
	var fromClient = req.body; //data passed in post request


    console.log(fromClient);

	//confirm there is only one result; ie: confirm only one record with the unique id
	pool.query('SELECT * FROM Session WHERE idSession=?', [fromClient.idSession], function(err, result){
		if(err){
			next(err);
			return;
		}

		
		// if there was a single result
		if(result.length == 1){
			pool.query('UPDATE Session SET date=?, length=?, fk_idClient=?, fk_idPlanTaught=? WHERE idSession=?;',
        [dateFormat(fromClient.date, "yyyy-mm-dd"), fromClient.length, fromClient.fk_idClient, fromClient.fk_idPlanTaught, fromClient.idSession],
			function(err, result){
				if(err){
					next(err);
					return;
				}
				console.log(result);
				res.send(result);
		});
			
		}else{	//duplicate records with id exist
            console.log("found more than one");
            //send response to client
            res.send('bad');
		}
	});

});

app.post('/post-client-dog-link', function(req,res,next){
	
    var fromClient = req.body; //data passed in post request
	
    console.log(fromClient);
	
    pool.query('INSERT INTO Dog_ownership SET fk_idDog=?, fk_idClient=?;',
        [fromClient.fk_idDog, fromClient.fk_idClient],
		function(err, result){
			if(err){
				next(err);
				return;
			}
			console.log(result);
			res.send(result);
	});
	
});


app.post('/post-plan-package-link', function(req,res,next){
	
    var fromClient = req.body; //data passed in post request
	
    console.log(fromClient);
	
    pool.query('INSERT INTO Package_contents SET fk_idPackage=?, fk_idPlan=?;',
        [fromClient.fk_idPackage, fromClient.fk_idPlan],
		function(err, result){
			if(err){
				next(err);
				return;
			}
			console.log(result);
			res.send(result);
	});
	
});



app.post('/delete', function(req,res, next){

    var idToDelete = req.body.id;

    pool.query('SELECT * FROM workouts WHERE id=?', [idToDelete], function(err, result){
        if(err){
            next(err);
            return;
        }

        // if there was a single result
        if(result.length == 1){
            console.log("Found only one");
            pool.query('DELETE FROM workouts WHERE id=?',
                [idToDelete],
                function(err, result){
                    if(err){
                        next(err);
                        return;
                    }
                    //send response to client
                    console.log(result);
                    res.type('html');
                    res.send('ok');
                });

        }else{	//duplicate records with id exist
            console.log("found more");
            //send response to client
            res.send('bad');
        }
    });

    console.log(idToDelete);

});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
