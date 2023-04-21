import fracty from 'fracty';
import { TIMEOUT_SEC } from './config';

export const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const styleNumber = num => (!num ? '' : fracty(num).toString());

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

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`🤖 ${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
// export const getJson = async url => {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`🤖 ${data.message} ${res.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJson = async (url, recipeData) => {
//   try {
//     const postData = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8',
//       },
//       body: JSON.stringify(recipeData),
//     });
//     const res = await Promise.race([postData(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`🤖 ${data.message} ${res.status}`);
//     console.log(data);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
