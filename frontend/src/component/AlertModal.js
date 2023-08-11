import { useNavigate } from "react-router-dom"
import '../style/modal/alertModal.css'

function AlertModal({ content, path }) {
  const navigate = useNavigate()

  const goPage = () => {
    if (path !== null) {
      navigate(path)
    }
  }

  return (
    <div className="alert-modal">
      <p className="alert-content">{ content }</p>
      <button className="alert-button" onClick={goPage}>확인</button>
    </div>
  )
}

export default AlertModal