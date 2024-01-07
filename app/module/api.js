
const baseUrl = "https://api.aladhan.com/v1";

function getPrayerTimeApiUrl(userData) {
    const salatTime    = new Date();
    const currentYear  = salatTime.getFullYear();
    const currentMonth = salatTime.getMonth() + 1;
    const searchParams = new URLSearchParams({
        method: userData.salat_method,
        school: userData.mazhab
    });

    if (userData.hasOwnProperty('city')) {
        searchParams.set("city", userData.city);
        searchParams.set("country", userData.country);
    } else {
        searchParams.set("address", userData.country);
    }

    return `${baseUrl}/calendarByCity/${currentYear}/${currentMonth}?${searchParams.toString()}`;
}

export async function getPrayerTimeData(userData) {
    return fetch(getPrayerTimeApiUrl(userData))
          .then((response) => {
            if (!response.ok) throw new Error('status code  400') 
            return response.json();
          });
}
export async function getPrayerTimeCalculationMethods() {
    const url = `${baseUrl}/methods`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error('status code 400');
             return response.json();
        });
}