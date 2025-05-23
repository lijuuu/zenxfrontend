
import React from 'react';
import styled from 'styled-components';

const Loader3 = ({ className }: { className?: string }) => {
  return (
    <StyledWrapper className={className}>
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .spinner {
    width: 44px;
    height: 44px;
    animation: spinner-y0fdc1 2s infinite ease;
    transform-style: preserve-3d;
  }

  .spinner > div {
  background-color: rgba(34, 197, 94, 0.2); /* green-500 with opacity */
  height: 100%;
  position: absolute;
  width: 100%;
  border: 2px solid #22c55e; /* tailwind green-500 */
}


  .spinner div:nth-of-type(1) {
    transform: translateZ(-22px) rotateY(180deg);
  }

  .spinner div:nth-of-type(2) {
    transform: rotateY(-270deg) translateX(50%);
    transform-origin: top right;
  }

  .spinner div:nth-of-type(3) {
    transform: rotateY(270deg) translateX(-50%);
    transform-origin: center left;
  }

  .spinner div:nth-of-type(4) {
    transform: rotateX(90deg) translateY(-50%);
    transform-origin: top center;
  }

  @keyframes spinner-y0fdc1 {
    0% {
      transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
    }

    50% {
      transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
    }

    100% {
      transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
    }
  }
`;

export default Loader3;
