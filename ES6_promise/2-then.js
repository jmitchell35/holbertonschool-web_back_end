export default function handleResponseFromAPI(promise) {
  return promise.then(
    () => { // on resolve. Empty () because the 'result' is not used below
      console.log('Got a response from the API');
      return {
        status: 200,
        body: 'success',
      };
    },
    () => { // on reject. Empty () because the 'error' is not used below
      console.log('Got a response from the API');
      return new Error();
    },
  );
}
