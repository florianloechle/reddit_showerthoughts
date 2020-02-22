/** @format */

import { renderHook, act } from '@testing-library/react-hooks';
import useShowerthougths from '../hooks/useShowerthoughts';
import { makeFetchResponse } from './testUtils';

beforeEach(() => {
  window.fetch = jest.fn();
});
afterEach(() => {
  window.fetch.mockRestore();
});

describe('useShowerthougths Hook', () => {
  const REDDIT_DATA = { data: { children: Array.from({ length: 20 }).fill(0) } };
  const DEFAULT_REDDIT_URL = 'https://www.reddit.com/r/showerthoughts.json?limit=20';

  it('returns an objects containing an array of thoughts and a function to refetch', async () => {
    const { redditResolve, response } = makeFetchResponse();
    window.fetch.mockReturnValue(response);
    const { result } = renderHook(() => useShowerthougths());
    await act(async () => {
      await redditResolve(REDDIT_DATA);
    });
    expect(typeof result.current).toBe('object');
    expect(result.current).toHaveProperty('showerthoughts');
    expect(result.current).toHaveProperty('reload');
    expect(result.current.showerthoughts).toMatchObject(
      REDDIT_DATA.data.children.slice(2, REDDIT_DATA.data.children.length)
    );
    expect(typeof result.current.reload).toBe('function');
  });
  it('makes a fetch request to the showerthoughts subbreddit api', async () => {
    const { redditResolve, response } = makeFetchResponse();
    window.fetch.mockReturnValue(response);
    renderHook(() => useShowerthougths());
    await act(async () => {
      await redditResolve(REDDIT_DATA);
    });
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch.mock.calls[0][0]).toEqual(DEFAULT_REDDIT_URL);
  });
  it('accepts a limit argument to limit the amount of fetched posts', async () => {
    const { redditResolve, response } = makeFetchResponse();
    window.fetch.mockReturnValue(response);
    renderHook(() => useShowerthougths(25));
    await act(async () => {
      redditResolve(REDDIT_DATA);
    });
    expect(window.fetch.mock.calls[0][0]).toEqual(DEFAULT_REDDIT_URL.split('?')[0] + '?limit=25');
  });
  it('refetches the subreddit data when the reload function is called', async () => {
    const { redditResolve, response } = makeFetchResponse();
    window.fetch.mockReturnValue(response);
    const { result } = renderHook(() => useShowerthougths());
    await act(async () => {
      await redditResolve(REDDIT_DATA);
    });
    expect(window.fetch).toHaveBeenCalledTimes(1);
    await act(async () => {
      await result.current.reload();
    });
    expect(window.fetch).toHaveBeenCalledTimes(2);
  });
});
