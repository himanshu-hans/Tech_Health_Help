import React, { useState } from "react";
import ResetPassword from "./resetPassword";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../../../utils/toast";
import { deleteData, postData } from "../../../../hooks/services/services";
import AppointmentManage from "./appointmentManage";
import DataPrivacy from "./dataPrivacy";
import TimeLanguage from "./timeLanguage";
import CommunicationNotifications from "./communicationNotifications";
import { useTranslation } from "react-i18next";

const ProfileSetting = () => {
  const{t} = useTranslation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  const accountDelete = async () => {
    try {
      const response = await deleteData("auth/delete-account/");

      // if(response?.status === 200){
      // let responseData = await response.json()
      showToast("Delete Account successfully", "sucess");
      navigate("/signup");
      // }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const accountDeactivate = async () => {
    try {
      const response = await postData("auth/deactivate-account/");

      if (response?.status === 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        navigate("/login");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div class="rightContent rightsidefull">
      <form>
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img
              src="images/doctor-dashboard/profile-sample.png"
              class="img-fluid"
            />
          </div>
        </div>

        <div class="doc_info">
          <div class="row g-4">
            <div class="col-md-12">
              <div class="topSaving">
                <div class="settingName border-radius-20 bg-white py-3">
                  <div class="img-parallel">
                    <img
                      src="../images/doctor-dashboard/profile-sample.png"
                      class="img-fluid"
                    />
                    <Link class="text-darkgreen" to="/clinic-edit-profile">
                      {t("profile-setting.personal-profile-settings")}
                    </Link>
                  </div>
                </div>

                <div class="sortSearchArea mb-0">
                  <div class="search">
                    <input type="search" placeholder="Search" />
                    <a href="#">
                      <img src="../images/search-dark.svg" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* <div class="col-md-12">
              <div class="settingBox bg-white border-radius-20 padding-20">
                <h3 class="text-darkgreen mb-5">
                  {t("profile-setting.appointment-management")}
                </h3>
                <div class="row g-4">
                  <AppointmentManage />
                </div>
              </div>
            </div> */}

            <TimeLanguage />
            <CommunicationNotifications />

            <div class="col-md-12">
              <div class="settingBox bg-white border-radius-20 padding-20">
                <h3 class="text-darkgreen mb-5">
                  {t("profile-setting.privacy-security")}
                </h3>
                <div class="row g-4">
                  <DataPrivacy />
                  <ResetPassword />
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="settingBox bg-white border-radius-20 padding-20">
                <h3 class="text-darkgreen mb-5">{t("c")}</h3>
                <div class="row g-4">
                  <div class="col-md-6">
                    <p class="mb-4 d-flex">
                      {/* {t("log-out.title")}{" "} */}
                      {/* <span>LogOut</span> */}
                      <a
                        href="#"
                        class="bg-mainblue"
                        onClick={logout}
                      >
                        <img
                          src="../images/doctor-dashboard/logout.svg"
                          width="30"
                        />{" "}
                        {t("log-out.logout")}
                      </a>{" "}
                    </p>
                    <p>{t("log-out.description")}</p>

                    <div class="d-flex gap-3 justify-content-center mt-4">
                      <button
                        type="button"
                        class="delete_button"
                        onClick={accountDelete}
                      >
                        {t("log-out.delete-account")}
                      </button>
                      <button
                        type="button"
                        class="transparent_btn"
                        onClick={accountDeactivate}
                      >
                        {t("log-out.deactivate")}
                      </button>
                    </div>

                    <div class="text-center mt-4">
                      <p> {t("log-out.deactivation-consequences-title")} {t("log-out.deactivation-consequences1")} {t("log-out.deactivation-consequences2")} {t("log-out.deactivation-consequences3")} {t("log-out.restore-access-instructions")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetting;
