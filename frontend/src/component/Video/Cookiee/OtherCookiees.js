import React, { useEffect, useState } from 'react';

import '../../../style/video.css'
import { useSelector } from 'react-redux';
import UserVideoComponent from '../UserVideoComponent';

function OtherCookiees() {
  const subscribers = useSelector((state) => state.video.subscribers)
  const [ cookiees, setCookiees ] = useState(null)

  useEffect(() => {
    if (subscribers) {
      // setCookiees(subscribers)
      const newList = subscribers.filter((sub) => {
        return JSON.parse(sub.stream.connection.data).clientData.role === 'COOKIEE'
      })
      setCookiees(newList)
    }
  }, [subscribers])

  return (
    <div className='other-cookiees'>
      {cookiees ? (
        cookiees.map((sub, i) => (
          <div key={i}>
            <UserVideoComponent
              videoStyle='other-cookiees-video'
              streamManager={sub}
            />
          </div>
        ))
      ) : (
        null
        // <img src='../../../assets/noCookiees.png' alt='참가중인 쿠키가 없습니다'/>
      )}
    </div>
  );
}

export default OtherCookiees;