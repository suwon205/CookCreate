import React, { useState, useEffect } from "react";
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
import SideBar from "./SideBar";
import axios from "axios";

function Certify() {
  // const accessToken = useSelector((state) => state.auth.access_token);
  const accessToken = localStorage.getItem('access_token')
  const [certificates, setCertificates] = useState([])
  const [capture, setCapture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // const [certificatePreview, setCertificatePreview] = useState(null);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setCapture(file);


  // 파일등록
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!capture) {
      alert("자격증 파일을 선택해주세요");
      return;
    }

    const formData = new FormData();
    formData.append("capture", capture);
    console.log("파일", capture);
    console.log("캡쳐", formData.get("capture"));

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
        console.log(res);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error, "자격증업로드불가");
      });
  };
  
  
  
    //자격증 조회

  useEffect(() => {
    axios
      .get(`api/v1/my/badge`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log(res.data);
        setCertificates(res.data);
        console.log("자격증목록", certificates);
      })
      .catch((err) => {
        console.log("자격증 조회못함");
      });
  }, [capture,accessToken]);



  return (
    <div>
      <SideBar />
      <div>
        <h2>자격증 등록</h2>
        <form onSubmit={handleSubmit}>
          <div>
            {/* {certificatePreview && <img src={certificatePreview} alt="자격증 프리뷰" style={{ maxWidth: "200px" }} />} */}
            <label>자격증 파일:</label>
            <input type="file" onChange={(e) => setCapture(e.target.files[0])} required />
          </div>
          <button type="submit" disabled={loading}>
            등록하기
          </button>
          {loading ? " 등록 중 입니다..." : ""}
          {success && <p>자격증 등록이 완료되었습니다!</p>}
        </form>
      </div>
      <div>
        <h2>자격증 목록</h2>
        <div>
        {certificates.map((certificate) => (
        <div key={certificate.badgeId}>
          <img src={certificate.capture} alt={`자격증 ID: ${certificate.badgeId}`} style={{ maxWidth: "200px" }} />
          <p>자격증 ID: {certificate.badgeId}</p>
          <p>상태: {certificate.certificated}</p>
          <p>등록일: {certificate.createdDate}</p>
          <hr />
        </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default Certify;









// import React, { useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import SideBar from "./SideBar";
// import axios from "axios";

// function Certify() {
//   const accessToken = useSelector((state) => state.auth.access_token);
//   console.log(accessToken);
//   const [capture, setCapture] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const fileInputRef = useRef(null); // 추가: 파일 입력 참조

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setCapture(file);


//     // 파일 프리뷰 설정
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setCertificatePreview(reader.result);
//     };
//     if (file) {
//       reader.readAsDataURL(file);
//     } else {
//       setCertificatePreview(null);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!capture) {
//       alert("자격증 파일을 선택해주세요");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("capture", capture);

//     setLoading(true);

//     axios
//       .post("/api/v1/my/badge", formData, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((res) => {
//         setLoading(false);
//         setSuccess(true);
//         console.log(res);
//         fileInputRef.current.value = ""; // 추가: 성공적으로 제출 후 파일 입력 초기화
//       })
//       .catch((error) => {
//         setLoading(false);
//         console.log(error, "자격증 업로드 불가");
//       });
//   };

//   const [certificatePreview, setCertificatePreview] = useState(null);

//   return (
//     <div>
//       <SideBar />
//       <div>
//         <h2>자격증 등록</h2>
//         <form onSubmit={handleSubmit}>
//           <div>
//             {certificatePreview && <img src={certificatePreview} alt="자격증 프리뷰" style={{ maxWidth: "200px" }} />}
//             <label>자격증 파일:</label>
//             <input ref={fileInputRef} type="file" onChange={handleFileChange} required />
//           </div>
//           <button type="submit" disabled={loading}>
//             등록하기
//           </button>
//           {loading ? " 등록 중 입니다..." : ""}
//           {success && <p>자격증 등록이 완료되었습니다!</p>}
//         </form>
//       </div>
//       <div>
//         <h2>자격증 목록</h2>
//         <div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Certify;
