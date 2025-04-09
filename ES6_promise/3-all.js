import { createUser, uploadPhoto } from './utils';

export default function handleProfileSignup() {
  return Promise
    .all([uploadPhoto(), createUser()])
    .then(
      ([photo, user]) => {
        console.log(`${photo.body} ${user.firstName} ${user.lastName}`);
      },
    );
}
