var express  = require('express'); 
var app = express(); 
var port = 8080; 
var mssql = require('mssql'); 
// параметры соединения с бд
var config = {
	user: 'admin',           // пользователь базы данных
	password: '12345',          // пароль пользователя 
	server: 'LENOVO\\SQLEXPRESS',       // хост
	database: 'Library',          // имя бд
	port: 1433,             // порт, на котором запущен sql server
	  options: {
		  encrypt: true,  // Использование SSL/TLS
		  trustServerCertificate: true // Отключение проверки самоподписанного сертификата
	  },
 }


 



////////////////////////1////////////////////////////
  app.get('/Books',function(req, res) { 

	var connection = new mssql.ConnectionPool(config);

	connection.connect(function (err) {
		// Для выполнения запросов к бд используется метод request.query(command, callback(err, data))
		// метод query принимает такие аргументы: 

		// command - выражение t-sql 
		// callback - функция с параметрами err(ошибка) и data(результат запроса к бд) 
		var request = new mssql.Request(connection);
		request.query(`
    SELECT 
        Books.Id, 
        Books.Name, 
        Books.Pages, 
        Books.YearPress, 
        Themes.Name AS ThemeName, 
        Categories.Name AS CategoryName,  
        Authors.FirstName, 
        Authors.LastName, 
        Press.Name AS PressName,
        Books.Comment, 
        Books.Quantity 
    FROM 
        Books 
   JOIN 
    Authors ON Books.Id_Author = Authors.Id
   JOIN 
    Themes ON Books.Id_Themes = Themes.Id
   JOIN 
    Categories ON Books.Id_Category = Categories.Id
   JOIN 
    Press ON Books.Id_Press = Press.Id`, function (err, data) {
			if (err) console.log(err);
			else {
				var allItems = data.recordset;

				var html = ` 
			<table border="1">
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Pages</th>
                <th>Year Press</th>
                <th>Theme Name</th>
                <th>Category Name</th>
                <th>Author</th>
                <th>Press Name</th>
                <th>Comment</th>
                <th>Quantity</th>
            </tr>
			`;
			
				for (let i = 0; i < allItems.length; i++) {
					html += `
		 <tr>
            <td>${allItems[i].Id}</td>
            <td>${allItems[i].Name}</td>
            <td>${allItems[i].Pages}</td>
            <td>${allItems[i].YearPress}</td>
            <td>${allItems[i].ThemeName}</td>
            <td>${allItems[i].CategoryName}</td>
            <td>${allItems[i].FirstName} ${allItems[i].LastName}</td>
            <td>${allItems[i].PressName}</td>
            <td>${allItems[i].Comment}</td>
            <td>${allItems[i].Quantity}</td>
        </tr>`
				}
				res.send(html);
				// завершить соединение 
				connection.close();
			}
		});
	});
});



////////////////////////////////2////////////////////////////
app.get('/Books/Authors/:LastName',function(req, res) { 
	
    var lName = req.params.LastName;

	var connection = new mssql.ConnectionPool(config);
	connection.connect(function(err){		
		    // конструктор для предварительного форматирования запросов к бд - PreparedStatement
			var ps = new mssql.PreparedStatement(connection);		
			// метод input позволяет указать значение параметра, который будет использован в запросе  
			// аргументы: 
			
			// name - имя параметра 
			// type - SQL тип данных 

            ps.input('lName', mssql.VarChar);

			
			// подготовка запроса 
			ps.prepare(`
            SELECT
            Books.Name
            FROM Books
            JOIN Authors ON Books.Id_Author = Authors.Id
            WHERE Authors.LastName = @lName
			`, function(err) {
				
				if (err) console.log(err); 

				// выполнение запроса 
				ps.execute({lName: lName}, function(err, data) {
					if (err) console.log(err); 
					
					res.send(data.recordset); 
					console.log('prepared statement executed'); 					
				});
			});		
	});
}); 


////////////////////////////////3////////////////////////////
app.get('/Books/Press/:PressName',function(req, res) { 
	
    var pressName = req.params.PressName;

	var connection = new mssql.ConnectionPool(config);
	connection.connect(function(err){		
		    // конструктор для предварительного форматирования запросов к бд - PreparedStatement
			var ps = new mssql.PreparedStatement(connection);		
			// метод input позволяет указать значение параметра, который будет использован в запросе  
			// аргументы: 
			
			// name - имя параметра 
			// type - SQL тип данных 

            ps.input('pressName', mssql.VarChar);

			
			// подготовка запроса 
			ps.prepare(`
            SELECT
            Books.Name
            FROM Books
            JOIN Press ON Books.Id_Press = Press.Id
            WHERE Press.Name = @pressName
			`, function(err) {
				
				if (err) console.log(err); 

				// выполнение запроса 
				ps.execute({pressName: pressName}, function(err, data) {
					if (err) console.log(err); 
					
					res.send(data.recordset); 
					console.log(data.recordset); 

					console.log('prepared statement executed'); 					
				});
			});		
	});
}); 


///////////////////////////4/////////////////////////

