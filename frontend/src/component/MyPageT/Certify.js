import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import axios from "axios";
import "../../style/certify.css"; // 스타일 파일을 임포트합니다.
function Certify() {
  const accessToken = localStorage.getItem('access_token');
  const [certificates, setCertificates] = useState([]);
  const [capture, setCapture] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [capturePreview, setCapturePreview] = useState(null);

  const handleCaptureChange = (e) => {
    const selectedFile = e.target.files[0];
    setCapture(selectedFile);

    if (selectedFile) {
      setCapturePreview(URL.createObjectURL(selectedFile));
    } else {
      setCapturePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!capture) {
      alert("자격증 파일을 선택해주세요");
      return;
    }
    const formData = new FormData();
    formData.append("capture", capture);

    setLoading(true);

    axios
      .post("/api/v1/my/badge", formData, {
        headers: {
          Access_Token: accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setLoading(false);
        setSuccess(true);
        setCapturePreview(null);
        console.log(res);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error, "자격증 업로드 불가");
      });
  };

  useEffect(() => {
    axios
      .get(`api/v1/my/badge`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        setCertificates(res.data);
      })
      .catch((err) => {
        console.log("자격증 조회 못함", err);
      });
  }, [success, certificates]);

  return (
    <div>
      <SideBar />
      <div>
        <div className="my-title-wrap">
          <h3 className="my-title">자격증 관리</h3>
        </div>
        <h3 className="my-subtitle">자격증 등록</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>자격증 파일:</label>
            <input type="file" onChange={handleCaptureChange} required />
          </div>
          {capturePreview && (
            <div>
              <p>선택한 이미지 썸네일:</p>
              <img
                src={capturePreview}
                alt="썸네일"
                style={{ maxWidth: "200px" }}
              />
            </div>
          )}
          <button className="my-btn" type="submit" disabled={loading}>
            등록하기
          </button>
          {loading ? " 등록 중 입니다..." : ""}
          {success && <p>자격증 등록이 완료되었습니다!</p>}
        </form>
      </div>
      <div>
        <h3 className="my-subtitle">자격증 목록</h3>
        <div>
          {certificates.map((certificate) => (
            <div key={certificate.badgeId}>
              <div>
                <p>자격증 No. {certificate.badgeId}</p>
              </div>
              <img
                src={certificate.capture}
                alt={`자격증 ID: ${certificate.badgeId}`}
                style={{ maxWidth: "200px" }}
              />
              <div style={{display : 'flex'}}>
                <div>
                  승인 상태
                </div>
                <div>
                  {certificate.certificated === "DEFAULT" ? "신청" : certificate.certificated === "ACCESS" ? "승인" : "거부"}
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Certify;
