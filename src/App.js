/** @format */

import React from 'react';
import useShowerthougths from './hooks/useShowerthoughts';
import { Carousel, Slides, Slide, Controls } from './components/carousel';

function App() {
  const { showerthoughts } = useShowerthougths();
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case 'PROGRESS':
        case 'NEXT': {
          return {
            isPlaying: action.type === 'PROGRESS',
            activeSlide: (state.activeSlide + 1) % showerthoughts.length,
          };
        }
        case 'STOP': {
          return {
            ...state,
            isPlaying: false,
          };
        }
        case 'PREV': {
          return {
            isPlaying: false,
            activeSlide: (state.activeSlide - 1 + showerthoughts.length) % showerthoughts.length,
          };
        }
        default: {
          throw new Error(
            `Unhandled action of type ${action.type}. This might be caused by a bug.`
          );
        }
      }
    },
    {
      isPlaying: true,
      activeSlide: 0,
    }
  );

  React.useEffect(() => {
    if (state.isPlaying) {
      const timeout = setTimeout(() => {
        dispatch({ type: 'PROGRESS' });
      }, 8000);
      return () => clearTimeout(timeout);
    }
  }, [state.isPlaying, state.activeSlide]);
  return (
    <div className="App">
      <Carousel>
        <Slides>
          {showerthoughts &&
            showerthoughts.map((thought, index) => (
              <Slide key={index} isCurrentSlide={state.activeSlide === index}>
                <div className="showerthought">
                  <a
                    aria-label="Read the comments for this showerthought on reddit!"
                    href={thought.data.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <h1>"{thought.data.title}"</h1>
                    <div>- {thought.data.author}</div>
                  </a>
                </div>
              </Slide>
            ))}
        </Slides>
        <Controls>
          <button
            aria-label="Previous Slide"
            className="carousel__button"
            onClick={() => dispatch({ type: 'PREV' })}
          >
            Prev
          </button>
          <button
            className="carousel__button"
            onClick={() => dispatch({ type: state.isPlaying ? 'STOP' : 'PROGRESS' })}
            aria-label={state.isPlaying ? 'Stop' : 'Start'}
          >
            {state.isPlaying ? 'STOP' : 'START'}
          </button>
          <button
            aria-label="Next Slide"
            className="carousel__button"
            onClick={() => dispatch({ type: 'NEXT' })}
          >
            Next
          </button>
        </Controls>
      </Carousel>
    </div>
  );
}

export default App;
