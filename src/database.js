const mongoose = require("mongoose")

const database = async()=>{
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/albitrade')
    .then(() => {
        console.log("veritabanına bağlandı")
    })
    } catch (error) {
        console.log("veritabanına bağlanırken bir hata oluştu")
    }
}

module.exports=database