import React, { useState } from "react";
import { InputField } from "../../../components/form/InputField";
import { showToast } from "../../../utils/toast";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { postData, postRequest } from "../../../hooks/services/services";
import { Modal } from "react-bootstrap";
import ResetPasswordPop from "./resetPasswordPop";
import { useTranslation } from "react-i18next";


const ResetPassword = () => {
  const{t} = useTranslation("reset-password");
  const auth = useSelector((state) => state.auth);
  const [modelOpen, setModelOpen] = useState(false);
  // State for form values and errors
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
      setErrors({
      ...errors,[name]:""
    });
  };


const handleResetPassword = async (e) => {
  e.preventDefault();

  const schema = Yup.object().shape({
    currentPassword: Yup.string().required("Field is required"),
    newPassword: Yup.string()
      .required("Field is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Must contain at least one uppercase, one lowercase, one number, and one special character"
      )
      .notOneOf(
        [Yup.ref("currentPassword")],
        "New password must be different from current password"
      ),
    confirmPassword: Yup.string()
      .required("Field is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  try {
    await schema.validate(formData, { abortEarly: false });
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const payload = {
      old_password: formData.currentPassword,
      new_password: formData.newPassword,
    };

    const response = await postData("auth/change-password/", payload);

    if (response?.status === 200) {
      let responseData = await response.json();
      setModelOpen(true);
      showToast(responseData?.message, "success");
    }
  } 
  catch (err) {
    if (err.inner) {
      // Collect field-specific errors
      const newErrors = {};
      err.inner.forEach((validationError) => {
        newErrors[validationError.path] = validationError.message;
        showToast(validationError.message, "error"); 
      });
      setErrors(newErrors);
    } else {
      showToast(err.message, "error"); 
    }
  }
};

  return (
    <div className="col-md-6">
      <p className="mb-4">{t("reset-password.reset-password")}: </p>

      <div className="d-flex align-items-center gap-4 mt-3">
        <div className="form-group w-100">
          <label>{t("reset-password.current-password")}</label>
          <InputField
            type="password"
            placeholder=""
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            error={errors?.currentPassword}
          />
        </div>
      </div>

      <div className="d-flex gap-4 mt-3">
        <div className="form-group w-50">
          <label>{t("reset-password.new-password")}</label>
          <InputField
            type="password"
            placeholder=""
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            error={errors?.newPassword}
          />
        </div>
        <div className="form-group">
          <label>{t("reset-password.confirm-password")}</label>
          <InputField
            type="password"
            placeholder=""
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
          />
        </div>
      </div>

      <p className="mt-1">{t("reset-password.password-requirements")}</p>

      <button className="blue_btn" onClick={handleResetPassword}>
        {t("reset-password.change-password-btn")}
      </button>
      <ResetPasswordPop
        modelOpen={modelOpen}
        setModelOpen={setModelOpen}
        Modal={Modal}
      />
    </div>
  );
};

export default ResetPassword;
