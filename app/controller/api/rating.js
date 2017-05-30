const Rating = require('../../models/rating');

function RatingController(){

	this.getRatingProfile = (req,res, next) =>{
		if(!req.params.id_materi){
				res.json({
					status_code : 400,
					message : "Params id materi not found"
				});
		}else{
			db.getConnection(function(err,con){
				con.query('SELECT * FROM pengajar_materi INNER JOIN pengajar ON pengajar.id_pengajar = pengajar_materi.id_pengajar where pengajar_materi.id_materi = ?',req.params.id_materi,function(err,user){
					con.release();

					if(err)
						console.log(err);

					res.json({
						status_code : 200,
						message : "success get pengajar materi",
						data : user
					});
				});
			});

		}
		
	}

	this.postRating = (req, res, next) =>{
		Rating.find({id_user : req.body.id_user}, (err, ratings) =>{
			if(err)
				console.log(err);

			if(ratings.length === 0){
				const data = {
					id_user : req.body.id_user,
					email_user : req.body.email_user,
					rating : [
						{
							pengirim :  req.body.id_pengirim,
							rating : req.body.rating,
							review : req.body.review
						}
					]
				};
				const rating = new Rating(data);
				rating.save((err) => {
					if(err)
						console.log(err);

					res.status(201).json({status_code : 201, message : 'success send rarting.'});
				});
			}else{
				const rating = {
							pengirim :  req.body.id_pengirim,
							rating : req.body.rating,
							review : req.body.review
				}
				Rating.findOneAndUpdate({id_user : req.body.id_user}, {$push : {rating : rating}},
					(err) => {
							if(err)
								console.log(err);
							
							res.json({status_code : 200, message : 'success send rarting.'});
					});
			}
		});
	}

}

module.exports = new RatingController();