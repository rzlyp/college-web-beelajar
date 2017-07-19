const multer = require('multer');
const db = require('../../config/database');
const fs = require('fs');

function MateriController(){
	this.getMateri = (req, res, next) => {
		db.getConnection((err,con) => {
			con.query('SELECT * FROM materi', (err, data) =>{
				con.release();

				res.render('admin/materi/materi', {materi : data, user : req.user});
			});
		});
	}
	this.postAddMateri = (req, res, next) =>{
		var storage = multer.diskStorage({
      		destination : function(req,file,callback){
      			callback(null,'public/img');
      		},
      		filename : function(req,file,callback){
      			console.log(file);
      			callback(null,file.originalname);
      		}
      	});
      	var upload = multer({storage:storage}).single('foto_materi');

      	upload(req, res , (err)=>{
                  if(err){
                        res.end("Error multer "+err);
                  }

      		const nama_materi = req.body.nama_materi;
      		const foto_materi = req.file.filename;
      		const data = {
      			nama_materi : nama_materi,
      			foto_materi : foto_materi
      		}
      		db.getConnection((err,con) => {
			con.query('insert into materi set ?', data,(err, data) =>{
				con.release();

				res.redirect('/dashboard/admin/materi');
			});
		});
      	});
	}
      this.postEdit = (req, res, next) =>{
           var storage = multer.diskStorage({
                        destination : function(req,file,callback){
                              callback(null,'public/img');
                        },
                        filename : function(req,file,callback){
                              console.log(file);
                              callback(null,file.originalname);
                        }
                  });
                  var upload = multer({storage:storage}).single('foto_materi');

                  upload(req, res , (err)=>{
                                          db.getConnection((err,con) => {
                                                con.query("select * from materi where id_materi = ?", req.params.id_materi, (err, check) => {
                                                      var data = {
                                                                  nama_materi : req.body.nama_materi,
                                                                  foto_materi : check[0].foto_materi
                                                      }
                                                      if(req.file){
                                                                   data = {
                                                                        nama_materi : req.body.nama_materi,
                                                                        foto_materi : req.file.filename
                                                               }

                                                               if(check[0].foto_customer !== 'avatar.png'){
                                                                        fs.unlink('public/img/'+check[0].foto_materi);
                                                               }
                                                               

                                                      }
                                                      con.query('update materi set ? where id_materi = '+req.params.id_materi, data,(err, data) =>{
                                                      con.release();

                                                      res.redirect('/dashboard/admin/materi')
                                          });
                                                      
                                  });
                                                
                         });
                  });
      }
      this.deleteMateri = (req, res, next) =>{
            db.getConnection((err,con)=>{
                  con.query("select * from materi where id_materi = ?", req.params.id_materi, (err, check) => {
                         con.query("DELETE FROM materi where id_materi = ?",req.params.id_materi, (err, response)=>{
                              con.release();

                              fs.unlink('public/img/'+check[0].foto_materi);

                              res.redirect('/dashboard/admin/materi');
                              
                         });
                  });
            });
      }
}

module.exports = new MateriController();
