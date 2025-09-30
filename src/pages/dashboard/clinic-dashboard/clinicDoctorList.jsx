import React, { useState, useEffect } from "react";
import "../clinic-dashboard/clinicDashboard.css";
import { deleteData, fetchDataAuth } from "../../../hooks/services/services";
import { paymentSortBy } from "../../../utils/constants";
import Select from "../../../components/form/Select";
import { Loader } from "../../../components/ui/loader/loader";
import { showToast } from "../../../utils/toast";
import CommonModal from "../../../components/form/Modal";
import Image from "../../../components/form/Image";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../../components/pagination/pagination";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import { Country } from "country-state-city";

const ClinicDoctorList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [doctorList, setDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [removedDoctorId, setRemovedDoctorId] = useState();
   const [query, setquery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [totalPages, setTotalPages] = useState(1);
  

    const PaginatedClinicList = async (page = 1, searchQuery = "") => {
      setLoading(true);
      try {
        const response = await fetchDataAuth(
          `clinics/doctors/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(searchQuery)}`
        );
    
        if (!response.ok) {
          throw new Error("Failed to fetch data from the server.");
        }
    
        const totalPagesHeader = response.headers.get("Total-Pages");
        console.log("Full Headers:", [...response.headers.entries()]);
        const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
    
        const getData = await response.json();
        console.log(getData)
        setDoctorList(getData?.data);
        console.log("<<<<",doctorList)
        setTotalPages(totalPages);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      PaginatedClinicList();
    }, []);
    
 useEffect(() => {
    PaginatedClinicList(currentPage, query);
  }, [currentPage]);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      PaginatedClinicList(1, query);
    }
  };
  // const getClinicList = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetchDataAuth("clinics/doctors/");
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data from the server.");
  //     }
  //     const getData = await response.json();
  //     setDoctorList(getData);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error.message);
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   getClinicList();
  // }, []);
  const handleClose = () => {
    setOpenModal(false);
  };

const countryCodeMap = Object.fromEntries(
  Country.getAllCountries().map((country) => [
    country.name.toLowerCase(),
    country.isoCode,
  ])
);

  const handleConfirm = () => {
    deleteDoctorProfile();
  };

  const deleteDoctorProfile = async () => {
    try {
      const response = await deleteData(
        `clinics/doctor-remove/${removedDoctorId}`
      );
      let data = await response.json();
      console.log(">>>>>>>response11", data);
      showToast("Doctor deleted successfully", "success");
       PaginatedClinicList()
      handleClose();
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div class="rightContent rightsidefull">
          <div class="profileMobile">
            <div class="nameMobile">Hello, dr,Ava Williams!</div>
            <div class="profileImgMobile">
              <img src="images/profile-sample.png" class="img-fluid" />
            </div>
          </div>

          <div class="sortSearchArea">
            <div class="search">
              <input
                type="search"
                placeholder="Search"
                value={query}
                onChange={(e) => setquery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <a href="#">
                <img src="../images/search-dark.svg" />
              </a>
            </div>
          </div>
          <div class="clinic_doc_list bg-white-transparent border-radius-20 padding-20">
            <div class="recomend">
              {doctorList?.map((item) => {
                 const countryName = item?.country?.toLowerCase?.();
                 const countryCode = countryCodeMap[countryName] || "FR";
                return (
                  <div class="Docbox">
                    <div class="recomendBox">
                      <div class="clinicDocMain d-flex gap-3">
                        <div class="left allDoctor">
                          <div class="docrecomdpart">
                            <div class="docImg">
                               <Flag code={countryCode} className="docflag" />
                              <Image src={item?.profile_picture} className="doctorListImg"/>
                            </div>
                            <div class="drRdetail">
                              <div className="top">
                                  <div className="verified font-20">
                                    {item?.professional_stat || "Generalist"}{" "}
                                    &nbsp;
                                    <span className="main-blue-text ">
                                      {" "}
                                      {item?.experience_years || 0} years of
                                      experience{" "}
                                    </span>
                                  </div>
                                </div>
                              <div class="recondName d-flex gap-3">
                                Dr. {item?.first_name} {item?.last_name}
                              </div>
                              <div class="clinicLoca d-flex align-items-center gap-2">
                                <img src="images/mappin.svg" />
                                <span class="text-green">{item?.country}</span>
                              </div>
                              <div className="d-flex gap-2">
                                {item?.languages.map((lang) => {
                                  return (
                                    <div class="langSpeak">
                                      <span>{lang.title}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="right">
                          <div class="greenimg font-20">
                            <img src="images/general-medicine.svg" />
                            <span>{item?.specialty || "General Medicine"}</span>
                          </div>

                          <div class="bStar d-flex align-items-center gap-2">
                            <img src="images/black-star.svg" />
                            <span class="text-black ">{item?.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="pl-5">{item?.bio}</p>
                      <div class="doclistBtn2 d-flex justify-content-end gap-3">
                        <Link
                          to={"/doctorPublicView"}
                          state={{ doctor: item }}
                          class="transparent_btn "
                        >
                          More Info
                        </Link>
                      </div>
                    </div>
                    <div class="viewFullSchdl">
                      {t("all-doctor-list.view-full-schedules")}
                    </div>
                  </div>
                );
              })}
              {doctorList?.length == 0 && (
                <div>{t("all-doctor-list.no-doctors-found")} </div>
              )}
            </div>
            {doctorList?.length > 0 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ClinicDoctorList;
