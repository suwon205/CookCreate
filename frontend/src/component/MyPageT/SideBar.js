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
                <Link to="/accountT">정보수정</Link>
              </div>
              <div className="side-item">
                <Link to="/classlistT">과외목록</Link>
              </div>
              <div className="side-item">
                <Link to="/certificationT">자격증관리</Link>
              </div>
              <div className="side-item">
                <Link to="/reviewT">리뷰목록</Link>
              </div>
              <div className="side-item">
                <Link to="/payrollT">정산내역</Link>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default SideBar;
