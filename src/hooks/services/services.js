import { API_BASE_URL } from "./apiUrl";
import { API_URL } from "./apiUrl";

// GET request
export const fetchData = async (endpoint, navigate) => {
  try {
    let token = localStorage.getItem('user_token')
    if (!token) {
      navigate("/login"); // Redirect user when API error occurs
      return
    }
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const errorDetails = await response?.json();
      const errorMessages = Object.values(errorDetails).flat();
      if (errorDetails?.code == "token_not_valid") {
        navigate("/login"); // Redirect user when API error occurs
      }
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


export const fetchDataAuth = async (endpoint, navigate) => {
  try {
    let token = localStorage.getItem('user_token')
    if (!token) {
      navigate("/login"); // Redirect user when API error occurs
      return
    }
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorDetails = await response?.json();
      const errorMessages = Object.values(errorDetails).flat();
      if (errorDetails?.code == "token_not_valid") {
        navigate("/login"); // Redirect user when API error occurs
      }
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchFitbitDataAuth = async (endpoint, navigate, token) => {
  try {
    let token = localStorage.getItem('access_token1')
    if (!token) {
      navigate("/login"); // Redirect user when API error occurs
      return
    }
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
    });

    if (!response.ok) {
      const errorDetails = await response?.json();
      const errorMessages = Object.values(errorDetails).flat();
      if (errorDetails?.code == "token_not_valid") {
        navigate("/login"); // Redirect user when API error occurs
      }
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchAdminData = async (endpoint, navigate) => {
  try {
    let token = localStorage.getItem('user_token')
    if (!token) {
      navigate("/superadmin/login"); // Redirect user when API error occurs
      return
    }
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorDetails = await response?.json();
      const errorMessages = Object.values(errorDetails).flat();
      if (errorDetails?.code === "token_not_valid") {
        navigate("/superadmin/login"); // Redirect user when API error occurs
      }
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// GET data without token
export const fetchDataPublic = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorDetails = await response?.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


// POST request with token
// export const postData = async (endpoint, body) => {
//   let token = localStorage.getItem('user_token')
//   console.log(">>>>>>>>>>>token-post A", token)
//   try {
//     const response = await fetch(`${API_URL}/${endpoint}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(body),
//     });
//     if (!response.ok) {
//       const errorDetails = await response.json();
//       const errorMessages = Object.values(errorDetails).flat();
//       throw new Error(errorMessages[0]);
//     }
//     return response;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

export const postData = async (endpoint, body) => {
  let token = localStorage.getItem('user_token');
  console.log(">>>>>>>>>>>token-post A", token);

  try {
    const isFormData = body instanceof FormData;

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }), 
        
      },
      body: isFormData ? body : JSON.stringify(body), 
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// POST request with token
export const updateFormData = async (endpoint, body) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: body,
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// POST request with token
export const updateData = async (endpoint, body,contentType=null) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': contentType || 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body,
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const putData = async (endpoint, body) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      if(errorMessages[0] != "Device token already exists."){
        throw new Error(errorMessages[0]);
      }
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const putFormData = async (endpoint, body) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: body
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


export const patchFormData = async (endpoint, body) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: body
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const deleteData = async (endpoint,payload) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const deactivateData = async (endpoint) => {
  let token = localStorage.getItem('user_token');
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PATCH', // PATCH for partial updates like deactivation
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_active: false }) // Assuming 'is_active' is the deactivation flag
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


// POST request without token
export const postRequest = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const updateApointmentData = async (endpoint, body) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};



// Delete Resource without sending payload
export const deleteEntry = async (endpoint) => {
  const token = localStorage.getItem("user_token");

  try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          method: "DELETE",
          headers: {
              "Authorization": `Bearer ${token}`
          }
      });

      if (!response.ok) {
          const errorDetails = await response.json();
          const errorMessages = Object.values(errorDetails).flat();
          throw new Error(errorMessages[0] || "Failed to delete data");
      }

      return response;
  } catch (error) {
      console.error("API Error:", error);
      throw error;
  }
};


export const AddFormData = async (endpoint, body) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: body,
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const EditFormData = async (endpoint, body) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUt',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: body,
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }

};
export const deleteWithPayload = async (endpoint,payload) => {
  let token = localStorage.getItem('user_token')
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      const errorMessages = Object.values(errorDetails).flat();
      throw new Error(errorMessages[0]);
    }
    return await response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};