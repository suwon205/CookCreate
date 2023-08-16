import {  Link } from "react-router-dom";
import "../../style/sidebar.css";



function SideBar() {
  return (
    <div>
      <nav className="Side">
        <div className="Side_container">
          <div className="sidebar" id="sidebarNav">
            <ul className="sidebar_items">
              <div className="side-item">
                <Link to="/account">정보수정</Link>
              </div>
              <div className="side-item">
                <Link to="/payment">결제내역</Link>
              </div>
              <div className="side-item">
                <Link to="/classList">과외목록</Link>
              </div>
              <div className="side-item">
                <Link to="/review">리뷰목록</Link>
              </div>
              <div className="side-item">
                <Link to="/recipeBook">레시피북</Link>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default SideBar;
