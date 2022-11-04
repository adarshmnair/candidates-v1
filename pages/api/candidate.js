import { db } from '../../components/Firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// API configuration
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' // Set desired value here
        }
    }
}
// Async funtion to add response to DB
const createResponse = async (data) => {
    data['createdAt'] = serverTimestamp();
    try {
        const userResponses = collection(db, 'responses')
        var res = await addDoc(userResponses, data)
        if (res.id) {
            return true //returns true only if doc added.
        } else {
            return false
        }
    } catch (err) {
        return false
    }

}

// Async function to request image compressor and save response.
const compressAndSend = async (final) => {
    var response = await fetch(process.env.RESIZER_URL,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "data": final.candidatePic,
                "imageType": "candidate",//Important param
                "fileType": "base64"//Important param
            })
        })
        .then((res) => {
            if (res.status != 200) {
                return { error: 'Compression endpoint Issue!' }
            } else {
                return res.json()
            }

        })
        .then(async (json) => {
            // console.log(json)
            if (json.hasOwnProperty('error')) {
                return { err: 'Compression endpoint Issue!' }
            } else {
                // Adding the compressed image to response.
                final.candidatePic = json.body
                // Sending response to firestore.
                var fireResponse = await createResponse(final)
                // Error handling for firestore response.
                if (fireResponse) {
                    return { msg: 'Success!' }
                } else {
                    return { err: 'Firestore Issue!' }
                }
            }
        });
    return response

}
// Api handler
const handler = async (req, res) => {
    // Storing post request json in final.
    var final = req.body
    // Checking if header is of content-type json.
    if (req.headers['content-type'].includes('application/json')) {
        res.status(200).json({ msg: 'Success' })
        // Passing response to compress image and save data.
        var finalResponse = await compressAndSend(final);
        if (finalResponse.hasOwnProperty('err')) {
            console.log(finalResponse);
        } else {
            console.log(finalResponse);
            // res.status(200).json({ msg: "Success" });
        }

    } else {
        res.status(415).json({ err: 'Wrong format!' });
    }
}

export default handler
