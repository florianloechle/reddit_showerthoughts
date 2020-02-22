/** @format */

import React from 'react';

function Carousel(props) {
  return <div className="carousel" {...props} />;
}

function Slides(props) {
  return <ul className="carousel__slides">{props.children}</ul>;
}

function Controls(props) {
  return <div className="carousel__controls">{props.children}</div>;
}

const Slide = React.memo(function Slide({ children, focus, isCurrentSlide }) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (isCurrentSlide && focus) {
      ref.current.focus();
    }
  });
  return (
    <li ref={ref} aria-hidden={!isCurrentSlide} tabIndex="-1" className="carousel__slide">
      {children}
    </li>
  );
})

Carousel.Slides = Slides;
Carousel.Slide = Slide;
Carousel.Controls = Controls;

export default Carousel;
export { Carousel, Slides, Slide, Controls };
