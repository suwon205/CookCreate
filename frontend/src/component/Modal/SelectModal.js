import { useNavigate } from "react-router-dom";
import '../../style/modal/alertModal.css';

function SelectModal({ content, path, actions }) {
  const navigate = useNavigate();

  const goAction = (data) => {
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
        <div className='alert-button-container'>
          <button className="alert-button" onClick={() => goAction(true)}>예</button>
          <button className="alert-cancel-button" onClick={() => goAction(false)}>아니오</button>
        </div>
      </div>
    </div>
  );
}

export default SelectModal;