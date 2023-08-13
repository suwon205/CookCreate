import { useNavigate } from "react-router-dom";
import '../../style/modal/alertModal.css';

function AlertModal({ content, path, actions, data }) {
  const navigate = useNavigate();

  const goPage = () => {
    if (path === null) {
      actions(data)
    } else {
      navigate(path)
    }
  }

  return (
    <div className="alert-modal">
      <div className="alert-content-container">
        <p className="alert-content">{content}</p>
        <button className="alert-button" onClick={goPage}>확인</button>
      </div>
    </div>
  );
}

export default AlertModal;