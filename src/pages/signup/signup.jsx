import React, { useState } from "react";
import { InputField } from "../../components/form/InputField";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./signup.css";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../../hooks/services/services";
import Header from "../../components/ui/header/header";
import Image from "../../components/form/Image";
import { useTranslation } from "react-i18next";
import LoginWithGoogle from "../../SSOLogin/loginWithGoogle";
import VerifyCode from "../../pages/forgotPassword/verifyCode";
import DoctorProfileStep1 from "../../pages/signup/doctorProfile/doctorProfileStep1";
import DoctorProfileStep2 from "../../pages/signup/doctorProfile/doctorProfileStep2";
import InvitationCode from "../../pages/signup/doctorProfile/invitationCode";
import PatientProfile from "../patient/patientProfileStep";
import LoadingButton from "../../components/ui/loader/LoadingButton";
import LoginWithApple from "../../SSOLogin/loginWithApple";
import { loginSuccess } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("login");
  const [stateCount, setStateCount] = useState(1);
  const [email, setEmail] = useState();
  const [role, setRole] = useState("Doctor");
  const schema = Yup.object().shape({
    firstName: Yup.string().required("Field is required"),
    lastName: Yup.string().required("Field is required"),
    healthEmail: Yup.string()
      .email("Invalid email format")
      .required("Field is required"),
    healthPassword: Yup.string()
      .required("Field is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("healthPassword"), null], "Passwords must match")
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

  const images = {
    Patient: "/images/login-img/Patient-1.svg",
    Doctor: "/images/login-img/Doctors-1.svg",
  };

  // assign the default values to the fields
  const getDefaultValues = () => {
    return {
      member: "Doctor",
    };
  };

  // Initialize React Hook Form with the Yup resolver
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(),
  });

  const goToClinic = () => {
    navigate("/clinic-signup");
  };
  const formValues = getValues();
  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.healthEmail,
        password: data.healthPassword,
        confirm_password: data.confirmPassword,
        role: data.member,
        medical_disclaimer: data.MedicalDisciaimer,
        acknowledge: data.acknowledge,
        code_of_conduct: data.codeOfConduct,
        terms_and_condition: data.acceptTerms,
      };

      const response = await postRequest("auth/signup/", payload); // Call the API service
      if (response?.status === 201) {
        setLoading(false);
        let responseData = await response.json();
        dispatch(
          loginSuccess(
            responseData?.user?.role,
            responseData?.tokens?.access,
            responseData?.tokens?.refresh
          )
        );
        showToast(responseData?.message, "success");
        setEmail(data.healthEmail);
        setStateCount(2);
      }
    } catch (error) {
      setLoading(false);
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <Header />
      <>
        {stateCount === 1 && (
          <>
            <section className="form_part d-flex align-items-center py-2">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="signupTab">
                      <div className="tabPrt">
                        <ul>
                          <li>
                            <a onClick={() => navigate("/login")}>
                              {t("login.login")}
                            </a>
                          </li>
                          <li>
                            <a
                              className="active"
                              onClick={() => navigate("/signup")}
                            >
                              {t("login.create_account")}
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="formArea signupmain">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="row g-3">
                            <div
                              className="image-container"
                              style={{
                                textAlign: "center",
                                marginBottom: "20px",
                              }}
                            >
                              {(role === "Patient" || role === "Doctor") && (
                                <img
                                  src={images[role]}
                                  alt={`${role} icon`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                              )}
                            </div>

                            <div className="toggle-switch-container">
                              <div className="col-md-6 col-6">
                                <div
                                  className={`switch-option radio-btn ${
                                    role === "Patient" ? "active" : ""
                                  }`}
                                >
                                  <Controller
                                    name="member"
                                    control={control}
                                    defaultValue="Patient"
                                    render={({ field }) => (
                                      <input
                                        id="Patient"
                                        type="radio"
                                        value="Patient"
                                        checked={field.value === "Patient"}
                                        onChange={(e) => {
                                          field.onChange(e.target.value);
                                          setRole(e.target.value);
                                        }}
                                      />
                                    )}
                                  />
                                  <label htmlFor="Patient">
                                    {t("login.for_member")}
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-6">
                                <div
                                  className={`switch-option radio-btn ${
                                    role === "Doctor" ? "active" : ""
                                  }`}
                                >
                                  <Controller
                                    name="member"
                                    control={control}
                                    render={({ field }) => (
                                      <input
                                        id="Doctor"
                                        type="radio"
                                        value="Doctor"
                                        checked={field.value === "Doctor"}
                                        onChange={(e) => {
                                          field.onChange(e.target.value);
                                          setRole(e.target.value);
                                        }}
                                      />
                                    )}
                                  />
                                  <label htmlFor="Doctor">
                                    {t("login.for_specialist")}
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group">
                                <label>{t("singup.first_name")}</label>
                                <InputField
                                  type="text"
                                  register={register}
                                  name="firstName"
                                  error={errors?.firstName?.message}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>{t("singup.Last_name")}</label>
                                <InputField
                                  type="text"
                                  register={register}
                                  name="lastName"
                                  error={errors?.lastName?.message}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>{t("login.email_label")}</label>
                                <InputField
                                  type="email"
                                  register={register}
                                  name="healthEmail"
                                  error={errors?.healthEmail?.message}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>{t("login.password_label")}</label>
                                {/* <InputField
                                  type="password"
                                  register={register}
                                  name="healthPassword"
                                  error={errors?.healthPassword?.message}
                                /> */}

                                <InputField
                                  type="password"
                                  name="healthPassword"
                                  {...register("healthPassword", {
                                    required: "Password is required",
                                    validate: (value) =>
                                      !/\s/.test(value) ||
                                      "Password cannot contain spaces",
                                    onChange: (e) =>
                                      (e.target.value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                      )), // Remove spaces while typing
                                  })}
                                  error={errors?.healthPassword?.message}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>{t("singup.Confirm_Password")}</label>
                                {/* <InputField
                                  type="password"
                                  register={register}
                                  name="confirmPassword"
                                  error={errors?.confirmPassword?.message}
                                /> */}
                                <InputField
                                  type="password"
                                  name="confirmPassword"
                                  {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (value) =>
                                      !/\s/.test(value) ||
                                      "Password cannot contain spaces",
                                    onChange: (e) =>
                                      (e.target.value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                      )), // Removes spaces while typing
                                  })}
                                  error={errors?.confirmPassword?.message}
                                />
                              </div>
                            </div>
                            <p>{t("singup.Password_text")}</p>
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
                                    href={t("singup.term_link")}
                                  >
                                    {t("singup.terms_use")}
                                  </a>{" "}
                                  {t("singup.and_lable")}{" "}
                                  <a
                                    target="_blank"
                                    href={t("singup.policy_link")}
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
                                  <a
                                    target="_blank"
                                    href={t("singup.doctor_Link")}
                                  >
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
                            <div className="col-md-12">
                              <LoadingButton
                                loading={loading}
                                type="submit"
                                className="black_btn" // Pass the existing class
                                buttonText={t("login.create_account")}
                              ></LoadingButton>
                            </div>
                            <div className="co-md-12">
                              <div className="divider">
                                <p>{t("login.or_lable")}</p>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="social">
                                <LoginWithGoogle member={role}>
                                  {t("login.google_login")}
                                </LoginWithGoogle>
                                <a href="#" target="_blank" rel="noreferrer">
                                  <Image
                                    src="images/apple.png"
                                    alt="Apple"
                                    className="img-fluid"
                                  />{" "}
                                  <LoginWithApple
                                    member={role}
                                  ></LoginWithApple>
                                </a>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="registerClinic">
                                {t("singup.clinic_Register")}{" "}
                                <a href="#" onClick={goToClinic}>
                                  {t("singup.here")}
                                </a>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </>
      <>
        {stateCount === 2 && (
          <VerifyCode
            setStateCount={setStateCount}
            stateCount={stateCount}
            email={email}
            type="doctor"
          />
        )}
      </>
      <>
        {getValues()?.member !== "Patient" && stateCount === 3 && (
          <DoctorProfileStep1 setStateCount={setStateCount} />
        )}
      </>
      <>
        {stateCount === 4 && (
          <DoctorProfileStep2 setStateCount={setStateCount} />
        )}
      </>
      <>
        {stateCount === 5 && <InvitationCode setStateCount={setStateCount} />}
      </>
      <>
        {getValues()?.member == "Patient" && stateCount === 3 && (
          <PatientProfile setStateCount={setStateCount} />
        )}
      </>
    </>
  );
};

export default Signup;
