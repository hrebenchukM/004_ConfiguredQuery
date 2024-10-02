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

  app.get('/allbooks',function(req, res) { 

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
        Books.Id_Themes, 
        Books.Id_Category, 
        Authors.FirstName, 
        Authors.LastName, 
        Books.Id_Press, 
        Books.Comment, 
        Books.Quantity 
    FROM 
        Books 
    JOIN 
        Authors ON Books.Id_Author = Authors.Id`, function (err, data) {
			if (err) console.log(err);
			else {
				var html = ``;
				var allItems = data.recordset;

				for (let i = 0; i < allItems.length; i++) {
					html += `<h3> ${allItems[i].Id} - ${allItems[i].Name}-${allItems[i].Pages}-${allItems[i].YearPress}-
					${allItems[i].Id_Themes}-${allItems[i].Id_Category}-${allItems[i].FirstName} ${allItems[i].LastName}-${allItems[i].Id_Press}-${allItems[i].Comment}-${allItems[i].Quantity}</h3>`
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
