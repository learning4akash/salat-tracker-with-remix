
export  const storePrayersData = (data) => {
    return localStorage.setItem("prayer", JSON.stringify(data)); 
};

export const getPrayersData = () => {
    return JSON.parse(localStorage.getItem("prayer"));
}

export const storeUserData = (userData) => {
    return localStorage.setItem("user", JSON.stringify(userData)); 
}

export const getUserData = () => {
    return  JSON.parse(localStorage.getItem("user"));
}

export const storePersistentPrayerData = (data) => {
    return localStorage.setItem("persistent_prayer", JSON.stringify(data));
}

export const getPersistentPrayerData = () => {
    return  JSON.parse(localStorage.getItem("persistent_prayer"));
}