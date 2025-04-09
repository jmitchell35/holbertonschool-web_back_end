import signUpUser from './4-user-promise';
import uploadPhoto from './5-photo-reject';

export default function handleProfileSignup(firstName, lastName, fileName) {
  return Promise
    .allSettled([
      uploadPhoto(fileName),
      signUpUser(firstName, lastName),
    ])
    .then(
      (results) => results.map((result) => ({ // results is an arr of results we map into iterable
        status: result.status, // Unifies obj structure for fulfilled and rejected promises
        value: result.status === 'fulfilled' ? result.value : result.reason, // from above
      })),
    );
}
