// import React from "react";
// import { FaStar, FaStarHalf } from "react-icons/fa";
// import styled from "@emotion/styled";

// const StyledStarShow = styled.div`
//   display: flex;
//   align-items: center;
//   font-size: ${({ size }) => size || "1rem"};
//   color: ${({ color }) => color || "black"};
// `;

// const StarShow = ({ rating, size, color }) => {
//   const MAX_RATING = 5;
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 !== 0;

//   const stars = [];
//   for (let i = 0; i < fullStars; i++) {
//     stars.push(<FaStar key={i} />);
//   }

//   if (hasHalfStar) {
//     stars.push(<FaStarHalf key={fullStars} />);
//   }

//   while (stars.length < MAX_RATING) {
//     stars.push(<FaStar key={stars.length} />);
//   }

//   return (
//     <StyledStarShow size={size} color={color}>
//       {stars.map((star, index) => (
//         <React.Fragment key={index}>{star}</React.Fragment>
//       ))}
//     </StyledStarShow>
//   );
// };

// export default StarShow;


import React from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";
import styled from "@emotion/styled";

const StyledStarShow = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ size }) => size || "1rem"};
  color: ${({ color }) => color || "black"};
`;

const StarShow = ({ rating, size, color }) => {
  const MAX_RATING = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={i} />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalf key={fullStars} />);
  }

  return (
    <StyledStarShow size={size} color={color}>
      {stars.map((star, index) => (
        <React.Fragment key={index}>{star}</React.Fragment>
      ))}
    </StyledStarShow>
  );
};

export default StarShow;



