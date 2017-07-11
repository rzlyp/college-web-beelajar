var FCM = require('fcm-push');

var serverKey = 'AIzaSyAFtJUKf59QTPy03OO4cbBe3Fz5MWLe3fU';
var fcm = new FCM(serverKey);

var fcmTest = (req, res, next) =>{
    var message = {
    to: '/topics/global', // required fill with device token or topics
    collapse_key: '607868364991', 
    data: {
        id_artikel: 2361,
        judul_artikel: "Informasi Lowongan Pekerjaan Juli 2017",
        kategori_artikel: "news",
        foto: "informasi-lowongan-pekerjaan-juli-2017.jpg",
        tgl_post: "2017-07-10",
        slug: "informasi-lowongan-pekerjaan-juli-2017",
        pengirim: "Media Unikom"
    },
    notification: {
        title: 'Informasi Lowongan Pekerjaan Juli 2017',
        body: 'Oleh Media Unikom'
    }
};

//callback style
fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});

//promise style
// fcm.send(message)
//     .then(function(response){
//         console.log("Successfully sent with response: ", response);
//     })
//     .catch(function(err){
//         console.log("Something has gone wrong!");
//         console.error(err);
//     })
}

module.exports.fcmTest = fcmTest;
