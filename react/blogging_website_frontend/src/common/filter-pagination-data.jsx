import axios from "axios";
export const filterPaginationData = async({create_new_arr = false, state, data, page, countRoute, data_to_send}) => {

    let obj;
    // If state exists and we don't need to create a new array
    if(state != null && !create_new_arr){
        // Append new data to the existing results array
        obj = { ...state, results: [...state.results, ...data], page: page }
    }
    else{
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send)
        .then(({ data: { totalDocs } }) => {
            // Create a new object with results, current page, and totalDocs
            obj = { results: data, page: 1, totalDocs };
          })
          .catch(err => {
            console.log(err); // Log errors if the request fails
          });
    }

    return obj;
}