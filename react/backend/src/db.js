import mongoose from 'mongoose';
const Connection = async (username, password) => {
    const URL = `mongodb+srv://${username}:${password}@connectco.9pbl7.mongodb.net/?retryWrites=true&w=majority&appName=ConnectCo`;
    try{
        await mongoose.connect(URL, {useNewUrlParser: true});
        console.log('Database Connected');
    } catch(error) {
        console.log("Error: ", error);
    }
}
export default Connection;