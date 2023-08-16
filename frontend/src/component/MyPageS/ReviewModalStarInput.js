// StarInput.js
import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { FaStar, FaStarHalf } from "react-icons/fa";

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  cursor: pointer;
  font-size: 35px                 ;
  color: lightgray;

  ${({ isHalf }) =>
    isHalf &&
    css`
      position: absolute;
      width: 35px;
      overflow: hidden;

      &:nth-of-type(10) {
        transform: translate(-140px);
      }
      &:nth-of-type(8) {
        transform: translate(-105px);
      } 
      &:nth-of-type(6) {
        transform: translate(-70px);
      }
      &:nth-of-type(4) {
        transform: translate(-35px);
      }
      &:nth-of-type(2) {
        transform: translate(0px);
      }
    `}
`;

const ReviewModalStarInput = ({ onClickRating, value, isHalf }) => {
  const handleClickRatingInput = () => {
    onClickRating(value);
  };

  return (
    <>
      <Input
        type="radio"
        name="rating"
        id={`star${value}`}
        value={value}
        onClick={handleClickRatingInput}
      />
      <Label isHalf={isHalf} htmlFor={`star${value}`}>
        {isHalf ? <FaStarHalf /> : <FaStar />}
      </Label>
    </>
  );
};

export default ReviewModalStarInput;
