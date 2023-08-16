import React, { useEffect } from 'react';
import axios from 'axios';
import EditLessonInfoTop from '../component/EditLesson/EditLessonInfoTop';
import EditLessonTime from '../component/EditLesson/EditLessonTime';
import EditLessonDetail from '../component/EditLesson/EditLessonDetail';
import EditLessonStep from '../component/EditLesson/EditLessonStep';
import EditForm from '../component/EditLesson/EditForm';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setLessonTitle, setCategory, setTimeTaken, setDateTime, setPrice, setMaximum, 
  setDifficulty, setDescription, setMaterials, setLessonStepList, setVideoUrl,setThumbnailUrl  
  } from '../store/lesson/lessonEdit';
import '../style/lesson/lessonEdit.css'
function EditLesson() {
  const dispatch = useDispatch()
  const lessonId = useSelector((state) => state.lessonInfo.lessonId)
  const access_token = localStorage.getItem('access_token')
  useEffect(() => { 
    axios.get(`/api/v1/lesson/${lessonId}`, {
      headers : {
        Access_Token : access_token
      }
    })
    .then((res) => {
      dispatch(setLessonTitle(res.data.lessonTitle))
      dispatch(setCategory(res.data.categoryId))
      dispatch(setTimeTaken(res.data.timeTaken))
      dispatch(setDateTime(res.data.lessonDate))
      dispatch(setPrice(res.data.price))
      dispatch(setMaximum(res.data.maximum))
      dispatch(setDifficulty(res.data.difficulty))
      dispatch(setDescription(res.data.description))
      dispatch(setMaterials(res.data.materials))
      dispatch(setLessonStepList(res.data.lessonStepList))
      dispatch(setVideoUrl(res.data.videoUrl))
      dispatch(setThumbnailUrl(res.data.thumbnailUrl))
    })
    .catch((err) => {
      console.error(err);
    });
  }, [lessonId]);

  return (
    <div>
      <div className='editLessonTitle'>
        과외 수정하기
      </div>
      <EditLessonInfoTop/>
      <EditLessonTime />
      <EditLessonDetail />
      <EditLessonStep />
      <br />
      <EditForm />
    </div>
  );
}

export default EditLesson;
