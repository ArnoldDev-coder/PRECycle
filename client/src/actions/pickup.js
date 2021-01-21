import axios from "axios";
import { setAlert } from "./alert";
import {
  VENDOR_LOADED,
  WASTELIST_UPDATED,
  FAIL_WASTELIST_UPDATE,
  REQUEST_CREATED,
  REQUEST_FAILED,
} from "./types";

//Load Vendors
export const loadNearbyVendors = (pincode, city) => async (dispatch) => {
  try {
    let vendors = await axios.get(`/seller/vendor/${pincode}/${city}`);
    let activeRequest = await axios.get(`/seller/active/request`);
    dispatch({
      type: VENDOR_LOADED,
      payload: vendors.data,
    });
    if(activeRequest.data.length>0){
    dispatch({
      type: REQUEST_CREATED,
      payload: activeRequest.data,
    })
  }
    // var length = vendors.data.length;
    // if (length > 0)
    //   dispatch(setAlert(`${length} Nearby Vendors Found`, "success"));
  } catch (error) {
    dispatch({
      type: VENDOR_LOADED,
    });
    // dispatch(setAlert(`We Don't Serve in Your City`, "success"));
    console.log(error.message);
  }
};

//Update rate list of vendors
export const updateWasteList = (wasteType) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = JSON.stringify({ wasteType });
    const res = await axios.put("/vendor/wastetype", data, config);
    dispatch({
      type: WASTELIST_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert("Waste List Updated", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: FAIL_WASTELIST_UPDATE,
    });
  }
};

//Create A pickup reequest
export const createRequest = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = JSON.stringify(formData);
    const res = await axios.post("/seller/request", data, config);
    dispatch({
      type: REQUEST_CREATED,
      payload: res.data,
    });
    dispatch(setAlert("Request Created Successfully!", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REQUEST_FAILED,
    });
  }
};

//Update the order status
export const updateRequest = () => async (dispatch) => {
  try {
    let activeRequest = await axios.get(`/seller/active/request`);
    if(activeRequest.data.length>0){
      dispatch({
        type: REQUEST_CREATED,
        payload: activeRequest.data,
      })
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REQUEST_FAILED,
    });
  }
}
