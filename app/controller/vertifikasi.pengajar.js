const multer = require('multer');

const db = require('../../config/database');

function VertifikasiController(){
	this.vertifikasi = (req, res, next) =>{
		res.render('pengajar/vertifikasi',{user : req.user});
	}
	this.postVertifikasi = (req, res, next) =>{
		var storage = multer.diskStorage({
      		destination : function(req,file,callback){
      			callback(null,'public/vertifikasi');
      		},
      		filename : function(req,file,callback){
      			console.log(file);
      			callback(null,req.user.id_pengajar+'-'+file.fieldname+'-'+file.originalname);
      		}
      	});
      	var upload = multer({storage:storage}).fields([{name : 'foto_ktm', maxCount : 6}, {name : 'surat_aktif', maxCount : 6}]);

      	upload(req, res , (err)=>{
      		console.log(req.files['surat_aktif'][0].filename);
      		const data = {
      			nama_instansi : req.body.nama_instansi,
      			jurusan_kuliah : req.body.jurusan_kuliah,
      			foto_surat_aktif : req.files['surat_aktif'][0].filename,
      			foto_ktm : req.files['foto_ktm'][0].filename
      		}
      		db.getConnection((err,con) => {
				con.query('update pengajar set ? where id_pengajar = '+req.user.id_pengajar, data,(err, data) =>{
					con.release();

					res.redirect('/pengajar/vertifikasi');
				});
			});
      	});
	}
	this.ubahLokasi = (req, res, next) =>{
		con.query("delete from pengajar_materi where id_pengajar_materi ? ", req.params.id_pengajar_materi , (err, data) =>{
				con.release();	
					if(err)
						console.log(err);

					res.ren('/pengajar/dashboard');
		});
	}
}

module.exports = new VertifikasiController();