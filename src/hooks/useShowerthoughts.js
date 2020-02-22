/** @format */

import React from 'react';

/**
 * Fetches the current post of the Showerthoughts subreddit on
 * reddit.com.
 * @param {Integer} limit -  The limit of posts to fetch
 */
export default function useShowerthougths(limit = 20) {
  const [showerthoughts, setShowerthought] = React.useState(null);

  const fetchShowerThoughts = React.useCallback(
    function fetchShowerThoughts() {
      const supportsFetchAbort =
        window.AbortController && typeof window.AbortController === 'function';
      let options = {
        method: 'GET',
      };
      let abortController = supportsFetchAbort ? new AbortController() : null;
      if (supportsFetchAbort) {
        options.signal = abortController.signal;
      }
      fetch('https://www.reddit.com/r/showerthoughts.json?limit=' + limit, options)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(({ data }) => {
          const thoughtsWithoutPinnedPosts = data.children.slice(2, data.children.length);
          setShowerthought(thoughtsWithoutPinnedPosts);
        });
      return () => abortController && abortController.abort();
    },
    [limit]
  );

  React.useEffect(() => {
    return fetchShowerThoughts();
  }, [fetchShowerThoughts]);

  return { showerthoughts, reload: fetchShowerThoughts };
}
