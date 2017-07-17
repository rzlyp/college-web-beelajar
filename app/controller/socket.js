const db = require('../../config/database');

var logged = [];
module.exports = function(io,socket){
	
	socket.on('add new', function(data){
		socket.username = data;
		logged[data] = socket.id;
		io.sockets.emit('updateusers', socket.username);
		io.sockets.emit('updatechat', socket.username, 'Selamat datang');
		console.log(logged);
	});
	var user = logged;
	socket.on('send jadwal', function(data){
		var val = {
			id_pengajar : data.id_pengajar,
			id_customer : data.id_customer,
			materi_mengajar : data.materi_mengajar,
			tanggal_mengajar : data.tanggal_mengajar,
			jam_mengajar : data.jam_mengajar
		};
		db.getConnection((err, con) =>{
			con.query('INSERT INTO jadwal_mengajar SET ?', val , (err, status) =>{
				con.query('select * from jadwal_mengajar where id_pengajar =  ? and id_customer = ? and materi_mengajar = ?', [val.id_pengajar, val.id_customer, val.materi_mengajar] , (err, status) =>{
				con.release();
					io.sockets.emit('updatechat', socket.username, data.materi_mengajar);
					console.log(status);
					console.log(socket.username);
					socket.to(logged[data.toUsername]).emit('private', status);
				});
			});
		});
	});
	socket.on('send log', function(data){
		var val = {
			id_kelas_mengajar :data.id_kelas_mengajar,
			mulai_mengajar : data.mulai_mengajar,
			akhir_mengajar : data.selesai_mengajar
		};
		db.getConnection((err, con) =>{
			con.query('INSERT INTO log_mengajar SET ?', val , (err, status) =>{
				con.release();
					io.sockets.emit('updatechat', socket.username, data.materi_mengajar+' @'+data.toUsername);
					console.log(status);
					console.log(logged[data.toUsername]);
					socket.to(logged[data.toUsername]).emit('private', status);
			});
		});
	});
	// socket.on('selesai mengajar', function(data){
	// 	var val = {
	// 		id_kelas_mengajar : data.id_kelas_mengajar,
	// 		mulai_mengajar : data.mulai_mengajar

	// 	};
	// 	db.getConnection((err, con) =>{
	// 		con.query('update log_mengajar SET ?', val , (err, status) =>{
	// 			con.release();
	// 				io.sockets.emit('updatechat', socket.username, data.materi_mengajar+' @'+data.toUsername);
	// 				console.log(status);
	// 				console.log(logged[data.toUsername]);
	// 				socket.to(logged[data.toUsername]).emit('private', status);
	// 		});
	// 	});
	// });
	socket.on('disconnect', function(){
		
		delete logged[socket.username];
		console.log('disconnect ..'+socket.username);
		console.log(logged);
		
	});
}
