import React, { useState } from "react";
import { InputField } from "../../components/form/InputField";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { showToast } from "../../utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/header/header";
import Image from "../../components/form/Image";
import { postRequest } from "../../hooks/services/services";
import { useTranslation } from "react-i18next";
import LoginWithGoogle from "../../SSOLogin/loginWithGoogle";
import LoginWithApple from "../../SSOLogin/loginWithApple";
import "../signup/signup.css";
import { loginFailure, loginSuccess } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { socket } from "../../utils/config";
import LoadingButton from "../../components/ui/loader/LoadingButton";
import { trackDeviceAccess } from "../../utils/deviceTracking";
const Login = () => {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("Doctor");
  const [active, setActive] = useState("members");

  const images = {
    Patient: "/images/login-img/Patient-1.svg",
    Doctor: "/images/login-img/Doctors-1.svg",
    Clinic: "/images/login-img/Clinic.svg",
  };

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Field is required"),
    password: Yup.string().required("Field is required"),
  });

  const getDefaultValues = () => {
    return {
      member: "Doctor",
    };
  };

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

  let formValues = getValues();

  const goToForgotPage = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    navigate("/forgot-password");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        email: data?.email,
        password: data?.password,
        role: formValues?.member,
      };
      const response = await postRequest("auth/signin/", payload); // Call the API service
      if (response.status === 200) {
        let responseData = await response.json();
        localStorage.setItem("user_token", responseData?.tokens?.access);
        localStorage.setItem("user_data", JSON.stringify(responseData?.user));
        showToast(responseData?.message, "success");
        socket.emit("register", { user_id: responseData?.user?.id });
        dispatch(
          loginSuccess(
            responseData?.user?.role,
            responseData?.tokens?.access,
            responseData?.tokens?.refresh
          )
        );
        if (responseData?.user?.role == "Doctor") {
          navigate("/dashboard");
          trackDeviceAccess(responseData?.user?.id);
        } else if (responseData?.user?.role == "Patient") {
          navigate("/patient/dashboard");
        } else {
          navigate("/clinic-dashboard/dashboard");
        }
      }
    } catch (error) {
      showToast(error.message, "error");
      dispatch(loginFailure(error.message || "Login failed."));
    } finally {
      setLoading(false); // Ensures loading stops in all cases
    }
  };
  return (
    <div>
      <Header />
      <section className="form_part py-2 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="signupTab">
                <div className="tabPrt">
                  <ul>
                    <li>
                      <a
                        onClick={() => navigate("/login")}
                        id="loginTab"
                        className="active"
                      >
                        {t("login.login_button")}
                      </a>
                    </li>
                    <li>
                      <a onClick={() => navigate("/signup")}>
                        {t("login.create_account")}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="formArea loginmain">
                  <form onSubmit={handleSubmit(onSubmit)}>
                  
                    <div className="row g-3 loginChangeColor">
                      <div
                        className="image-container"
                        style={{ textAlign: "center", marginBottom: "20px" }}
                      >
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
                      </div>
                      <div className="role-selector">
                        
                        <div className="col-md-4 col-6">
                          <div
                            className={`role-option toggle-radio ${
                              role === "Patient" ? "selected" : ""
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
                            <label htmlFor="Patient" className="mb-0 main-text">
                              {t("login.for_member")}
                            </label>
                          </div>
                        </div>
                        <div className="col-md-4 col-6">
                          <div
                            className={`role-option toggle-radio ${
                              role === "Doctor" ? "selected" : ""
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
                            <label htmlFor="Doctor" className="mb-0 main-text">
                              {t("login.for_specialist")}
                            </label>
                          </div>
                        </div>
                        <div className="col-md-4 col-6">
                          <div
                            className={`role-option toggle-radio ${
                              role === "Clinic" ? "selected" : ""
                            }`}
                          >
                            <Controller
                              name="member"
                              control={control}
                              render={({ field }) => (
                                <input
                                  id="Clinic"
                                  type="radio"
                                  value="Clinic"
                                  checked={field.value === "Clinic"}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    setRole(e.target.value);
                                  }}
                                />
                              )}
                            />
                            <label htmlFor="Clinic" className="mb-0 main-text">
                              {t("login.For_clinic")}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="email">
                            {t("login.email_label")}
                          </label>
                          <InputField
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            register={register}
                            error={errors?.email?.message}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="password">
                            {t("login.password_label")}
                          </label>
                          {/* <InputField
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            register={register}
                            error={errors?.password?.message}
     
                          /> */}
                          <InputField
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            {...register("password", {
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
                            error={errors?.password?.message}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <a
                          href="forgot_password.html"
                          className="forgot"
                          onClick={goToForgotPage}
                        >
                          {t("login.forgot_password")}
                        </a>
                      </div>
                      <div className="col-md-12">
                        <LoadingButton
                          loading={loading}
                          type="submit"
                          className="black_btn" 
                          buttonText={"Log in"}
                        ></LoadingButton>
                      </div>
                      {role !== "Clinic" && (
                        <>
                          <div className="col-md-12">
                            <div className="divider">
                              <p>{t("login.or_lable")}</p>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="social">
                              <LoginWithGoogle member={role}>
                                <p>{t("login.google_login")}</p>
                              </LoginWithGoogle>
                              <a href="#" target="_blank" rel="noreferrer">
                                <Image
                                  src="images/apple.png"
                                  alt="Apple"
                                  className="img-fluid"
                                />{" "}
                                <LoginWithApple member={role}></LoginWithApple>
                              </a>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
