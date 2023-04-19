const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const db = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        console.log(`MongoDb Connected Successfully : ${connection.connection.host} `);

    } catch (error) {
        console.log("Erro", error);
    }
}

module.exports = db;