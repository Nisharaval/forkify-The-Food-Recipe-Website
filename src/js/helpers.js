import { async } from 'regenerator-runtime';
import { TIME_OUT } from './config';

// we will have a timer so that if the url is fetched in few seconds it will throw a error
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Unified AJAX function for both GET and POST requests
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIME_OUT)]);

    const data = await res.json();

    if (!res.ok)
      throw new Error(`${res.status} (${res.statusText}) \n ${data.message}`);

    return data;
  } catch (err) {
    throw err; // Propagate the error to be handled in the calling function
  }
};

// GET Method
// export const getJSON = async function (url) {
//   try {
//     // const res = await fetch(`${API_URL}/${id}`);
//     const fetchPro = await fetch(url, {
//       // method: 'GET',
//       // header: {
//       //   'content-Type': 'application/json',
//       // },
//     });
//     const res = await Promise.race([fetchPro, timeout(TIME_OUT)]);

//     // Parse the JSON response body
//     const data = await res.json();

//     // Check if the response is not OK (status code is not in the range of 200-299)
//     if (!res.ok)
//       throw new Error(`${res.status}(${res.statusText}) \n ${data.message}`);
//     // Log the response and the parsed data to the console
//     // console.log(res, data);
//     return data;
//   } catch (err) {
//     // console.log(err);
//     throw err; // to Handle error in model.js
//   }
// };

// POST METhod
// export const sendJSON = async function (url, uploadData) {
//   try {
//     // const res = await fetch(`${API_URL}/${id}`);
//     // const res = await fetch(url, options);

//     // Use fetch to send a POST request to the provided URL
//     const fetchPro = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     // Use Promise.race to race between the fetch request and a timeout function
//     const res = await Promise.race([fetchPro, timeout(TIME_OUT)]);

//     // Parse the JSON response body
//     const data = await res.json();

//     // Check if the response is not OK (status code is not in the range of 200-299)
//     if (!res.ok)
//       throw new Error(`${res.status}(${res.statusText}) \n ${data.message}`);
//     // Log the response and the parsed data to the console
//     // console.log(res, data);
//     return data;
//   } catch (err) {
//     // console.log(err);
//     throw err; // to Handle error in model.js
//   }
// };
