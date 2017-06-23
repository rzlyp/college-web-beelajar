const multer = require('multer');

const db = require('../../config/database');

function PengajarController(){
	this.getPengajar = (req, res, next) =>{
            db.getConnection((err,con) => {
                        con.query("select * from pengajar where role = 'pengajar'",(err, data) =>{
                              con.release();

                              res.render('admin/pengajar/index',{user : req.user, pengajar : data});
                        });
                  });
		
	}
	this.getVertifikasi = (req, res, next) =>{
		db.getConnection((err,con) => {
                        con.query("select * from pengajar where id_pengajar = ?", req.params.id_pengajar,(err, data) =>{
                              con.release();

                              res.render('admin/pengajar/vertifikasi',{user : req.user, pengajar : data[0]});
                        });
            });
	}
      this.postVertifikasi = (req, res, next) =>{
            const data = {
                  status : 'vertified'
            };
            db.getConnection((err,con) => {
                        con.query("update pengajar set ? where id_pengajar = "+req.params.id_pengajar, data ,(err, data) =>{
                              con.release();

                              res.redirect('/dashboard/admin/pengajar');
                        });
            });
      }
	
}

module.exports = new PengajarController();