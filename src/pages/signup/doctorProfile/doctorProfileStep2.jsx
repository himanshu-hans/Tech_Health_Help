import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import Select from "../../../components/form/Select";
import { updateFormData } from "../../../hooks/services/services";
import { InputField } from "../../../components/form/InputField";
import FileUpload from "../../../components/form/FileUpload";
import { getLanguageData } from "../../../utils/common";
import { days } from "../../../utils/constants";
import { useTranslation } from "react-i18next";
import MultiSelectDropdown from "../../../components/form/multiSelectDropdown";
import { loginSuccess } from "../../../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import currencyCodes from "currency-codes";
import TextArea from "../../../components/form/TextArea"

const DoctorProfileStep2 = ({ setStateCount }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("login");
  let { token } = useSelector((state) => state.auth);

  const [languageOptions, setLanguageOptions] = useState([]);
  const [currencies, setCurrency] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let resp = await getLanguageData(navigate);
      setLanguageOptions(resp);
    };
    fetchData();
  }, [navigate]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      aboutYourself: "",
      frame: "",
      languages: [],
      uploadFile: null,
    },
  });

  useEffect(()=>{
    const filtered = currencyCodes?.data?.filter(item => ['GBP', 'USD', 'EUR'].includes(item?.code));
    setCurrency(filtered)
  },[currencyCodes])

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedCurrency(value);
    console.log("Selected currency:", value);
    // You can do more with the value here (e.g., update form, send to API)
  };

  const goToDashboard = () => {
    setStateCount(5);
  };

  const handleBack = (event) => {
    event.preventDefault();
    setStateCount(3);
  };

  const onSubmit = async (data) => {
    try {
      // if(!data.uploadPhoto){
      //   showToast("please upload profile picture", "info");
      //   return;
      // }

           if(data.uploadPhoto){
formData.append("profile_picture", data.uploadPhoto);
      }
      let lang = data?.languages?.map((item) => item?.id);

      const formData = new FormData();
      formData.append("aboutYourself", data.aboutYourself);
      formData.append("profile_picture", data.uploadPhoto);
      formData.append("languages", JSON.stringify(lang));
      formData.append("currency", selectedCurrency);

      const response = await updateFormData("auth/update-profile/", formData);
      if (response.status === 200) {
        let responseData = await response.json();
        localStorage.setItem("user_data", JSON.stringify(responseData?.data));
        dispatch(loginSuccess(responseData?.data?.role, token));
        setStateCount(5)
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div>
      <section className="form_part space-cmn">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="signupTab">
                <div className="formArea border-radius-20 border-gray">
                  <a href="#" className="back" onClick={handleBack}>
                    <img src="images/backarrow.png" alt="Back" />{" "}
                    {t("singup.back_lable")}
                  </a>
                  <h5 className="form-head mt-4 mb-5">
                    {t("singup.Complete_Information")} <span></span>
                    {t("singup.step2")}
                  </h5>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-4">
                      {/* Upload Photo */}
                      <div className="col-md-12">
                        <label>{t("singup.upload_photo")}</label>
                        <div className="profile">
                          <FileUpload
                            src="images/sample.png"
                            name="uploadPhoto"
                            label="Upload Profile Picture"
                            control={control}
                          />
                        </div>
                      </div>

                      {/* Licenses & Certifications */}
                      {/* <div className="col-md-12">
                        <label>{t("singup.licenses_certifications")}</label>
                        <div className="fileupload">
                          <Controller
                            name="uploadFile"
                            control={control}
                            render={({ field }) => (
                              <FileUpload
                                name="uploadFile"
                                label="Upload File"
                                control={control}
                              />
                            )}
                          />
                        </div>
                      </div> */}

                      {/* About Yourself */}
                      <div className="col-md-12">
                        <label>{t("singup.about_yourself")}</label>
                        <Controller
                          name="aboutYourself"
                          control={control}
                          render={({ field }) => (
                            <TextArea
                              type="text"
                              placeholder="Your text here..."
                              {...field}
                            />
                          )}
                        />
                      </div>

                      {/* Languages */}
                      <div className="col-md-6">
                        <label>{t("singup.languages_lable")}</label>
                        <Controller
                          name="languages"
                          control={control}
                          render={({ field }) => (
                            <MultiSelectDropdown
                              options={languageOptions}
                              selectedValues={field.value}
                              onChange={(selected) =>
                                setValue("languages", selected)
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Currency</label>
                        <select
                          className="form-control border-radus-12 border-gray-300"
                          value={selectedCurrency}
                          onChange={handleChange}
                        >
                          {currencies?.map((item) => (
                            <option key={item?.code} value={item?.code}>
                              {item?.code} - {item?.currency}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Submit Button */}
                      <div className="col-md-12">
                        <button type="submit" className="black_btn">
                          {t("singup.confirm_lable")}
                        </button>
                      </div>

                      {/* Skip Button */}
                      {/* <div className="col-md-12">
                        <a href="#" className="back justify-content-end" onClick={goToDashboard}>
                          {t("singup.skip_lable")}<img src="images/frontarrow.png" alt="Next" />
                        </a>
                      </div> */}
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

export default DoctorProfileStep2;
