import React, { useState, useEffect } from "react";
import "../dashboard/doctor-dashboard/dashboard.css";
import {
  deleteEntry,
  fetchData,
  fetchDataAuth,
  postData,
  updateFormData,
} from "../../hooks/services/services";
import { Country, City } from "country-state-city";
import { InputField } from "../../components/form/InputField";
import TextArea from "../../components/form/TextArea";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "../../utils/toast";
import AddEducation from "./addEducation";
import { Modal } from "react-bootstrap";
import MediaDigest from "./mediaDigest";
import Select from "../../components/form/Select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../../components/form/multiSelectDropdown";
import { getDoctorProfileSuccess } from "../../redux/actions/doctor/getDoctorProfileAction";
import { useTranslation } from "react-i18next";
import AddMediaDigestModel from "./addMediaDigestModel";
import ShowModelLicenses from "./showModelLicenses";

import "react-datepicker/dist/react-datepicker.css";
import { InputComponent } from "../../components/form/InputComponent";
import FileUpload from "../../components/form/FileUpload";
import AutoSelect from "../../components/form/AutoSelect";
import CreateSelect from "../../components/form/CreateSelect";
import { getProfileClass } from "../../utils/common";

const EditProfile = () => {
  const { t } = useTranslation("edit-profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [placeData, setPlaceData] = useState();
  const [loading, setLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(null);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [languageData, setLanguageData] = useState();
  const [modelOpen, setModelOpen] = useState(false);
  const [profileStatus, setProfileStatus] = useState("Rejected");
  const [showModelLicenses, setShowModelLicenses] = useState(false);
  const [showLicensesDetails, setShowLicensesDetails] = useState(false);
  const [licensesdetail, setLicensesdetail] = useState();
  const [showMediaDigest, setShowMediaDigest] = useState(false);
  const [mediadigestDetails, setMediadigestDetails] = useState();
  const [modelOpenMediaDigest, setModelOpenMediaDigest] = useState(false);
  const [EditedDetail, setEditedDetail] = useState([]);
  const [mediadiItemDetails, setMediadiItemDetails] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedWorkPlace, setSelectedWorkPlace] = useState();
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [isEducation, setIsEducation] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [Speciality, setSpeciality] = useState([]);
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const documentVerification = useSelector(
    (state) => state?.documentVerification?.documentVerification
  );

  const years = [];
  for (let i = 1; i <= 99; i++) {
    years.push({ label: String(i), value: String(i) });
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      gender: isProfiledata ? isProfiledata?.gender : "Male", // Default to Male
      work_place: isProfiledata?.work_place
        ? isProfiledata?.work_place
        : isProfiledata?.other_clinic
        ? "other"
        : "",
      city: isProfiledata?.city,
      experience_years: isProfiledata?.experience_years
        ? isProfiledata?.experience_years
        : "",
      professional_stat: parseInt(isProfiledata?.professional_stat),
    },
  });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [cities, setCities] = useState([]);

  // Get country list
  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  // Handle country change
  const handleCountryChange = (selectedOption, field) => {
    setSelectedCountry(selectedOption);
    field.onChange(selectedOption?.value); // Update React Hook Form state

    // Fetch cities based on selected country
    const cityList = City.getCitiesOfCountry(selectedOption?.value) || []; // Ensure it's an array
    const cityOptions = cityList.map((city) => ({
      value: city.name,
      label: city.name,
    }));
    setCities(cityOptions);
  };

  useEffect(() => {
    if (isProfiledata?.country) {
      // Find the country option
      const country = countryOptions.find(
        (c) => c.value === isProfiledata.country
      );
      if (country) {
        setSelectedCountry(country);

        // Load cities for this country
        const cityList = City.getCitiesOfCountry(isProfiledata.country) || [];
        const cityOptions = cityList.map((city) => ({
          value: city.name,
          label: city.name,
        }));
        setCities(cityOptions);
      }
    }
    if (isProfiledata?.professional_stat) {
      const sp = Speciality?.find(
        (c) => c.value == isProfiledata.professional_stat
      );
      setIsEdited(sp);
      if (!sp) {
        setSpeciality((prev) => [
          ...prev,
          {
            label: isProfiledata.professional_stat,
            value: isProfiledata.professional_stat,
          },
        ]);
      }
    }
  }, [isProfiledata, Speciality]);

  const getPlaceWork = async () => {
    try {
      const response = await fetchDataAuth("clinics/");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setPlaceData([
        ...getData?.data?.map((item) => ({ label: item.name, value: item.id })),
        { label: "Other", value: "other" },
      ]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSpecialization = async () => {
    try {
      const response = await fetchDataAuth("MasterPanel/merge-specialization/");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setSpeciality([
        ...getData?.specializations?.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ]);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getPlaceWork();
    getLanguageData();
    getMediaDigest();
    getSpecialization();
  }, []);

  useEffect(() => {
    if (documentVerification.length) {
      const determineStatus = () => {
        if (documentVerification.some((doc) => doc.status === "Rejected")) {
          setProfileStatus("Rejected");
        } else if (
          documentVerification.some((doc) => doc.status === "Pending")
        ) {
          setProfileStatus("Pending");
        } else {
          setProfileStatus("Verified");
        }
      };
      determineStatus();
    }
  }, [documentVerification]);

  useEffect(() => {
    setSelectedGender(isProfiledata?.gender);
    getEducation(); // for Education
    setSelectedWorkPlace(
      isProfiledata?.work_place
        ? isProfiledata?.work_place
        : isProfiledata?.other_clinic
        ? "other"
        : ""
    );
    let filteredLanguage = languageOptions?.filter((option) =>
      isProfiledata?.languages?.includes(option?.id)
    );
    setLanguageData(filteredLanguage);
  }, [isProfiledata, languageOptions]);

  useEffect(() => {
    getEducation();
  }, [isEducation]);

  const getEducation = async () => {
    try {
      const response = await fetchData("user/education/");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const data = await response.json();

      setEditedDetail(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteEducation = async (educationId, e) => {
    e.preventDefault();
    try {
      const response = await deleteEntry(`user/education/${educationId}`);
      // UI se education remove karne ke liye state update
      setEditedDetail((prevEducation) =>
        prevEducation.filter((edu) => edu.id !== educationId)
      );

      if (response.status === 200) {
        showToast(
          response?.message || "Education record deleted successfully",
          "success"
        );
      }
    } catch (error) {
      showToast(
        error.message || "Failed to delete education. Please try again."
      );
    }
  };

  const getLanguageData = async () => {
    try {
      const response = await fetchDataAuth("clinics/languages", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      const formattedData = getData?.map((item) => ({
        name: item.title,
        id: item.id,
      }));
      setLanguageOptions(formattedData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLicensesData = async () => {
    try {
      const response = await fetchDataAuth(
        "doctors/licence-certificate/",
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setLicensesdetail(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getLicensesData();
  }, []);

  const getMediaDigest = async () => {
    try {
      const response = await fetchDataAuth(
        "doctors/media-digest-document/",
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setMediadigestDetails(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const openSkilAddModal = (event) => {
    event.preventDefault();
    setModelOpen(true);
    setSelectedEducation(null);
  };

  const addSpeclization = async (specialization) => {
    try {
      const payload = {
        specialization: specialization,
      };
      await postData("doctors/add-specialization/", payload);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    let lang = languageData?.map((item) => item?.id);
    const allValues = getValues(); // Get current values of the form
    const updatedFields = Object.keys(dirtyFields).reduce((acc, field) => {
      acc[field] = allValues[field]; // Add only changed fields
      return acc;
    }, {});
    let fields = {
      first_name: updatedFields?.first_name,
      bio: updatedFields?.bio,
      email: updatedFields?.email,
      city: updatedFields?.city,
      country: updatedFields?.country,
      dob: updatedFields?.dob,
      expertise: updatedFields?.expertise,
      gender: updatedFields?.gender,
      last_name: updatedFields?.last_name,
      professional_stat: updatedFields?.professional_stat,
      phone_number: updatedFields?.phone_number,
      experience_years: updatedFields?.experience_years,
      profile_picture: updatedFields?.uploadPhoto,
      clinic_name: updatedFields?.hospital_name,
      clinic_website: updatedFields?.website,
      clinic_location: updatedFields?.location,
    };
    if (selectedWorkPlace == "other") {
      fields.clinic = selectedWorkPlace;
      fields.work_place = "";
    }
    if (selectedWorkPlace !== "other") {
      fields.work_place = selectedWorkPlace;
    }
    try {
      const formData = new FormData();
      formData.append("languages", lang ? JSON.stringify(lang) : null);
      Object.keys(fields).forEach((key) => {
        if (fields[key]) {
          formData.append(key, fields[key]);
        }
      });
      const response = await updateFormData("auth/update-profile/", formData);
      if (response.status === 200) {
        const responseData = await response.json();
        dispatch(getDoctorProfileSuccess(responseData?.data));
        showToast(responseData?.message, "success");
        setLoading(false);
        const sp = Speciality?.find(
          (c) => c.value == updatedFields.professional_stat
        );
        if (updatedFields.professional_stat && sp == undefined) {
          addSpeclization(updatedFields.professional_stat);
        }
      }
    } catch (error) {
      setLoading(false);
      showToast(error.message, "error");
    }
  };

  const openUpdateEducationModal = async (event, education) => {
    event.preventDefault();
    setSelectedEducation(education);
    setModelOpen(true);
  };

  return (
    <div class="rightContent rightsidefull">
      <div class="doc_info">
        <div class="row g-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div class="col-md-12">
              <div class="profileView padding-inner border-radius-20 bg-white">
                <div class="profileForm">
                  <div>
                    <div class="row g-4">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>{t("singup.first_name")} </label>
                          <Controller
                            name="first_name"
                            control={control}
                            defaultValue={isProfiledata?.first_name || ""}
                            render={({ field }) => (
                              <InputComponent type="text" {...field} />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>{t("singup.Last_name")}</label>
                          <Controller
                            name="last_name"
                            control={control}
                            defaultValue={isProfiledata?.last_name || ""}
                            render={({ field }) => (
                              <InputComponent type="text" {...field} />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>{t("singup.date_birth")}</label>
                          <Controller
                            name="dob"
                            control={control}
                            defaultValue={isProfiledata?.dob || ""}
                            render={({ field }) => (
                              <InputComponent type="date" {...field} />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>{t("singup.Gender_lable")}</label>
                          <div className="genderCheck d-flex align-items-center justify-content-between">
                            {["Male", "Female", "Other"].map((gender) => (
                              <div
                                key={gender}
                                className="radiotype d-flex align-items-center gap-2"
                              >
                                <Controller
                                  name="gender"
                                  control={control}
                                  defaultValue={selectedGender}
                                  render={({ field }) => (
                                    <InputField
                                      type="radio"
                                      {...field}
                                      value={gender}
                                      checked={field.value === gender}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                      }}
                                    />
                                  )}
                                />
                                <label className="mb-0">
                                  {t(`edit-profile.${gender}`)}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{t("edit-profile.email-address")}</label>
                          <Controller
                            name="email"
                            control={control}
                            defaultValue={isProfiledata?.email || ""}
                            render={({ field }) => (
                              <InputComponent
                                type="email"
                                {...field}
                                disabled
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{t("edit-profile.phone-number")}</label>
                          <Controller
                            name="phone_number"
                            control={control}
                            defaultValue={isProfiledata?.phone_number || ""}
                            render={({ field }) => (
                              <InputComponent
                                type="text"
                                {...field}
                                maxLength="15"
                                minLength="10"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <Controller
                            name="country"
                            control={control}
                            defaultValue={isProfiledata?.country || ""}
                            render={({ field }) => (
                              <AutoSelect
                                label={t("edit-profile.country")}
                                options={countryOptions}
                                placeholder={t("edit-profile.select_country")}
                                isSearchable={true} // Enable autocomplete
                                error={errors?.country?.message}
                                onChange={(option) =>
                                  handleCountryChange(option, field)
                                }
                                value={field.value}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <Controller
                            name="city"
                            control={control}
                            defaultValue={isProfiledata?.city || ""}
                            render={({ field }) => (
                              <AutoSelect
                                label={t("edit-profile.city")}
                                options={cities}
                                placeholder={t("edit-profile.select_city")}
                                error={errors.city?.message}
                                value={field.value}
                                onChange={(selectedOption) => {
                                  field.onChange(selectedOption?.value);
                                }}
                                isSearchable={true}
                                isDisabled={!cities?.length}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* profile view */}
                <div class="profileViewPrt">
                  <div class="profileViewTop">
                    <a onClick={() => navigate("/doctor/public-view")}>
                      {t("edit-profile.public-view")}
                    </a>
                    <div
                      class={`profileviewImg grrenC ${getProfileClass(
                        profileStatus
                      )}`}
                    >
                      <FileUpload
                        src={
                          isProfiledata?.profile_picture
                            ? isProfiledata?.profile_picture
                            : "../images/sample.png"
                        }
                        name="uploadPhoto"
                        label="Upload Profile Picture"
                        control={control}
                      />
                    </div>
                  </div>
                  <div>
                    <div class="row g-4">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{t("edit-profile.bio")}</label>
                          <Controller
                            name="bio"
                            control={control}
                            defaultValue={isProfiledata?.bio || ""}
                            render={({ field, fieldState: { error } }) => (
                              <TextArea
                                type="text"
                                placeholder="Your text here..."
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{t("edit-profile.languages")}</label>
                          <MultiSelectDropdown
                            options={languageOptions || []}
                            selectedValues={languageData || []}
                            name="languages"
                            onChange={setLanguageData}
                            register={register}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="d-flex gap-3 justify-content-center">
                          <button
                            type="submit"
                            class="blue_btn"
                            disabled={loading}
                          >
                            {t("common.save-changes")}
                          </button>
                          <button type="button" class="transparent_btn">
                            {t("common.cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12 mt-3">
              <div class="padding-inner border-radius-20 bg-white">
                <div>
                  <div class="row g-4">
                    <div class="col-md-6">
                      <div class="row g-4">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label className="d-flex align-items-center gap-2">
                              {t("edit-profile.place-of-work")}
                              <i
                                class="fa-solid fa-circle-info"
                                title="If you want to add a new hospital than chose other option"
                              ></i>
                            </label>
                            <Controller
                              name="work_place"
                              control={control}
                              defaultValue={selectedWorkPlace}
                              render={({ field }) => (
                                <AutoSelect
                                  options={placeData}
                                  placeholder="Select Hospital"
                                  isSearchable={true}
                                  error={errors?.work_place?.message}
                                  onChange={(option) => {
                                    const selectedValue = option?.value || "";
                                    setSelectedWorkPlace(selectedValue);
                                    field.onChange(selectedValue);
                                  }}
                                  value={field.value}
                                />
                              )}
                            />
                          </div>
                          {selectedWorkPlace == "other" && (
                            <div className="col-md-12 mt-3">
                              <div className="row">
                                <div className="col-md-6">
                                  <label>Hospital Name</label>
                                  <Controller
                                    name="hospital_name"
                                    control={control}
                                    defaultValue={
                                      isProfiledata?.clinic_name ||
                                      isProfiledata?.other_clinic?.clinic_name
                                    }
                                    render={({ field }) => (
                                      <InputField
                                        type="text"
                                        placeholder="Hospital Name"
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label>Website</label>
                                  <Controller
                                    name="website"
                                    control={control}
                                    defaultValue={
                                      isProfiledata?.clinic_website ||
                                      isProfiledata?.other_clinic?.website
                                    }
                                    render={({ field }) => (
                                      <InputField
                                        type="text"
                                        placeholder="Website"
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedWorkPlace == "other" && (
                            <div className="col-md-12 mt-4">
                              <div className="row">
                                <div className="col-md-12">
                                  <label>Location</label>
                                  <Controller
                                    name="location"
                                    control={control}
                                    defaultValue={
                                      isProfiledata?.clinic_location ||
                                      isProfiledata?.other_clinic?.address
                                    }
                                    render={({ field }) => (
                                      <InputField
                                        type="text"
                                        placeholder="Location"
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div class="col-md-12">
                          <div class="form-group">
                            <label className="d-flex align-items-center gap-2">
                              {t("edit-profile.professional-statistics")}
                              <i
                                class="fa-solid fa-circle-info"
                                title="If you want to create new then Type text and click on create"
                              ></i>
                            </label>
                            <Controller
                              name="professional_stat"
                              control={control}
                              render={({ field }) => {
                                return (
                                  <CreateSelect
                                    options={Speciality}
                                    name="professional_stat"
                                    isSearchable={true}
                                    onChange={(option) => {
                                      const sp = Speciality?.find(
                                        (c) => c.value == option?.value
                                      );
                                      field.onChange(option?.value); // sends value to form
                                      setIsEdited(sp);
                                    }}
                                    value={isEdited} // show selected item in UI
                                  />
                                );
                              }}
                            />
                            <label>{t("edit-profile.years")}</label>
                            <Controller
                              name="experience_years"
                              control={control}
                              defaultValue={isProfiledata?.experience_years}
                              render={({ field }) => (
                                <Select {...field} options={years} />
                              )}
                            />
                          </div>
                        </div>
                        {/* <div class="col-md-12">
                          <h5 class="adding">
                            {t("edit-profile.add-to-profile")}
                          </h5>
                        </div>
                        <div class="col-md-12">
                          <div class="profileBox">
                            <div class="boxNaming">
                              Cardiolog Hospital Sant Vincent 2006-now a days
                            </div>
                            <div class="addDelete">
                              <a href="#">
                                <img src="../images/doctor-dashboard/edit.svg" />
                              </a>
                              <a href="#">
                                <img src="../images/doctor-dashboard/delete.png" />
                              </a>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="row g-4">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label>
                              {t("edit-profile.areas-of-expertise")}
                            </label>
                            <Controller
                              name="expertise"
                              control={control}
                              defaultValue={isProfiledata?.expertise || ""}
                              render={({ field, fieldState: { error } }) => (
                                <TextArea
                                  type="text"
                                  placeholder="Your text here..."
                                  {...field}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12 mt-3">
              <div class="padding-inner border-radius-20 bg-white">
                <div class="d-flex align-items-center justify-content-between mb-4">
                  <h3 class="docinfohead">
                    {t("edit-profile.licenses-certifications")}
                  </h3>
                  <a>
                    <img
                      src="/images/iconamoon_folder-add-thin.svg"
                      alt="Add"
                      style={{ width: "30px", height: "30px" }}
                      onClick={() => setShowModelLicenses(true)}
                    />
                  </a>
                </div>
                <div
                  className={`${
                    licensesdetail?.length != 0 ? "mediaDegestPart h-450" : ""
                  }`}
                >
                  {licensesdetail?.length > 0 ? (
                    licensesdetail
                      ?.slice(
                        0,
                        showLicensesDetails ? licensesdetail.length : 3
                      )
                      .map((item) => (
                        <>
                          <div className="mediaBox" key={item.id}>
                            <img
                              src={item.attachment}
                              className="w-100"
                              alt="Media"
                            />
                            <div
                              className="description"
                              title={item?.description}
                            >
                              {item?.description}
                            </div>
                          </div>
                        </>
                      ))
                  ) : (
                    <div className="treatmentContainer">
                      <div className="no-appointments">
                        No license available
                      </div>
                    </div>
                  )}
                </div>
                {licensesdetail?.length > 2 && (
                  <a
                    className="downopen"
                    onClick={() => setShowLicensesDetails(!showLicensesDetails)}
                  >
                    <img
                      src="../images/downopen.svg"
                      alt="toggle"
                      style={{
                        transform: showLicensesDetails
                          ? "rotate(180deg)"
                          : "rotate(0deg)", // Rotate icon
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                    />
                  </a>
                )}
              </div>
            </div>
            <div className="col-md-12 mt-3">
              <div className="padding-inner border-radius-20 bg-white">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h4 className="docinfohead">
                    {t("edit-profile.specializations")}
                  </h4>
                  <div className="">
                    <a href="#" onClick={openSkilAddModal}>
                      <img
                        src="/images/iconamoon_folder-add-thin.svg"
                        alt="Add"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </a>
                  </div>
                </div>
                <div
                  className={`${EditedDetail?.length != 0 ? "skillsPart" : ""}`}
                >
                  {EditedDetail?.length > 0 ? (
                    EditedDetail?.slice(
                      0,
                      showAll ? EditedDetail?.length : 1
                    ).map((education, index) => (
                      <div
                        key={index}
                        className="skillsPartInner"
                        style={{ position: "relative" }}
                      >
                        <h4>{t("edit-profile.education")}</h4>
                        <p>{education?.school}</p>
                        <p>{education?.degree}</p>

                        <div
                          className="skillEdit"
                          style={{
                            position: "absolute",
                            top: "2rem",
                            right: 0,
                            gap: "11px",
                          }}
                        >
                          <a
                            href="#"
                            onClick={(e) =>
                              openUpdateEducationModal(e, education)
                            }
                          >
                            <img
                              src="../images/doctor-dashboard/edit-skill.webp"
                              alt="Edit"
                            />
                          </a>

                          <a
                            href="#"
                            onClick={(e) =>
                              handleDeleteEducation(education.id, e)
                            }
                          >
                            <img
                              src="../images/doctor-dashboard/delete-icon1.png"
                              alt="Delete"
                            />
                          </a>
                        </div>
                        <h4>{t("edit-profile.specializations")}</h4>
                        {education?.skills?.length > 0 ? (
                          <p>
                            {education.skills
                              ?.map((skill) => skill)
                              ?.join(", ")}
                          </p>
                        ) : (
                          <p>No skills available</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="treatmentContainer">
                      <div className="no-appointments">
                        No specializations available
                      </div>
                    </div>
                  )}
                </div>
                {EditedDetail?.length > 1 && (
                  <a
                    href="#"
                    className="downopen"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAll(!showAll);
                    }}
                  >
                    <img
                      src="../images/downopen.svg"
                      alt="Show More"
                      style={{
                        transform: showAll ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </a>
                )}
              </div>
            </div>

            <div class="col-md-12 mt-3">
              <div class="padding-inner border-radius-20 bg-white">
                <div class="d-flex align-items-center justify-content-between mb-4">
                  <h3 class="docinfohead">{t("edit-profile.media-digest")}</h3>
                  <a>
                    <img
                      src="/images/iconamoon_folder-add-thin.svg"
                      alt="Add"
                      style={{ width: "30px", height: "30px" }}
                      onClick={() => setModelOpenMediaDigest(true)}
                    />
                  </a>
                </div>
                <div
                  className={`${
                    licensesdetail?.length != 0 ? "mediadigestDetails" : ""
                  }`}
                >
                  {mediadigestDetails?.length > 0 ? (
                    mediadigestDetails
                      ?.slice(
                        0,
                        showMediaDigest ? mediadigestDetails.length : 3
                      )
                      .map((item) => (
                        <div className="mediaBox" key={item.id}>
                          <img
                            src={item.attachment_file}
                            className="w-100"
                            alt="Media"
                          />
                          <h5 className="description">{item?.title}</h5>
                          <div className="description">{item?.description}</div>
                          <button
                            type="button"
                            className="blue_btn"
                            data-bs-toggle="modal"
                            data-bs-target="#mediaDigestPop"
                            onClick={() => setMediadiItemDetails(item)}
                          >
                            Read More
                          </button>
                        </div>
                      ))
                  ) : (
                    <div className="treatmentContainer">
                      <div className="no-appointments">No media available</div>
                    </div>
                  )}
                </div>
                {mediadigestDetails?.length > 2 && (
                  <a
                    className="downopen"
                    onClick={() => setShowMediaDigest(!showMediaDigest)}
                  >
                    <img
                      src="../images/downopen.svg"
                      alt="toggle"
                      style={{
                        transform: showMediaDigest
                          ? "rotate(180deg)"
                          : "rotate(0deg)", // Rotate icon
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                    />
                  </a>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <AddEducation
        userId={isProfiledata?.id}
        setModelOpen={setModelOpen}
        modelOpen={modelOpen}
        Modal={Modal}
        EditedDetail={selectedEducation}
        setIsEducation={setIsEducation}
        getEducation={getEducation}
      />
      <MediaDigest mediadiItemDetails={mediadiItemDetails} />
      <AddMediaDigestModel
        modelOpenMediaDigest={modelOpenMediaDigest}
        setModelOpenMediaDigest={setModelOpenMediaDigest}
        getMediaDigest={getMediaDigest}
      />
      <ShowModelLicenses
        showModelLicenses={showModelLicenses}
        setShowModelLicenses={setShowModelLicenses}
        getLicensesData={getLicensesData}
      />
    </div>
  );
};

export default EditProfile;
