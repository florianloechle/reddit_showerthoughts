export function makeFetchResponse(successfull = true) {
  let redditResolve;
  const redditPromise = new Promise(resolve => {
    redditResolve = resolve;
  });
  return {
    response: Promise.resolve({
      ok: successfull,
      json: () => redditPromise,
    }),
    redditResolve,
  };
}