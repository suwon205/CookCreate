import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

function Timer({ role }) {
  const publisher = useSelector((state) => state.video.publisher)

  const [ curMinutes, setCurMinutes ] = useState(0)
  const [ curSeconds, setCurSeconds ] = useState(0)
  const [ totalSeconds, setTotalSeconds ] = useState(0)

  console.log("나는야", role)

  // const role = localStorage.getItem('role')  // 지금은 직접 넣어줬는데 나중엔 이걸로 하기 or props로 해결

  useEffect(() => {
    const total = curMinutes*60 + curSeconds
    setTotalSeconds(total)
    // console.log("시간입력", totalSeconds)
  }, [ curMinutes, curSeconds ])

  const timer = () => {
    const checkMinutes = Math.floor(totalSeconds / 60)
    const minutes = checkMinutes % 60
    const seconds = totalSeconds % 60

    setCurMinutes(minutes)
    setCurSeconds(seconds)
  }

  const intervalRef = useRef(null)
  
  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return
    }
    intervalRef.current = setInterval(() => {
      setTotalSeconds((c) => {
        if (c > 0) {
          return c-1
        } else {
          stop()
          return 0
        }
      })
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return
    }
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const reset = useCallback(() => {
    setTotalSeconds(0)
    stop()
  }, [])

  useEffect(timer, [totalSeconds])

  const sendTime = (streamManager) => {
    const data = {
      minutes: curMinutes, seconds: curSeconds
    }
    streamManager.stream.session.signal({
      data: JSON.stringify(data),
      type: 'timer'
    })
    console.log("쿠커 타이머 설정", data)
  }

  useEffect(() => {
    if (role === 'COOKIEE' && publisher !== undefined) {
      console.log("쿠키 세션에 이벤트 추가", role, publisher)
      publisher.stream.session.on('signal:timer', (e) => {
        const data = JSON.parse(e.data)
        if (data !== undefined) {
          setCurMinutes(data.minutes)
          setCurSeconds(data.seconds)
          console.log(data)
          console.log("쿠커가 보낸 시간", curMinutes, curSeconds)
        }
      })
    }
  }, [publisher])

  return (
    <div className={role === 'COOKYER' ? 'cookyer-timer' : 'cookiee-timer'}>
      <div className='video-timer-title'>
        <p>타이머</p>
      </div>
      <div className='video-timer-content'>
        {role === 'COOKYER' ? (
          <div className='video-timer-input'>
            {/* 60미만으로 적도록 뭐,, 제한 걸기 */}
            <input
              className='video-timer-input-minutes'
              type='number'
              value={curMinutes}
              onChange={(e) => {
                setCurMinutes(e.target.value)
              }}
            ></input>
            <span>:</span>
            <input
              className='video-timer-input-seconds'
              type='number'
              value={curSeconds}
              onChange={(e) => {
                setCurSeconds(e.target.value)
              }}
            ></input>
          </div>
        ) : (
          <h1>
            {curMinutes < 10 ? `0${curMinutes}` : curMinutes}
            :
            {curSeconds < 10 ? `0${curSeconds}` : curSeconds}
          </h1>
        )}
        {/* 학생들에게 선생님이 설정한 타이머 값을 보냄 */}
        {role === 'COOKYER' ? (
          <button className='video-timer-set-btn' onClick={() => sendTime(publisher)}>설정</button>
        ) : (
          <div>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
            <button onClick={reset}>Reset</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Timer;