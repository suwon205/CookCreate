import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function EditLesson({ lessonId }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const userName = localStorage.getItem('id');
  const cookyerName = useSelector((state) => state.lessonInfo.cookyerId);
  const lessonDate = useSelector((state) => state.lessonInfo.lessonDate);
  const [dateDisable, setDateDisable] = useState(false);
  const [cookyerDisable, setCookyerDisable] = useState(false);
  const [disableMsg, setDisableMsg] = useState('');

  useEffect(() => {
    const DateTransformType = new Date(lessonDate);
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000); // 현재 시간 + 12시간
    if (futureTime > DateTransformType) {
      setDateDisable(true);
    } else {
      setDateDisable(false);
    }
  }, [lessonDate]);

  useEffect(() => {
    if (userName !== cookyerName) {
      setCookyerDisable(true);
    } else {
      setCookyerDisable(false);
    }
  }, [userName, cookyerName]);

  useEffect(() => {
    if (cookyerDisable || dateDisable) {
      if (cookyerDisable) {
        setDisableMsg('본인이 작성한 강의만 수정할 수 있습니다');
      } else if (dateDisable) {
        setDisableMsg('12시간 이전의 강의는 수정할 수 없습니다');
      } else {
        setDisableMsg('');
      }
    } else {
      setDisableMsg('');
    }
  }, [cookyerDisable, dateDisable]);

  const handleEditClick = () => {
    if (!cookyerDisable && !dateDisable) {
      navigate(`/lesson/edit/${lessonId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    }
  };

  const style = {
    fontSize: '0.9rem',
    color: '#666',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <>
      <div 
        style={{
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '30px'
        }}
      >
      <button
        style={{
          backgroundColor: cookyerDisable || dateDisable ? '#ccc' : (isHovered ? '#FF6060' : '#fd621f'),
          color: '#FFFDFD',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '3px',
          padding: '0.7rem 6.6rem',
          fontWeight: '500',
          border: 'none',
          cursor: cookyerDisable || dateDisable ? 'not-allowed' : 'pointer',
          textDecoration: 'none',
          marginBottom: '0.9rem',
      
        }}
        disabled={cookyerDisable || dateDisable}
        onClick={handleEditClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        수정하기
      </button>
    </div>
    {disableMsg && <div style={style}>{disableMsg}</div>}
    </>
  );
}

export default EditLesson;
