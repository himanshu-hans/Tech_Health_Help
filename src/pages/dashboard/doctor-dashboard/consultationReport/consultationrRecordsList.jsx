import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData } from "../../../../hooks/services/services";
import { useSSR } from "react-i18next";
import { getFormattedDate } from "../../../../utils/common";
import { useTranslation } from "react-i18next";

function ConsultationRecordsList() {
  const { t } = useTranslation();
  const [patientList, setPatientList] = useState();
  const [activeTab, setActiveTab] = useState("records");
  const navigate = useNavigate();

  const consultationList = async () => {
    const response = await fetchData("doctors/appointment-list/", navigate);
    if (!response.ok) {
      throw new Error("Failed to fetch data from the server.");
    }
    const list = await response.json();
    setPatientList(list?.data);
  };

  useEffect(() => {
    consultationList();
  }, []);

  return (
    <>
      <div class="rightContent rightsidefull">
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img src="../images/profile-sample.png" class="img-fluid" />
          </div>
        </div>

        <div class="sortSearchArea">
          <div class="search">
            <input type="search" placeholder="Search" />
            <a href="#">
              <img src="../images/search-dark.svg" />
            </a>
          </div>
        </div>

        <div class="drAppointmentReport">
          <div class="tabPrt">
            <a class="bg-darkgreen" onClick={() => setActiveTab("records")}>
              {t("appointment-list.records")}
            </a>
            <a class="bg-blue" onClick={() => setActiveTab("reports")}>
              {t("support.reports")}
            </a>
          </div>
          <div class="drAppointmentReportInner">
            <div class="left bg-white">
              <div class="lastReport bg-none shadow-none border-radius-none">
                <div class="lastReportFix h-100">
                  {patientList?.map((item) => {
                    return (
                      <div className="reportDetail" key={item.id}>
                        <div className="col-md-12 d-flex">
                        <div className="img-prt col-md-3 d-flex align-items-center">
                          <img
                            src="/images/patient.svg"
                            // {item?.Patient?.profile_picture}
                            className="img-fluid"
                            alt="Patient"
                          />
                          <Link
                            to={`/doctor/consultation-report/${item?.appointment_id}`}
                          >
                            {item?.Patient?.first_name}{" "}
                            {item?.Patient?.last_name}
                          </Link>
                        </div>
                       
                        <div class="third col-md-3 d-flex align-items-center">
                           <div className="red-green">
                          {item.status === "Completed" ? (
                            <img
                              src="../images/greencircle.png"
                              className="img-fluid"
                              alt="Status"
                            />
                          ) : (
                            <img
                              src="../images/redcircle.png"
                              className="img-fluid"
                              alt="Status"
                            />
                          )}
                        </div>
                        </div>
                        <div class="third col-md-3 d-flex align-items-center">
                          <div class="clockCalenderPrt dark-text w-100">
                            <img src="/images/doctor-dashboard/dark-calender.svg" />
                            <span className="text-weight-bold">{getFormattedDate(item?.date)}</span>
                          </div>
                        </div>
                        <div class="third col-md-3 d-flex align-items-center">
                          <div class="clockCalenderPrt dark-text w-100">
                            <img src="/images/doctor-dashboard/dark-clock.svg" />
                            <span className="text-weight-bold">{item?.slot}</span>
                          </div>
                        </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConsultationRecordsList;
