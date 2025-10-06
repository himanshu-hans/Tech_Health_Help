import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteData, fetchDataAuth } from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import AddSupport from "./addSupport"
import EditSupport from "./editSupport"
import ViewDocumentSupport from "./viewDocumentSupport"

const DoctorSupport = () => {
  const { t } = useTranslation();
  const [adminList, setAdminList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addDoctorModel,setAddDoctorModel]=useState(false)
  const [editSupportData,setEditSupportData]=useState(null)
  const [editDoctorModel,setEditDoctorModel]=useState(false)
  const [viewItemData,setViewItemData]=useState()
  const [viewItem,setViewItem]=useState(false)
  const [adminDataList, setAdminDataList] = useState(null);

  const fetchadminList = async () => {
    setLoading(true);

    try {
      const response = await fetchDataAuth(`user/support/`);

      if (!response.ok) throw new Error("Fetching Doctor List Failed");
      const getData = await response.json();
      setAdminList(Array.isArray(getData?.data) ? getData.data : []);
    } catch (error) {
      console.error("Fetch Doctor List Error: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchadminList();
  }, []);

  const deleteAdmin = async (items) => {
    setLoading(true);
    try {
      const payload = {
        ticket_id: items?.ticket_id,
      };
      const response = await deleteData("user/support/", payload); // Call the API service
      if (response?.status === 200) {
        setLoading(false);
        let responseData = await response.json();
        await fetchadminList();
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      setLoading(false);
      showToast(error.message, "error");
    }
  };

  const handleEditModel =(item)=>{
     setEditSupportData(item)
     setEditDoctorModel(true)
  }
const handleViewItem=(item)=>{
  setViewItemData(item)
setViewItem(true)
}

  const handleModelOpen = (items) => {
    setAdminDataList(items);
  };

  return (
    <>
      <div class="rightContent rightsidefull">
        <div class="sortSearchArea">
          <div class="search">
            <input type="search" placeholder="Search"/>
            <a href="#">
              <img src="../images/search-dark.svg" />
            </a>
          </div>
        </div>

        <div className="adminDetails padding-20 bg-white border-radius-20">
          <div className="doctorsupportadd">
            <img
              src="/images/iconamoon_folder-add-thin.svg"
              alt="Add"
              style={{ width: "40px", height: "40px" }}
              onClick={() => setAddDoctorModel(true)}
            />
          </div>
          <table className="doctoradmintable">
            <thead>
              <tr>
                <th>{t("support.support-title")}</th>
                <th>{t("add-education.description")}</th>
                <th> {t("wallet.status")}</th>
                <th>{t("support.action")}</th>
              </tr>
            </thead>
            <tbody>
              {adminList &&
                adminList.map((items) => {
                  return (
                    <tr key={items.id}>
                      <td>{items.title}</td>
                      <td>
                        {items?.description}
                      </td>
                      <td>{items?.status}</td>
                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          <div
                            className="tooltip2"
                            onClick={() => {
                              handleViewItem(items);
                            }}
                            data-tooltip="View Document"
                          >
                             <img src="../images/eye.webp" width="30px"/>
                          </div>


                          <div
                            className="tooltip2"
                            onClick={() => deleteAdmin(items)}
                            data-tooltip="Delete "
                          >
                            <img src="/images/deleteBlack.webp" />
                          </div>
                          <div
                           
                            className="tooltip2"
                            onClick={() => handleModelOpen(items)}
                            data-tooltip="Edit"
                          >
                            <img
                              src="../../images/edit-dark.svg"
                              alt="Edit Profile"
                              onClick={() => handleEditModel(items)}

                            />
                            

                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              {adminList?.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    <span>No support available</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddSupport
        addDoctorModel={addDoctorModel}
        setAddDoctorModel={setAddDoctorModel}
        fetchadminList={fetchadminList}
      />
      <EditSupport
        setEditDoctorModel={setEditDoctorModel}
        editDoctorModel={editDoctorModel}
        editSupportData={editSupportData}
        fetchadminList={fetchadminList}
      />
      <ViewDocumentSupport
        setViewItem={setViewItem}
        viewItem={viewItem}
        viewItemData={viewItemData}
      />
    </>
  );
};

export default DoctorSupport;
