import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../hooks/services/apiUrl";
import {
  postData,
  postRequest,
  updateFormData,
} from "../../../../hooks/services/services";
import { fetchDataAuth } from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import "../../../../../src/common.css";
function MyVerification() {
  const [files, setFiles] = useState({
    government_id: "",
    medical_license: "",
    proof_of_address: "",
    clinic_affiliation: "",
    cv_resume: "",
  });
  const [errors, setErrors] = useState({
    government_id: "",
    medical_license: "",
    proof_of_address: "",
    clinic_affiliation: "",
    cv_resume: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const fetchDocs = async () => {
    try {
      const res = await fetchDataAuth(`doctors/view-document/`);
      const data = await res.json();
      setUserDetails(data); // save fetched data
      console.log();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDocs();
  }, []);

  const handleChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    // Validate type and size
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Only PDF or image files (JPG/PNG) are allowed.",
      }));
      e.target.value = "";
      return;
    }
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB < 500 || fileSizeKB > 2000) {
      setErrors((prev) => ({
        ...prev,
        [name]: "File size must be between 500KB and 2MB.",
      }));
      e.target.value = "";
      return;
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));

    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: file, // update only the current field
    }));

    console.log("File selected:", name, file); // should log a File object
  };

  console.log("files", files);
  console.log("files", files.government_id);
  const onSubmit = async () => {
    let isValid = true;
    const newErrors = {};

    if (!files.government_id) {
      newErrors.government_id = "This field is required.";
      isValid = false;
    }
    if (!files.medical_license) {
      newErrors.medical_license = "This field is required.";
      isValid = false;
    }
    if (!files.proof_of_address) {
      newErrors.proof_of_address = "This field is required.";
      isValid = false;
    }
    if (!files.clinic_affiliation) {
      newErrors.clinic_affiliation = "This field is required.";
      isValid = false;
    }
    if (!files.cv_resume) {
      newErrors.cv_resume = "This field is required.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    // Step 2: Prepare FormData
    const formData = new FormData();
    Object.entries(files).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    console.log("Submitting files:", files);

    try {
      const response = await postData(`doctors/upload-document/`, formData);

      if (!response.ok) {
       showToast("Documents upload rejected", "error");
       // throw new Error("Failed to upload Documents");
      } else {
        setSubmitted(true);
        console.log("formData", formData);
        showToast("Documents uploaded successfully", "success");
        const data = await response.json();
        console.log(data);
        await fetchDocs();
      }
    } catch (error) {
      console.log(error);
     
    }

    setErrors({
      government_id: "",
      medical_license: "",
      proof_of_address: "",
      clinic_affiliation: "",
      cv_resume: "",
    });
    setFiles({
      government_id: "",
      medical_license: "",
      proof_of_address: "",
      clinic_affiliation: "",
      cv_resume: "",
    });

    return isValid;
  };
  return (
    <>
      <div className="rightContent rightsidefull">
        <div className="row h-100">
          <div class="col-md-12">
            <div class="padding-inner border-radius-20 bg-white h-100">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead"> Documents </h3>
              </div>

              <div className="row">
                <div className="col-md-6 flex items-center gap-0">
                  <label
                    htmlFor="government_idF"
                    className="form-label fw-bold"
                  >
                    Upload Government-Issued ID or Passport
                  </label>
                  <input
                    type="file"
                    name="government_id"
                    id=""
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    disabled={userDetails?.data?.length > 0}
                    hidden={userDetails?.data.length > 0}
                  />

                  {userDetails?.data?.length > 0 ? (
                    <>
                      <p>
                        <a
                          href={userDetails?.data[0]?.government_id_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {userDetails?.data[0]?.government_id}
                        </a>
                        <span
                          className={`status-circle ${
                            userDetails?.data?.[0]?.status === "Completed"
                              ? "status-completed"
                              : userDetails?.data?.[0]?.status === "Pending"
                              ? "status-pending"
                              : userDetails?.data?.[0]?.status === "Rejected"
                              ? "status-rejected"
                              : "status-unknown"
                          }`}
                          title={userDetails?.data?.[0]?.status || "No status"}
                        ></span>
                      </p>
                    </>
                  ) : (
                    ""
                  )}

                  <p style={{ color: "red" }}>{errors.government_id}</p>
                </div>

                <div className="col-md-6">
                  <label htmlFor="" className="form-label fw-bold">
                    Upload Medical License
                  </label>
                  <input
                    type="file"
                    name="medical_license"
                    id=""
                    onChange={handleChange}
                    disabled={userDetails?.data?.length > 0}
                    hidden={userDetails?.data.length > 0}
                  />

                  {userDetails?.data?.length > 0 ? (
                    <>
                      <p>
                        <a
                          href={userDetails?.data[0].medical_license_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {userDetails?.data[0].medical_license}
                        </a>

                        <span
                          className={`status-circle ${
                            userDetails?.data?.[0]?.status === "Completed"
                              ? "status-completed"
                              : userDetails?.data?.[0]?.status === "Pending"
                              ? "status-pending"
                              : userDetails?.data?.[0]?.status === "Rejected"
                              ? "status-rejected"
                              : "status-unknown"
                          }`}
                          title={userDetails?.data?.[0]?.status || "No status"}
                        ></span>
                      </p>
                    </>
                  ) : (
                    ""
                  )}

                  <p style={{ color: "red" }}>{errors.medical_license}</p>
                </div>

                <div className="col-md-6 mt-4">
                  <label htmlFor="" className="form-label fw-bold">
                    Upload Address Proof{" "}
                  </label>
                  <input
                    type="file"
                    name="proof_of_address"
                    id=""
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    disabled={userDetails?.data?.length > 0}
                    hidden={userDetails?.data.length > 0}
                  />

                  {userDetails?.data?.length > 0 ? (
                    <>
                      <p>
                        <a
                          href={userDetails?.data[0].proof_of_address_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                          {userDetails?.data[0].proof_of_address}
                        </a>

                        <span
                          className={`status-circle ${
                            userDetails?.data?.[0]?.status === "Completed"
                              ? "status-completed"
                              : userDetails?.data?.[0]?.status === "Pending"
                              ? "status-pending"
                              : userDetails?.data?.[0]?.status === "Rejected"
                              ? "status-rejected"
                              : "status-unknown"
                          }`}
                          title={userDetails?.data?.[0]?.status || "No status"}
                        ></span>
                      </p>
                    </>
                  ) : (
                    ""
                  )}

                  <p style={{ color: "red" }}>{errors.proof_of_address}</p>
                </div>

                <div className="col-md-6 mt-4">
                  <label htmlFor="" className="form-label fw-bold">
                    Upload Confirmation of Clinic Affiliation
                  </label>
                  <input
                    type="file"
                    name="clinic_affiliation"
                    id=""
                    onChange={handleChange}
                    disabled={userDetails?.data?.length > 0}
                    hidden={userDetails?.data.length > 0}
                  />

                  {userDetails?.data?.length > 0 ? (
                    <>
                      <p>
                        <a
                          href={userDetails?.data[0].clinic_affiliation_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                          {userDetails?.data[0].clinic_affiliation}
                        </a>

                        <span
                          className={`status-circle ${
                            userDetails?.data?.[0]?.status === "Completed"
                              ? "status-completed"
                              : userDetails?.data?.[0]?.status === "Pending"
                              ? "status-pending"
                              : userDetails?.data?.[0]?.status === "Rejected"
                              ? "status-rejected"
                              : "status-unknown"
                          }`}
                          title={userDetails?.data?.[0]?.status || "No status"}
                        ></span>
                      </p>
                    </>
                  ) : (
                    ""
                  )}

                  <p style={{ color: "red" }}>{errors.clinic_affiliation}</p>
                </div>

                <div className="col-md-6 flex items-center gap-0 mt-4">
                  <label htmlFor="cv_resume" className="form-label fw-bold">
                    Upload CV/Resume
                  </label>
                  <input
                    type="file"
                    name="cv_resume"
                    id=""
                    onChange={handleChange}
                    disabled={userDetails?.data?.length > 0}
                    hidden={userDetails?.data.length > 0}
                  />

                  {userDetails?.data?.length > 0 ? (
                    <>
                      <p>
                        <a
                          href={userDetails?.data[0].cv_resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                          {userDetails?.data[0].cv_resume}
                        </a>

                        <span
                          className={`status-circle ${
                            userDetails?.data?.[0]?.status === "Completed"
                              ? "status-completed"
                              : userDetails?.data?.[0]?.status === "Pending"
                              ? "status-pending"
                              : userDetails?.data?.[0]?.status === "Rejected"
                              ? "status-rejected"
                              : "status-unknown"
                          }`}
                          title={userDetails?.data?.[0]?.status || "No status"}
                        ></span>
                      </p>
                    </>
                  ) : (
                    ""
                  )}

                  <p style={{ color: "red" }}>{errors.cv_resume}</p>
                </div>
              </div>

              <div className="flex justify-center mt-4 w-full">
                <button
                  type="button"
                  className="blue_btn"
                  onClick={onSubmit}
                  disabled={userDetails?.data?.length > 0}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyVerification;