app.get('/Students',function(req, res) { 

	var connection = new mssql.ConnectionPool(config);

	connection.connect(function (err) {
		// Для выполнения запросов к бд используется метод request.query(command, callback(err, data))
		// метод query принимает такие аргументы: 

		// command - выражение t-sql 
		// callback - функция с параметрами err(ошибка) и data(результат запроса к бд) 
		var request = new mssql.Request(connection);
		request.query(`
    SELECT 
        Students.Id, 
        Students.FirstName, 
        Students.LastName, 
        Students.Id_Group, 
        Students.Term,
		Groups.Name
    FROM 
        Students 
     JOIN 
        Groups ON Students.Id_Group = Groups.Id `, function (err, data) {
			if (err) console.log(err);
			else {
				var html = ``;
				var allItems = data.recordset;

				for (let i = 0; i < allItems.length; i++) {
					html += `<h3> ${allItems[i].Id} - ${allItems[i].FirstName}-${allItems[i].LastName}-${allItems[i].Name}-
					${allItems[i].Term}</h3>`
				}
				res.send(html);
				// завершить соединение 
				connection.close();
			}
		});
	});
});

//////////////////////////////5//////////////////////


app.get('/Students/Groups/:GroupName',function(req, res) { 
	
    var groupName = req.params.GroupName;

	var connection = new mssql.ConnectionPool(config);
	connection.connect(function(err){		
		    // конструктор для предварительного форматирования запросов к бд - PreparedStatement
			var ps = new mssql.PreparedStatement(connection);		
			// метод input позволяет указать значение параметра, который будет использован в запросе  
			// аргументы: 
			
			// name - имя параметра 
			// type - SQL тип данных 

            ps.input('groupName', mssql.VarChar);

			
			// подготовка запроса 
			ps.prepare(`
            SELECT
            Students.FirstName, 
            Students.LastName
            FROM Students
            JOIN Groups ON Students.Id_Group = Groups.Id
            WHERE Groups.Name = @groupName
			`, function(err) {
				
				if (err) console.log(err); 

				// выполнение запроса 
				ps.execute({groupName: groupName}, function(err, data) {
					if (err) console.log(err); 
					
					res.send(data.recordset); 
					console.log(data.recordset); 

					console.log('prepared statement executed'); 					
				});
			});		
	});
}); 


//////////////////////6/////////////////

app.get('/Teachers',function(req, res) { 

	var connection = new mssql.ConnectionPool(config);

	connection.connect(function (err) {
		// Для выполнения запросов к бд используется метод request.query(command, callback(err, data))
		// метод query принимает такие аргументы: 

		// command - выражение t-sql 
		// callback - функция с параметрами err(ошибка) и data(результат запроса к бд) 
		var request = new mssql.Request(connection);
		request.query(`
    SELECT 
        Teachers.Id, 
        Teachers.FirstName, 
        Teachers.LastName, 
		Departments.Name 
    FROM 
        Teachers 
    JOIN 
        Departments ON Teachers.Id_Dep = Departments.Id`, function (err, data) {
			if (err) console.log(err);
			else {
				var html = ``;
				var allItems = data.recordset;

				for (let i = 0; i < allItems.length; i++) {
					html += `<h3> ${allItems[i].Id} - ${allItems[i].FirstName}-${allItems[i].LastName}-${allItems[i].Name}</h3>`
				}
				res.send(html);
				// завершить соединение 
				connection.close();
			}
		});
	});
});


////////////////////7////////////////////


app.get('/Faculties',function(req, res) { 

	var connection = new mssql.ConnectionPool(config);

	connection.connect(function (err) {
		// Для выполнения запросов к бд используется метод request.query(command, callback(err, data))
		// метод query принимает такие аргументы: 

		// command - выражение t-sql 
		// callback - функция с параметрами err(ошибка) и data(результат запроса к бд) 
		var request = new mssql.Request(connection);
		request.query(`
    SELECT 
        Faculties.Id, 
        Faculties.Name
    FROM 
        Faculties 
   `, function (err, data) {
			if (err) console.log(err);
			else {
				var html = ``;
				var allItems = data.recordset;

				for (let i = 0; i < allItems.length; i++) {
					html += `<h3> ${allItems[i].Id} - ${allItems[i].Name}</h3>`
				}
				res.send(html);
				// завершить соединение 
				connection.close();
			}
		});
	});
});



app.listen(port, function() { 
	console.log('app listening on port ' + port); 

}); 





// app.get('/:id',function(req, res) { 
//     var id = req.params.id;


// 	var connection = new mssql.ConnectionPool(config);
// 	connection.connect(function(err){		
// 		    // конструктор для предварительного форматирования запросов к бд - PreparedStatement
// 			var ps = new mssql.PreparedStatement(connection);		
// 			// метод input позволяет указать значение параметра, который будет использован в запросе  
// 			// аргументы: 
			
// 			// name - имя параметра 
// 			// type - SQL тип данных 
			
// 			ps.input('param', mssql.Int);
			
// 			// подготовка запроса 
// 			ps.prepare('SELECT * FROM items WHERE id=@param ', function(err) {
				
// 				if (err) console.log(err); 

// 				// выполнение запроса 
// 				ps.execute({param: id}, function(err, data) {
// 					if (err) console.log(err); 
					
// 					res.send(data.recordset); 
// 					console.log('prepared statement executed'); 					
// 				});
// 			});		
// 	});
// }); 
