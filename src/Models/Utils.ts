import UserRoles from "../Enums/UserRoles";
import UserState from "../Enums/UserState";

const Utils = {

    getUserState: (state: UserState) => {
        return (state == UserState.ACTIVE) ? "Active" : "Inactive";
    },

    convertSecondsToDate(seconds: number) {
        const date = new Date(seconds * 1000);
        const month = date.getMonth() + 1; // Months are zero-indexed
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const second = date.getSeconds();

        return `${year}-${month}-${day}`;
        //  ${hours}:${minutes}:${second}`;
    },

    convertISOToDate(isoDateString: string) {

        if(!isoDateString || isoDateString == ""){
            return "";
        }
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    },

    checkRole(userRole: string[], rolesToCheck: string[]) {
        return rolesToCheck.every(element => userRole.includes(element));
    },

    isoToDateTimeLocal(isoString: string) {
        const date = new Date(isoString);
    
        // Extract the date and time parts in the correct format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        // Combine to form the desired format for input value
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    },

    dateToSeconds(date: string): (null | number) {
        // return Math.floor(new Date(date).getTime()/1000);
        const timestampInMilliseconds = Date.parse(date);

        if (isNaN(timestampInMilliseconds)) {
            console.error("Invalid date string");
            return null;
        }

        const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);
        return timestampInSeconds;
    },

    dateToISO(dateString: string): (null | string) {

        console.log("date string is ", dateString);

        try{
            const date = new Date(dateString);
            const formattedDate = date.toISOString(); // Generates 'YYYY-MM-DDTHH:mm:ss.SSSZ' format
            return formattedDate;
        }catch(error: any){
            return null;
        }

    },

    getFromArray(id: any, value: any, getId: any, list: any[]): string {
        let found = list.find(ls => (ls[id] == value));

        return found ? found[getId] : "unknown";
    },

    objectToQueryString: function (obj: any) {
        const queryParams = [];

        for (const key in obj) {
            // let vl = obj[key] != "" ? obj[key].split("|") : [];
            //&& obj.hasOwnProperty(key)
            if (obj[key].value != undefined && obj[key].operator != "" && obj[key].value != "" && obj[key].type != "") {
                const value = encodeURIComponent(`${obj[key].value}`);
                // const value = encodeURIComponent(`${obj[key].operator}|${obj[key].type}|${obj[key].value}`);
                queryParams.push(`${key}=${value}`);
            }
        }

        return queryParams.join('&');
    }
    // objectToQueryString: function (obj: any) {
    //     const queryParams = [];

    //     for (const key in obj) {
    //         let vl = obj[key] != "" ? obj[key].split("|") : [];
    //         //&& obj.hasOwnProperty(key)
    //         if (vl.length !< 3 && vl[0] != "" && vl[1] != "" && vl[2] != "") {
    //             const value = encodeURIComponent(obj[key]);
    //             queryParams.push(`${key}=${value}`);
    //         }
    //     }

    //     return queryParams.join('&');
    // }
}

export default Utils;