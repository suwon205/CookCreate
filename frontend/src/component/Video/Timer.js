import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';


function Timer({ role, size }) {
  const publisher = useSelector((state) => state.video.publisher)
  const timerCheck = useSelector((state) => state.timer.timerCheck)

  const [ curMinutes, setCurMinutes ] = useState(0)
  const [ curSeconds, setCurSeconds ] = useState(0)
  const [ totalSeconds, setTotalSeconds ] = useState(0)

  /* 쿠키 타이머 시작 표시 */
  const [ isRunning, setIsRunning ] = useState(false)

  const [ classRole, setClassRole ] = useState(null)

  // const [ clickInput, setSetTime ] = useState(false)

  console.log("나는야", role)

  useEffect(() => {
    if (role) {
      if (role === 'COOKIEE') {
        setClassRole('cookiee')
      } else {
        setClassRole('cookyer')
      }
    }
  }, [role])

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
    setIsRunning(true)
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

  useEffect(() => {
    if (timerCheck !== null) {
      console.log('start 함수 호출 시도')
      start();
    }
  }, [timerCheck])

  const stop = useCallback(() => {
    setIsRunning(false)
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
    <div className={role === 'COOKYER' ? `${size}-cookyer-timer` : `${size}-cookiee-timer`}>
      <div className={`${size}-video-timer-title`}>
        <p>타이머</p>
      </div>
      <div className={`${size}-video-timer-content-${classRole}`}>
        {role === 'COOKYER' ? (
          <div className={`${size}-video-timer-input`}>
            <input
              className={`${size}-video-timer-input-minutes`}
              type='number'
              min='0'
              max='60'
              value={curMinutes}
              onChange={(e) => {
                setCurMinutes(e.target.value)
              }}
              placeholder='00'
            ></input>
            <span>:</span>
            <input
              className={`${size}-video-timer-input-seconds`}
              type='number'
              min='0'
              max='59'
              value={curSeconds}
              onChange={(e) => {
                setCurSeconds(e.target.value)
              }}
              placeholder='00'
            ></input>
          </div>
        ) : (
          <div className={`${size}-video-timer-time`}>
            <p>{curMinutes < 10 ? `0${curMinutes}` : curMinutes}</p>
            <p>:</p> 
            <p>{curSeconds < 10 ? `0${curSeconds}` : curSeconds}</p>
          </div>
        )}
        {/* 학생들에게 선생님이 설정한 타이머 값을 보냄 */}
        {role === 'COOKYER' ? (
          <button className={`${size}-video-timer-set-btn`} onClick={() => sendTime(publisher)}>설정</button>
        ) : (
          <div>
            {isRunning ? (
              <button className={`${size}-video-timer-set-btn`} onClick={stop}>Stop</button>
            ) : (
              <button className={`${size}-video-timer-set-btn`} onClick={start}>Start</button>
            )}
            {/* <button onClick={reset}>Reset</button> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Timer;