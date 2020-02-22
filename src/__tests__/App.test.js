/** @format */

import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import useShowerthoughts from '../hooks/useShowerthoughts';

jest.mock('../hooks/useShowerthoughts');

const mockShowerThoughts = [
  { data: { title: 'testTitle1', url: 'testUrl1', author: 'testAuthor1' } },
  { data: { title: 'testTitle2', url: 'testUrl2', author: 'testAuthor2' } },
  { data: { title: 'testTitle3', url: 'testUrl3', author: 'testAuthor3' } },
]
beforeAll(() => {
  useShowerthoughts.mockReturnValue({
    showerthoughts: mockShowerThoughts,
  });
});

describe('App', () => {
  it('renders a carousel', () => {
    const utils = render(<App />);
    expect(utils.container.querySelector('.carousel')).toBeDefined();
    expect(utils.container.querySelector('.carousel__slides')).toBeDefined();
    expect(utils.container.querySelector('.carousel__controls')).toBeDefined();
  });

  it('renders carousel slides for all showerthoughts', () => {
    const utils = render(<App />);
    const slides = utils.getAllByLabelText(/reddit/i);
    expect(slides.length).toEqual(mockShowerThoughts.length);
  });

  it('renders title and author inside an a tag that links to the original on reddit', () => {
    const utils = render(<App />);
    const slides = utils.getAllByLabelText(/reddit/i);
    utils.getByText(new RegExp(mockShowerThoughts[0].data.title, 'i'));
    utils.getByText(new RegExp(mockShowerThoughts[0].data.author, 'i'));
    expect(slides[0].tagName).toBe('A');
    expect(slides[0].getAttribute('href')).toEqual(mockShowerThoughts[0].data.url);
  });

});
