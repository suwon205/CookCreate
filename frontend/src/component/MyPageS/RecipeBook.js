import React, {useState, useEffect} from "react";
import "../../style/mypage/cookieeRecipeBook.css";
import SideBar from "./SideBar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import RecipeBookModal from "./RecipeBookModal";
import { useNavigate } from "react-router";
import { setLessonId } from "../../store/lesson/lessonInfo";

function RecipeBook() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const accessToken = useSelector((state) => state.auth.access_token);
  // console.log(accessToken);
  const [ recipeBookData, setRecipeBookData ] = useState(null);
  const [ showRecipe, setShowRecipe ] = useState(false)
  const [ recipeModalData, setRecipeModalData ] = useState(null)

  /** 이동할 과외 아이디 */
  const [ goLessonDetail, setGoLessonDetail ] = useState(false)
  const lessonId = useSelector((state) => state.lessonInfo.lessonId)

  useEffect(() => {
    axios
      .get(`api/v1/my/recipe`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log("레시피북", res.data[0].message === "신청한 과외가 없습니다.");
        if (res.data[0].message !== "신청한 과외가 없습니다.") {
          setRecipeBookData(res.data);
        } else {
          setRecipeBookData(null)
        }
      })
      .catch((err) => {
        console.log("레시피북 정보 못가져옴", err);
      });
  }, []);

  const handleShowRecipe = ( data ) => {
    setShowRecipe(data.showRecipe)
    setRecipeModalData(data.recipe) 
  }

  const goLesson = (lessonId) => {
    setGoLessonDetail(true)
    dispatch(setLessonId(lessonId))
    navigate(`/lesson/${lessonId}`)
  }

  useEffect(() => {
    if (goLessonDetail && lessonId !== null) {
      navigate(`/lesson/${lessonId}`)
    }
  }, [lessonId])

  return (
    <div className="recipe-book-container">
      <SideBar />
      <div className="recipe-book-page-title-wrapper">
        <p className="recipe-book-page-title">레시피북</p>
        <div className="recipe-book-desc">
          <p>레시피북을 클릭하면 요리 진행단계를 볼 수 있습니다.</p>
          <p>과외가 끝난 후에도 요리를 즐겨보세요!</p>
        </div>
      </div>

      <div className="recipe-books">
        {recipeBookData !== null ? (
          recipeBookData.map((recipe) => (
            <div className="recipe-book-background">
              <div className="recipe-book" key={recipe.lessonId} onClick={() => handleShowRecipe({showRecipe: true, recipe: recipe.lessonStepList})}>
                <div className="recipe_content">
                  <div className="recipe_view">
                    <div className="recipe-book-img">
                      <img src={recipe.thumbnailUrl} alt="레시피 미리보기 사진"></img>
                    </div>
                    <div>
                      {/* <div  onClick={() => goLesson(recipe.lessonId)}>
                      </div> */}
                      <div className="recipe-book-title-wrapper">
                        <div className="recipe-book-title">
                          <p>{recipe.lessonTitle}</p>
                        </div>
                        {/* <div>
                          <p>
                            카테고리: 
                            {(() => {
                              switch (recipe.categoryId) {
                                case 0:
                                  return "한식";
                                case 1:
                                  return "양식";
                                case 2:
                                  return "중식";
                                case 3:
                                  return "일식";
                                case 4:
                                  return "아시안";
                                case 5:
                                  return "건강식";
                                case 6:
                                  return "디저트";
                                default:
                                  return "알 수 없음";
                              }
                            })()}
                          </p>
                        </div> */}
                        <div className="recipe-book-info">
                          <p>{new Date(recipe.lessonDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                          <p className="recipe-book-info-division">|</p>
                          <p>{recipe.cookyerName}</p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>  
              </div>
            </div>
          ))
        ) : (
          <p>레시피북이 없습니다.</p>
        )}

        {showRecipe ? (
          <RecipeBookModal
            lessonStepList={recipeModalData}
            handleShowRecipe={handleShowRecipe}
          />
        ) : null}
      </div>
    </div>
  );
}

export default RecipeBook;
