import React, { useState, useEffect } from "react";
import { Country, City } from "country-state-city";
import "../../dashboard/doctor-dashboard/dashboard.css";
import {
  deleteData,
  fetchDataAuth,
  updateFormData,
} from "../../../hooks/services/services";
import { InputField } from "../../../components/form/InputField";
import TextArea from "../../../components/form/TextArea";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "../../../utils/toast";
import Select from "../../../components/form/Select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../../../components/form/multiSelectDropdown";
import { getDoctorProfileSuccess } from "../../../redux/actions/doctor/getDoctorProfileAction";
// import { Country, countryCityData } from "../../../utils/constants";
import "react-datepicker/dist/react-datepicker.css";
import { InputComponent } from "../../../components/form/InputComponent";
import FileUpload from "../../../components/form/FileUpload";
import UserUploadImagePop from "./userUploadImagePop";
import { useTranslation } from "react-i18next";
import UserAddProfilePop from "./userAddProfilePop";
import UserEditProfileModel from "./userEditProfileModel";
import AddMedicalHistoryModel from "./addMedicalHistoryModel";
import EditMedicalHistoryModel from "./editMedicalHistoryModel";
import AutoSelect from "../../../components/form/AutoSelect";
import { getProfileClass } from "../../../utils/common";

const PatientEditProfile = () => {
  const { t } = useTranslation("edit-clinic-profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showAllMedicalHistory, setShowAllMedicalHistory] = useState(false);
  const [profileStatus, setProfileStatus] = useState('Rejected')
  const [userAddOpenModel, setUserAddOpenModel] = useState(false);
  const [userEditOpenModel, setUserEditOpenModel] = useState(false);
  const [editAllergie, setEditAllergie] = useState();
  const [userMedicalHistoryModel, setUserMedicalHistoryModel] = useState(false);
  const [userEditHistoryModel, setUserEditHistoryModel] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [languageData, setLanguageData] = useState();
  const [allergieDetails, setAllergieDetails] = useState();
  const [editMedicalDocument, setEditMedicalDocument] = useState();
  const [medicalDocumentDetails, setMedicalDocumentDetails] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedWorkPlace, setSelectedWorkPlace] = useState();
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const userId = isProfiledata?.id;
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
      work_place: isProfiledata?.work_place ? isProfiledata?.work_place : "",
      city: isProfiledata?.city,
      years: isProfiledata?.years ? isProfiledata?.years : "",
    },
  });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [cities, setCities] = useState([]);
  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));
  const handleCountryChange = (selectedOption, field) => {
    setSelectedCountry(selectedOption);
    field.onChange(selectedOption?.value); // Update React Hook Form state
    const cityList = City.getCitiesOfCountry(selectedOption?.value) || []; // Ensure it's an array
    const cityOptions = cityList.map((city) => ({
      value: city.name,
      label: city.name,
    }));
    setCities(cityOptions);
  };
  useEffect(() => {
    if (isProfiledata?.country) {
      const country = countryOptions.find(
        (c) => c.value === isProfiledata.country
      );
      if (country) {
        setSelectedCountry(country);
        const cityList = City.getCitiesOfCountry(isProfiledata.country) || [];
        const cityOptions = cityList.map((city) => ({
          value: city.name,
          label: city.name,
        }));
        setCities(cityOptions);
      }
    }
  }, [isProfiledata]);

  useEffect(() => {
    getLanguageData();
  }, []);

  useEffect(() => {
    setSelectedGender(isProfiledata?.gender);
    setSelectedWorkPlace(
      isProfiledata?.work_place ? isProfiledata?.work_place : ""
    );
    let filteredLanguage = languageOptions?.filter((option) =>
      isProfiledata?.languages?.includes(option?.id)
    );
    setLanguageData(filteredLanguage);
  }, [isProfiledata, languageOptions]);

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

  const handleEditAllergieDetails = (item) => {
    setEditAllergie(item);
    setUserEditOpenModel(true);
  };

  const handleMedicalDocumentDetails = (item) => {
    setEditMedicalDocument(item);
    setUserEditHistoryModel(true);
  };

  const getMedicalDocumentsData = async () => {
    try {
      const response = await fetchDataAuth(
        `patient/upload/medical-document/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setMedicalDocumentDetails(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeMedicalDocument = async (item) => {
    try {
      const response = await deleteData(
        `patient/upload/medical-document/${item?.id}/`
      );

      if (!response.ok) {
        throw new Error("Failed to remove clinic from favorites."); // Handle failed requests
      }
      const responseData = await response.json(); // Extract JSON response
      showToast(responseData.message, "sucess");
      await getMedicalDocumentsData();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const removeAllergie = async (item) => {
    try {
      const response = await deleteData(
        `patient/upload/allergy-document/${item?.id}/`
      );

      if (!response.ok) {
        throw new Error("Failed to remove clinic from favorites."); // Handle failed requests
      }
      const responseData = await response.json(); // Extract JSON response
      showToast(responseData.message, "sucess");
      await getAllergiedData();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const getAllergiedData = async () => {
    try {
      const response = await fetchDataAuth(
        `patient/upload/allergy-document/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setAllergieDetails(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllergiedData();
    getMedicalDocumentsData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    let lang = languageData?.map((item) => item?.id);
    const allValues = getValues(); // Get current values of the form
    const updatedFields = Object.keys(dirtyFields).reduce((acc, field) => {
      acc[field] = allValues[field]; // Add only changed fields
      return acc;
    }, {});
    const fields = {
      first_name: updatedFields?.first_name,
      bio: updatedFields?.bio,
      email: updatedFields?.email,
      city: updatedFields?.city,
      country: updatedFields?.country,
      dob: updatedFields?.dob,
      expertise: updatedFields?.expertise,
      gender: updatedFields?.gender,
      last_name: updatedFields?.last_name,
      phone_number: updatedFields?.phone_number,
      profile_picture: updatedFields?.uploadPhoto,
      show_phone: updatedFields?.show_phone ? "true" :"false",
      show_email: updatedFields?.show_email ? "true": "false",
    };

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
      }
    } catch (error) {
      setLoading(false);
      showToast(error.message, "error");
    }
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
                          <label>{t("singup.first_name")}</label>
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
                          <label>Gender</label>
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
                        <div className="form-group d-flex align-item-center justify-content-between gap-2">
                          <label>{t("edit-profile.email-address")}</label>
                          <div className="d-flex align-items-center  gap-2 mb-1">
                            <label className="mb-0">
                              {t("edit-profile.show-profile")}
                            </label>
                            <Controller
                              name="show_email"
                              control={control}
                              defaultValue={isProfiledata?.show_email}
                              render={({ field }) => (
                                <input
                                  type="checkbox"
                                  {...field}
                                  checked={field.value}
                                  onChange={(e) =>{
                                    field.onChange(e.target.checked)
                                  }}
                                />

                              )}
                            />
                          </div>
                        </div>
                        <div class="form-group">
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
                        <div className="form-group d-flex align-item-center justify-content-between gap-2">
                          <label>{t("edit-profile.phone-number")}</label>
                          <div className="d-flex align-items-center  gap-2 mb-1">
                            <label className="mb-0">
                              {t("edit-profile.show-profile")}
                            </label>

                            <Controller
                              name="show_phone"
                              control={control}
                              defaultValue={isProfiledata?.show_phone}
                              render={({ field }) => (
                                <input
                                  type="checkbox"
                                  {...field}
                                  checked={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div class="form-group">
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
                                label="Country"
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
                                label="City"
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
                <div class="profileViewPrt">
                  <div class="profileViewTop">
                    <a
                      onClick={() => navigate("/patient/public-view")}
                    >
                      {t("edit-profile.public-view")}
                    </a>
                    <div className={`profileviewImg`}>
                      <FileUpload
                        src={isProfiledata?.profile_picture}
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
                            defaultValue={isProfiledata?.bio} // Ensuring bio is always initialized
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
                            placeholder="Select"
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
                <div class="d-flex align-items-center justify-content-between mb-4">
                  <h3 class="docinfohead">{t("edit-profile.allergies")}</h3>
                  <a>
                    <img
                      src="/images/iconamoon_folder-add-thin.svg"
                      alt="Add"
                      style={{ width: "30px", height: "30px" }}
                      onClick={() => setUserAddOpenModel(true)}
                    />
                  </a>
                </div>

                <div className="allergiesMain">
                  {allergieDetails?.length > 0 ?
                    allergieDetails?.slice( 0,
                      showAll ? allergieDetails?.length : 1
                    ).map((item) => (
                        <div
                          className="licenses border-gray allr mb-3"
                          key={item.id}
                        >
                          <div className="form-group w-50 d-flex">
                            {item?.name}
                          </div>
                          <div className="d-flex gap-3 w-50 d-flex">
                          <p className="mb-0">{t("edit-profile.document-link")}</p>{" "}
                            <a
                              href={item?.document_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("edit-profile.click-here")}
                            </a>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src="../images/edit.svg"
                              width="25"
                              onClick={() => handleEditAllergieDetails(item)}
                              alt="edit"
                            />
                            <img
                              src="../images/delete.svg"
                              width="25"
                              alt="delete"
                              onClick={() => removeAllergie(item)}
                            />
                          </div>
                        </div>
                    )):(<div className="treatmentContainer">
                      <div className="no-appointments">
                        {t("edit-profile.no-alergies")}
                      </div>
                    </div>)}
                </div>
                {allergieDetails?.length > 1 && (
                  <a className="downopen" onClick={() => setShowAll(!showAll)}>
                    <img
                      src="../images/downopen.svg"
                      alt="toggle"
                      style={{
                        transform: showAll ? "rotate(180deg)" : "rotate(0deg)", // Rotate icon
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                    />
                  </a>
                )}
              </div>
            </div>
            <div class="col-md-12 mt-3">
              <div class="padding-inner border-radius-20 bg-white">
                <div class="d-flex align-items-center justify-content-between mb-4">
                  <h3 class="docinfohead">
                    {t("edit-profile.medical-history")}
                  </h3>
                  <a>
                    <img
                      src="/images/iconamoon_folder-add-thin.svg"
                      alt="Add"
                      style={{ width: "30px", height: "30px" }}
                      onClick={() => setUserMedicalHistoryModel(true)}
                    />
                  </a>
                </div>
                <div className="allergiesMain">
                  {medicalDocumentDetails?.length > 0 ?
                    medicalDocumentDetails?.slice( 0,
                      showAllMedicalHistory ? allergieDetails?.length : 1)
                      .map((item) => (
                        <div
                          className="licenses border-gray allr mb-3"
                          key={item.id}
                        >
                          <div className="form-group w-50 d-flex">
                            {item?.name}
                          </div>
                          <div className="d-flex gap-3 w-50 d-flex">
                          <p className="mb-0">  {t("edit-profile.document-link")} </p>{" "}
                            <a
                              href={item?.document_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("edit-profile.click-here")}
                            </a>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src="../images/edit.svg"
                              width="25"
                              onClick={() => handleMedicalDocumentDetails(item)}
                              alt="edit"
                            />
                            <img
                              src="../images/delete.svg"
                              width="25"
                              alt="delete"
                              onClick={() => removeMedicalDocument(item)}
                            />
                          </div>
                        </div>
                    )): (<div className="treatmentContainer">
                      <div className="no-appointments">
                        {t("edit-profile.no-medical")}
                      </div>
                    </div>)}
                </div>

                {medicalDocumentDetails?.length > 1 && (
                  <a
                    className="downopen"
                    onClick={() =>
                      setShowAllMedicalHistory(!showAllMedicalHistory)
                    }
                  >
                    <img
                      src="../images/downopen.svg"
                      alt="toggle"
                      style={{
                        transform: showAllMedicalHistory
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
      <UserAddProfilePop
        setUserAddOpenModel={setUserAddOpenModel}
        userAddOpenModel={userAddOpenModel}
        getAllergiedData={getAllergiedData}
      />
      <UserEditProfileModel
        setUserEditOpenModel={setUserEditOpenModel}
        userEditOpenModel={userEditOpenModel}
        editAllergie={editAllergie}
        getAllergiedData={getAllergiedData}
      />
      <AddMedicalHistoryModel
        getMedicalDocumentsData={getMedicalDocumentsData}
        setUserMedicalHistoryModel={setUserMedicalHistoryModel}
        userMedicalHistoryModel={userMedicalHistoryModel}
      />
      <EditMedicalHistoryModel
        setUserEditHistoryModel={setUserEditHistoryModel}
        userEditHistoryModel={userEditHistoryModel}
        editMedicalDocument={editMedicalDocument}
        getMedicalDocumentsData={getMedicalDocumentsData}
      />
    </div>
  );
};

export default PatientEditProfile;
