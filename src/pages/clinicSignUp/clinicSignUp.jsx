import React, { useState } from "react";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "../../utils/toast";
import { InputField } from "../../components/form/InputField";
import { useNavigate } from "react-router-dom";
import Image from "../../components/form/Image";
import VerifyCode from "../../pages/forgotPassword/verifyCode";
import ClinicSignUpStep2 from "../clinicSignUpStep2/clinicSignUpStep2";
import { postRequest } from "../../hooks/services/services";
import "../signup/signup.css";
import { useTranslation } from "react-i18next";

function ClinicSignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [stateCount, setStateCount] = useState(1);
  const [loading, setLoading] = useState();

  const schema = Yup.object().shape({
    Clinic_Name: Yup.string().required("Field is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Field is required"),
    password: Yup.string()
      .required("Field is required")
      .min(
        8,
        "Use 8 or more characters with a mix of letters, numbers & symbols"
      )
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must contain at least one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Field is required"),
    acceptTerms: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
    acknowledge: Yup.boolean().oneOf(
      [true],
      "You must acknowledge the Patient Bill of Rights and Responsibilities to continue."
    ),
    codeOfConduct: Yup.boolean().oneOf(
      [true],
      "You must agree to respect the Doctor's Code of Conduct and Responsibilities to proceed."
    ),
    MedicalDisciaimer: Yup.boolean().oneOf(
      [true],
      "By continuing, I agree that H2.doctor is a digital health platform..."
    ),
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleBack = (event) => {
    event.preventDefault();
    navigate("/signup");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        email: data?.email,
        password: data?.password,
        first_name: data?.Clinic_Name,
        confirm_password: data.confirmPassword,
        role: "Clinic",
        acknowledge: data.acknowledge,
        code_of_conduct: data.codeOfConduct,
        terms_and_condition: data.acceptTerms,
        medical_disclaimer: data.MedicalDisciaimer,
      };
      const response = await postRequest("auth/signup/", payload);
      if (response?.status === 201) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        setLoading(false);
        setEmail(data?.email);
        setStateCount(2);
      }
    } catch (error) {
      showToast(error.message, "error");
      setLoading(false);
    }
  };

  return (
    <div>
      {stateCount === 1 && (
        <section className="form_part space-cmn">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="signupTab">
                  <div className="formArea border-radius-20 border-gray">
                    <div className="d-flex gap-5 w-100 mt-4 mb-4">
                      <a href="#" className="back" onClick={handleBack}>
                        <Image
                          src="/images/backarrow.png"
                          onClick={handleBack}
                        />{" "}
                        {t("clinic-signup.back")}
                      </a>
                      <h5 className="form-head" style={{ margin: "0 15%" }}>
                        {t("clinic-signup.clinic-registration")}
                      </h5>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row g-4">
                        <div
                          className="image-container"
                          style={{ textAlign: "center", marginBottom: "0px" }}
                        >
                          <img
                            src="/images/login-img/Clinic.svg"
                            alt="Clinic icon"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </div>

                        <div className="col-md-12">
                          <div className="form-group">
                            <label>{t("clinic-signup.clinic-name")}</label>
                            <Controller
                              name="Clinic_Name"
                              control={control}
                              render={({ field }) => (
                                <InputField
                                  type="text"
                                  {...field}
                                  error={errors?.Clinic_Name?.message}
                                />
                              )}
                            />
                          </div>
                          <div className="form-group mt-4">
                            <label>{t("edit-profile.email-address")}</label>
                            <Controller
                              name="email"
                              control={control}
                              render={({ field }) => (
                                <InputField
                                  type="email"
                                  {...field}
                                  error={errors?.email?.message}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>{t("login.password_label")}</label>
                            <Controller
                              name="password"
                              control={control}
                              render={({ field }) => (
                                <InputField
                                  type="password"
                                  {...field}
                                  error={errors?.password?.message}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {t("reset-password.confirm-password")}
                            </label>
                            <Controller
                              name="confirmPassword"
                              control={control}
                              render={({ field }) => (
                                <InputField
                                  type="password"
                                  {...field}
                                  error={errors?.confirmPassword?.message}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <p>{t("reset-password.password-requirements")}</p>
                        <div className="col-md-12">
                          <div className="checkboxtype">
                            <InputField
                              type="checkbox"
                              register={register}
                              name="acceptTerms"
                            />
                            <label>
                              {t("singup.creating_account")}{" "}
                              <a
                                target="_blank"
                                href="https://data.my-health.today/website/en/terms.pdf"
                              >
                                {t("singup.terms_use")}
                              </a>{" "}
                              {t("singup.and_lable")}{" "}
                              <a
                                target="_blank"
                                href="https://data.my-health.today/website/en/privacy-policy.pdf"
                              >
                                {t("singup.Privacy_policy")}
                              </a>
                            </label>
                          </div>
                          {errors?.acceptTerms && (
                            <p className="error-message mt-1">
                              {errors.acceptTerms.message}
                            </p>
                          )}
                        </div>
                        <div className="col-md-12">
                          <div className="checkboxtype">
                            <InputField
                              type="checkbox"
                              register={register}
                              name="acknowledge"
                            />
                            <label>
                              {t("singup.acknowledge")}{" "}
                              <a
                                target="_blank"
                                href={t("singup.patient_rights")}
                              >
                                {t("singup.patient_bill")}{" "}
                              </a>
                              {t("singup.responsitbilities")}
                            </label>
                          </div>
                          {errors?.acknowledge && (
                            <p className="error-message mt-1">
                              {errors.acknowledge.message}
                            </p>
                          )}
                        </div>
                        <div className="col-md-12">
                          <div className="checkboxtype">
                            <InputField
                              type="checkbox"
                              register={register}
                              name="codeOfConduct"
                            />
                            <label>
                              {t("singup.code_Conduct")}{" "}
                              <a target="_blank" href={t("singup.doctor_Link")}>
                                {t("singup.doctor_code")}{" "}
                              </a>
                              {t("singup.Conduct_and")}{" "}
                            </label>
                          </div>
                          {errors?.codeOfConduct && (
                            <p className="error-message mt-1">
                              {errors.codeOfConduct.message}
                            </p>
                          )}
                        </div>
                        <div className="col-md-12">
                          <h5>{t("singup.medical_disclaimer")}</h5>

                          <div className="checkboxtype">
                            <InputField
                              type="checkbox"
                              register={register}
                              name="MedicalDisciaimer"
                            />
                            <label>
                              {t("singup.continuing_professionals")}
                            </label>
                          </div>
                          {errors?.MedicalDisciaimer && (
                            <p className="error-message mt-1">
                              {errors.MedicalDisciaimer.message}
                            </p>
                          )}
                        </div>
                        <div className="col-md-12 mb-5">
                          <button type="submit" className="black_btn">
                            {t("login.create_account")}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {stateCount === 2 && (
        <VerifyCode
          stateCount={stateCount}
          setStateCount={setStateCount}
          email={email}
          type="clinic"
        />
      )}
      {stateCount === 3 && <ClinicSignUpStep2 />}
    </div>
  );
}

export default ClinicSignUp;
