import fs  from  'fs';
import path from 'path';
const __dirname                = path.resolve();
const userJsonFilePath         = __dirname + '/app/storage/user.json';
const prayerDataFilePath       = __dirname + '/app/storage/prayers-data.json';
const persistenDataFilePath    = __dirname + '/app/storage/persisten-data.json';

export  const storePrayersData = (data) => {
    fs.writeFile(prayerDataFilePath, JSON.stringify(data), (error) => {
        if (error) throw error;
        console.log('Prayer Data written successfully');
    });
};

export const getPrayersData= () => {
    const data = fs.readFileSync(prayerDataFilePath, "utf-8");
    try{
        if (data) {
            const prayersData = JSON.parse(data);
            return prayersData
        }
    } catch(err) {
        console.log(err);
    }
}

export const storeUserData = (userData) => {
    fs.writeFile(userJsonFilePath, JSON.stringify(userData), (error) => {
        if (error) throw error;
        console.log('User Data written successfully');
    });   
}

export const  getUserData =  () => {
    const data = fs.readFileSync(userJsonFilePath, "utf-8");
    try {
        if (data) {
            const userData = JSON.parse(data)
            return userData;
        }
    } catch(e) {
        console.log(e);
    }
}

export const storePersistentPrayerData = (data) => {
    fs.appendFile(persistenDataFilePath, "Hello user data", (error) => {
        if (error) throw error;
        console.log('User Data written successfully');
    }); 
}

export const persistentPrayerData = (data, s = null) => {
    console.log({s});
    fs.writeFile(persistenDataFilePath, JSON.stringify(data), (error) => {
        if (error) {
            console.log('file not open', error);
            return;
        }
        console.log('User Data written successfully');
    })
}

export const getPersistentPrayerData = () => {
    const data = fs.readFileSync(persistenDataFilePath, "utf-8");
    try {
        if (data) {
            const userData = JSON.parse(data)
            return userData;
        }
    } catch(e) {
        console.log(e);
    }
}