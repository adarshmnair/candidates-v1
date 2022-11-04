import dotenv from 'dotenv'
dotenv.config()
import { db } from './Firebase'
import { doc, getDoc } from 'firebase/firestore'
import { async } from '@firebase/util'


export const getCompany = async (companyId) => {
    const companyDetails = doc(db, 'companyDetails', companyId)
    var docSnap = await getDoc(companyDetails)
    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        return docSnap.data()
    }
}


export const getBranchOpenings = async (company) => {
    var response = await fetch(process.env.BRANCHES_URL, { method: 'GET', headers: { 'TOKEN': company['authKey'] } })
    // console.log(response)
    if (response.status != 200) {
        return { err: 'Branches endpoint error!' }
    } else {
        var openings = await response.json()
        // console.log(openings)
        return openings
    }
}


// Auth function incase we request
// export const getAuth = async (company) => {
//     var requestOptions = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'SUB': company['id']
//         },
//         body: JSON.stringify({
//             "user": {
//                 "email": company['email'],
//                 "password": company['password']
//             }
//         })
//     }
//     var res = await fetch(process.env.AUTH_URL, requestOptions)
//         .then(response => response.json())
//         .then(result => {
//             return result['auth_token']
//         })
//         .catch(error => {
//             return { error: error }
//         });
//     // { error: 'Invalid Email or password.' }
//     return res
// }