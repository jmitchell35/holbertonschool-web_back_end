import signUpUser from './4-user-promise';
import uploadPhoto from './5-photo-reject';

export default function handleProfileSignup(firstName, lastName, fileName) {
  return Promise
    .allSettled([
      signUpUser(firstName, lastName),
      uploadPhoto(fileName),
    ])
    .then(
      (results) => results.map((result) => ({ // results is an arr of results we map into iterable
        status: result.status, // Unifies obj structure for fulfilled and rejected promises
        value: result.status === 'fulfilled' // hence the status check
          ? result.value // fulfilled promise output (status, value pairs)
          : `Error: ${result.reason.message}`, // rejected promise output (status, reason pairs)
      })),
    );
}
