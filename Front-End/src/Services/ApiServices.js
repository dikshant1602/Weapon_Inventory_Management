
import { EmojiPeople } from "@mui/icons-material";
import axios from "axios";


const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
})


// login api 

export const login = async (roomNoAssigned, password) => {
    try {
        const response = await api.post('/admin/login', {roomNoAssigned, password} );
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}






//for category 





export const  addCategory =  async (category) => {
    try {
        
        const response = await api.post('/weaponCategory/addWeaponCategories',category);
        return response.data.data;

    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}

export const addSubCategory = async (subCategory) => { 
    try {
        const response = await api.post('/weaponCategory/addSubCategories',subCategory);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const getCategories = async () => {
    try {
        const response = await api.get('/weaponCategory/getCategories');
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const getSubCategories = async (category) => {
    try {
        const response = await api.get(`/weaponCategory/getSubCategories/${category}`);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}

//bullet
export const addBullet = async (bulletnames) => {
    try {
        const response = await api.post('/weaponCategory/addBullets',{bulletnames : bulletnames});
        return response.data.data;
    }
    catch (error) {
        console.log(error)  
        throw error;
    }
}


export const getBullets = async () => {
    try {
        const response = await api.get('/weaponCategory/getBullets');
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const addWeaponDetail = async (weapon) => {
    try {
        const response = await api.post(`/weapon/addWeaponDetail`,weapon);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const getWeaponDetailsForTable = async ( category , subCategory) => {
    try {
        const response = await api.get(`/weapon/getWeaponsDetailsforTables//${category}/${subCategory}`);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const getWeaponDetails = async () => {
    try {
        const response = await api.get('/weapon/getWeaponWithDetails');
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const  addWeapanUnits =  async (weapon) => {
    try {
        
        const response = await api.post('/weapon/addWeaponUnits',weapon);
        return response.data.data;  

    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const getWeaponUnits =  async (weapon) => {
    try {
        
        const response = await api.get(`/weapon/getWeaponWithDetailsAdd/${weapon}`);
        return response.data.data;

    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const fetchWepon = async (serialNumber) => {

    try {   

        const response = await api.get(`/weapon/getWeaponDetailsBySerialNumber/${serialNumber}`);
        return response.data.data;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}






// daily record

export const fetchIssuedWeapon = async (serialNumber) => {
    try {

        const response = await api.get(`/issuance/fetchIssuedWeapon/${serialNumber}`);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const addDailyRecord = async (record) => {
    

    try {
        const response = await api.post('/issuance/addDailyIssued',record);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}



export const returnDailyRecords = async (record) => {
    try {
        const response = await api.post('/issuance/returnDailyIssued',record);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}





export const fetchDailyRecords = async () => {

    try {
        const response = await api.get('/issuance/fetchDailyRecord');
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }

}

//First-time weapon-issued



export const addWeaponIssued = async (record) => {
    try {
        const response = await api.post('/issuance/addIssuedRecord',record);
        return response.data.data;
        }
        catch (error) {
            console.log(error)
            throw error;
        }
 }
 
 export const fetchWeaponIssued= async (serialNo) => {

    try {
        const response = await api.get(`/issuance/fetchWeaponsFirst/${serialNo}`);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }

}

export const fetchCadets= async (armyId) => {

    try {
        const response = await api.get(`/issuance/fetchSoldier/${armyId}`);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }

}
            


export const approveCOJCO = async ( sign , recordIDs , role) => {

    try {
        
        const response = await api.post(`/issuance/approveCOJCO`,{sign , recordIDs , role});
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }

}


export const retundWeapon = async (weaponId) => {

    try {
        const response = await api.post('/issuance/retundWeapon',{weaponId});
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


// Secret key 


export const signVerify = async (role , officerUsername , password) =>  {

    try {
        const response = await api.post(`/admin/verifySign/${role}`,{officerUsername , password});
        return response.data.data;

    }
    catch (error) {
        console.log(error)
        throw error;
    }
}


//damage Weopans

export const fetchDamageRecords = async () => {
    try {
        const response = await api.get('/issuance/fetchDamageWeapon');
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }

    
}


export const approveCOJCODamage = async ( sign , recordIDs , role) => {

    try {
        
        const response = await api.post(`/issuance/approveCOJCODamage`,{sign , recordIDs , role});

    } catch (error) {
        console.log(error);
        throw error;
    }
}



export const reatunInDamage = async (weaponId) => {

    try {
        const response = await api.get(`/issuance/reatunInDamage/${weaponId}`);
        return response.data.data;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}


// one time

export const approveCOJCOOneTime = async ( sign , recordIDs , role) => {

    try {
        
        const response = await api.post(`/issuance/approveCOJCOOneTime`,{sign , recordIDs , role});

    } catch (error) {
        console.log(error);
        throw error;
    }

}


// super admin

export  const fetchRoomIncharge = async () => {
    try {
        const response = await api.get('/admin/getIncharge');
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const changePassword = async (roomNoAssigned , newPassword) => { 

    try {

        const response = await api.post('/admin/changePassword',{roomNoAssigned , newPassword});
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const addIncharge = async (adminName, roomNoAssigned, password) => {
    try {

        const response = await api.post('/admin/registerAdmin',{adminName, roomNoAssigned, password});
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const superLogin = async (roomNoAssigned) => {
    try {

        const response = await api.get(`/admin/superLogin/${roomNoAssigned}`);
        return response.data.data;
    }
    catch (error) {
        console.log(error)      
        throw error;
    }
}




export const getRooms = async () => {
    try {
        const response = await api.get('/admin/getRooms');
        return response.data.data;
    }   
    catch (error) {
        console.log(error)      
        throw error;
    }
}

export const createverification = async (name , forRoom , role ,  password) => {
    try {
        const response = await api.post('/admin/ganrateVerification', {name , forRoom , role ,  password});
        return response.data.data;
    }   
    catch (error) {
        console.log(error)      
        throw error;
    }
}



export const changePasswordSign = async ( forRoom , role ,  password ) => {
    try {
        const response = await api.post('/admin/changePasswordSign', {forRoom , role ,  password });
        return response.data.data;
    }   
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const repleceOfficer = async ( name , forRoom , role ,  password ) => {
    try {
        const response = await api.post('/admin/replaceOfficer', {name , forRoom , role ,  password });
        return response.data.data;
    }   
    catch (error) {
        console.log(error)      
        throw error;
    }
}


export const getDashbord = async () => {
    try {
        const response = await api.get('/admin/getDashbord');
        return response.data.data;
    }   
    catch (error) {
        console.log(error)      
        throw error;
    }
}
