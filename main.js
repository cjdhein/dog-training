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



app.post('/client', function(req,res,next) {
    var fromClient = req.body;
    console.log(fromClient);
    switch (fromClient.option) {
		case 'add':
			pool.query('INSERT INTO Client SET firstname=?, lastName=?, houseNum=? , street=? , city=? , state=? , zip=? , phone=? , email=?;',
				[fromClient.fName, fromClient.lName, fromClient.houseNum, fromClient.street, fromClient.city, fromClient.state, fromClient.zip, fromClient.phone, fromClient.email],
				function(err, result){
					if(err){
						next(err);
						return;
					}
					console.log(result);
					res.send(result);
			});	
			break;
		case 'nameList': 
			pool.query("SELECT idClient, CONCAT(Client.firstName, ' ', Client.lastName) AS Owner FROM Client;", function(err, rows, fields){
				if(err){
					next(err);
					return;
				}
				console.log(rows);
			   	res.send(rows);
			});		
			break;
		case 'edit':
			//confirm there is only one result; ie: confirm only one record with the unique id
			pool.query('SELECT * FROM Client WHERE idClient=?', [fromClient.idClient], function(err, result){
				if(err){
					next(err);
					return;
				}

				
				// if there was a single result
				if(result.length == 1){
					pool.query('UPDATE Client SET firstname=?, lastName=?, houseNum=? , street=? , city=? , state=? , zip=? , phone=? , email=? WHERE idClient=?;',
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
			break;
		case 'viewAll':
			pool.query("SELECT idClient, CONCAT(firstName, ' ', lastName) AS name, CONCAT(houseNum, ' ', street, ', ', city, ', ', state, ' ', zip) AS address, phone, email FROM Client;",
			function(err,rows,fields) {
				if(err){
					next(err);
					return;
				}

				console.log(rows);
				res.send(rows);
			});
			break;
        case 'delete':
        	console.log(fromClient.idClient);
            pool.query("DELETE FROM Client WHERE idClient=?;",fromClient.idClient,
                function(err, result){
                    if(err){
                        next(err);
                        return;
                    }
                    console.log(result);
                });
            break;
        case 'nameSearch': // search name
            pool.query("SELECT idClient, CONCAT(firstName, ' ', lastName) AS name, CONCAT(houseNum, ' ', street, ', ', city, ', ', state, ' ', zip) AS address, phone, email FROM Client WHERE firstName LIKE ? OR lastName LIKE ?;", ['%' + fromClient.searchData + '%', '%' + fromClient.searchData + '%'],
                function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log(rows)
                    res.send(rows);
                });
            break;
        case 'singleRecord':
            pool.query("SELECT idClient, firstName, lastName, houseNum, street, city, state, zip, phone, email FROM Client WHERE idClient=?;", [fromClient.idClient],
                function(err,rows,fields) {
                    if(err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });
            break;
	}
});

app.post('/dog', function(req,res,next) {
    var fromClient = req.body;
    console.log(fromClient);
    switch (fromClient.option) {
		case 'add':
            pool.query('INSERT INTO Dog SET name=?, breed=?, fk_idClient = ?',
                [fromClient.name, fromClient.breed, fromClient.owner],
                function(err, result){
                    if(err){
                        next(err);
                        return;
                    }
                    console.log(result);
                    res.send(result);
                });
            break;
        case 'viewAll': // all info (id, name, breed)
            pool.query("SELECT idDog, name, breed FROM Dog", function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                console.log(rows);
                res.send(rows);
            });
            break;
        case 'unowned': // unowned dogs
            pool.query("SELECT CONCAT(name, ', ', breed) AS dog, idDog FROM Dog WHERE fk_idClient IS NULL;", function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                console.log(rows);
                res.send(rows);

            });
            break;
        case 'nameSearch': // search name
            pool.query("SELECT idDog, name, breed FROM Dog WHERE name LIKE ?;", '%' + [fromClient.searchData] + '%',
                function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log(rows)
                    res.send(rows);
                });
            break;
        case 'edit': //update dog

            //confirm there is only one result; ie: confirm only one record with the unique id
            pool.query('SELECT * FROM Dog WHERE idDog=?', [fromClient.idDog], function(err, result){
                if(err){
                    next(err);
                    return;
                }

                // if there was a single result
                if(result.length == 1){
                    pool.query('UPDATE Dog SET name=?, breed=?, fk_idClient = ? WHERE idDog=?',
                        [fromClient.name, fromClient.breed, fromClient.idClient, fromClient.idDog],
                        function(err, result){
                            if(err){
                                next(err);
                                return;
                            }

                            console.log(result);

                        });

                }else{	//duplicate records with id exist
                    console.log("found more than one");
                    //send response to client
                    res.send('bad');
                }
               res.send(result);
            });
            break;
        case 'singleRecord':
            pool.query("SELECT idDog, name, breed, CONCAT(firstName, ' ', lastName) AS Owner, idClient FROM Dog LEFT JOIN Client ON idClient = fk_idClient WHERE idDog = ?;", [fromClient.idDog],
                function(err,rows,fields) {
                    if(err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });
            break;
        case 'viewall':
            pool.query("SELECT idDog, name, breed, CONCAT(firstName, ' ', lastName) AS Owner, idClient FROM Dog LEFT JOIN  Client ON idClient = fk_idClient;",
                function(err,rows,fields) {
                    if(err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });
            break;
		case 'delete':
			pool.query("DELETE FROM Dog WHERE idDog=?",[fromClient.idDog],
                function(err, result){
                    if(err){
                        next(err);
                        return;
                    }
                    console.log(result);
			});
			break;
		case 'ownedBy':
            pool.query("SELECT idDog, name, breed FROM Dog WHERE fk_idClient=?;",[fromClient.fk_idClient],
                function(err,rows,fields) {
                    if(err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });

    }
});

app.post('/plan', function(req,res,next){
    var fromClient = req.body;
    console.log(fromClient);
    switch (fromClient.option) {
		case 'add':
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
            break;
		case 'edit':
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
            break;
        case 'delete':
            pool.query("DELETE FROM Plan WHERE idPlan=?",[fromClient.idPlan],
                function(err, result){
                    if(err){
                        next(err);
                        return;
                    }
                    console.log(result);
                });
            break;
        case 'nameSearch': // search name
            pool.query("SELECT idPlan, name FROM Plan WHERE name LIKE ?;", '%' + [fromClient.searchData] + '%',
                function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log(rows)
                    res.send(rows);
                });
            break;
        case 'viewAll':
            pool.query("SELECT idPlan, name, description FROM Plan;",
                function(err,rows,fields) {
                    if(err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });
            break;
        case 'singleRecord':
            pool.query("SELECT idPlan, name, description FROM Plan WHERE idPlan = ?;", [fromClient.idPlan],
                function(err,rows,fields) {
                    if(err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });
            break;

	}
});


app.post('/package', function(req,res,next){
    var fromClient = req.body;
    console.log(fromClient);
    switch (fromClient.option) {
        case 'add':
            pool.query('INSERT INTO Package SET name=?, cost=?, numIncludedSessions=?;',
                [fromClient.name, fromClient.cost, fromClient.numIncludedSessions],
                function (err, result) {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log(result);
                    res.send(result);
                });
            break;
		case 'edit':
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
            break;
        case 'delete':
            pool.query("DELETE FROM Package WHERE idPackage=?",[fromClient.idPackage],
                function(err, result){
                    if(err){
                        next(err);
                        return;
                    }
                    console.log(result);
                });
            break;
        case 'nameSearch': // search name
            pool.query("SELECT idPackage, name, cost, numIncludedSessions FROM Package WHERE name LIKE ?;", '%' + [fromClient.searchData] + '%',
                function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log(rows)
                    res.send(rows);
                });
            break;
        case 'viewAll':
            pool.query("SELECT idPackage, name, cost, CONCAT(numIncludedSessions, ' sessions') AS numSessions FROM Package;",
                function(err,rows,fields) {
                    if(err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });
            break;
        case 'singleRecord':
            pool.query("SELECT idPackage, name, cost, numIncludedSessions FROM Package WHERE idPackage=?;", [fromClient.idPackage],
                function(err,rows,fields) {
                    if(err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });
            break;
    }
});


app.post('/session', function(req,res,next){
    var fromClient = req.body;
    console.log(fromClient);
    switch (fromClient.option) {
        case 'add':

            if (fromClient.fk_idPlan == '') {
                pool.query('INSERT INTO Session SET date=?, length=?, fk_idClient=?;',
                    [dateFormat(fromClient.date, "yyyy-mm-dd"), fromClient.length, fromClient.fk_idClient],
                    function (err, result) {
                        if (err) {
                            next(err);
                            return;
                        }
                        console.log(result);
                        res.send(result);
                    });
            }
            else {
                pool.query('INSERT INTO Session SET date=?, length=?, fk_idClient=?, fk_idPlan=?;',
                    [dateFormat(fromClient.date, "yyyy-mm-dd"), fromClient.length, fromClient.fk_idClient, fromClient.fk_idPlan],
                    function (err, result) {
                        if (err) {
                            next(err);
                            return;
                        }
                        console.log(result);
                        res.send(result);
                    });
            }


            break;
        case 'edit':
            //confirm there is only one result; ie: confirm only one record with the unique id
            pool.query('SELECT * FROM Session WHERE idSession=?', [fromClient.idSession], function (err, result) {
                if (err) {
                    next(err);
                    return;
                }


                // if there was a single result
                if (result.length == 1) {
                    pool.query('UPDATE Session SET date=?, length=?, fk_idClient=?, fk_idPlan=? WHERE idSession=?;',
                        [dateFormat(fromClient.date, "yyyy-mm-dd"), fromClient.length, fromClient.fk_idClient, fromClient.fk_idPlan, fromClient.idSession],
                        function (err, result) {
                            if (err) {
                                next(err);
                                return;
                            }
                            console.log(result);
                            res.send(result);
                        });

                } else {	//duplicate records with id exist
                    console.log("found more than one");
                    //send response to client
                    res.send('bad');
                }
            });
            break;
        case 'delete':
            pool.query("DELETE FROM Session WHERE idSession=?", [fromClient.idSession],
                function (err, result) {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log(result);
                });
            break;
        case 'viewAll':
            pool.query("SELECT idSession, date, CONCAT(firstName, ' ', lastName) AS client, CONCAT(length, ' hours') As duration FROM Session INNER JOIN Client ON fk_idClient = idClient;",
                function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });
            break;
        case 'singleRecord':
            pool.query("SELECT idSession, date, length, Session.fk_idClient, Session.fk_idPlan, Session.fk_idDog, Dog.name AS dogName, Plan.name AS planName, CONCAT(firstName, ' ', lastName) As client FROM Session INNER JOIN Client ON fk_idClient = idClient LEFT JOIN Dog ON fk_idDog = idDog LEFT JOIN Plan ON fk_idPlan = idPlan WHERE idSession=?;", [fromClient.idSession],
                function(err,rows,fields) {
                    if(err) {
                        next(err);
                        return;
                    }
                    console.log(rows);
                    res.send(rows);
                });
            break;
        case 'dateSearch':
        	switch(fromClient.type){
				case '<':
                    pool.query("SELECT idSession, date, CONCAT(firstName, ' ', lastName) AS client, CONCAT(length, ' hours') As duration FROM Session INNER JOIN Client ON fk_idClient = idClient WHERE date <?;", [fromClient.type, fromClient.date],
                        function(err,rows,fields) {
                            if(err) {
                                next(err);
                                return;
                            }
                            console.log(rows);
                            res.send(rows);
                        });
                    break;
				case '>':
                    pool.query("SELECT idSession, date, CONCAT(firstName, ' ', lastName) AS client, CONCAT(length, ' hours') As duration FROM Session INNER JOIN Client ON fk_idClient = idClient WHERE date >?;", [fromClient.type, fromClient.date],
                        function(err,rows,fields) {
                            if(err) {
                                next(err);
                                return;
                            }
                            console.log(rows);
                            res.send(rows);
                        });
                    break;
				case '=':
                    pool.query("SELECT idSession, date, CONCAT(firstName, ' ', lastName) AS client, CONCAT(length, ' hours') As duration FROM Session INNER JOIN Client ON fk_idClient = idClient WHERE date =?;", [fromClient.type, fromClient.date],
                        function(err,rows,fields) {
                            if(err) {
                                next(err);
                                return;
                            }
                            console.log(rows);
                            res.send(rows);
                        });
                    break;
			}

            break;
    }
	
});

app.post('/package-contents', function(req,res,next){

    var fromClient = req.body; //data passed in post request
	
    console.log(fromClient);

    switch(fromClient.option) {
		case 'inPackage':
			pool.query("SELECT fk_idPlan, Plan.name AS plName FROM Package_contents INNER JOIN Plan ON idPlan = fk_idPlan WHERE fk_idPackage = ?", [fromClient.idPackage],
			function(err, rows, fields){
				if(err){
					next(err);
					return;
				}
				console.log(rows);
				res.send(rows);
			});

			break;
		case 'add':
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
            break;
		case 'delete':
            pool.query("SELECT * FROM Package_contents WHERE fk_idPackage=?, fk_idPlan=?;",
                [fromClient.fk_idPackage, fromClient.fk_idPlan], function(err,result) {
				if(err){
					next(err);
					return;						
				}
				if(result.length == 1) {
					pool.query("DELETE FROM Package_contents WHERE fk_idPackage=?, fk_idPlan=?;",
					[fromClient.fk_idPackage, fromClient.fk_idPlan], function(err,result) {
					if(err){
						next(err);
						return;						
					}
					console.log(result);
					res.send(result);
					});
				}
				else {
					console.log("Found more than one");
					res.send('bad');
				}

			});
			
			break;
			
	}



	
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
