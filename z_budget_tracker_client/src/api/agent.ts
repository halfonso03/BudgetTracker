import axios from "axios";
import toast from "react-hot-toast";

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});



agent.interceptors.response.use(
    async (response) => {
        // const token = localStorage.getItem('token');

        // console.log(response)

        // if (token) {

        //     console.log('here')
        //     const decodedToken = jwtDecode(token);
        //     const currentTime = Date.now() / 1000;

        //     console.log('decodedToken', decodedToken)

        //     // Check if token is expired
        //     if (decodedToken.exp! < currentTime) {
        //         // Prevent call to server & trigger refresh logic here
        //         try {
        //             const response = await agent.post('/account/refreshToken', {
        //                 refreshToken: localStorage.getItem('refreshToken'),
        //             });
        //             console.log('response', response)


        //             // console.log('newTokens', newTokens)
        //             // config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        //         } catch (refreshError) {
        //             return Promise.reject(refreshError);
        //         }
        //     } else {
        //         config.headers.Authorization = `Bearer ${token}`;
        //     }
        // }
        return response;
    },
    async (error) => {
        
        console.log('agent error', error)

        if (error.response) {
            // Handle specific HTTP error status codes globally
            switch (error.response.status) {
                case 400: {

                    toast.error(error.response.data.title)
                    break;
                }
                case 401: {

                    // const originalRequest = error.config;
                    // if (error.response?.status === 401 && !originalRequest._retry) {
                    //     originalRequest._retry = true;
                    // }

                    // try {
                    //     const response = await agent.post<{ accessToken: string }>('/account/refreshToken/webadmin');
                    //     localStorage.setItem('token', response.data.accessToken);
                    //     originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                    //     return agent(originalRequest);

                    // } catch (error) {
                    //     console.log('error', error)
                    //     return Promise.reject(error);
                    // }
                }
                    // e.g., Clear tokens and redirect to login page
                    break;
                case 403:
                    toast.error('You do not have access.');
                    break;
                case 500:
                    toast.error('Internal Server Error.');
                    break;
                default:
                    toast.error('Internal Server Error. ' + error.response.statusText);
                    console.error('An error occurred:', error.response.statusText);
            }
        }
        return Promise.reject(error)
    }
);


// agent.interceptors.request.use(
//     async (config) => {
//         const token = localStorage.getItem('token');

//         if (token) {

//             console.log('here')
//             const decodedToken = jwtDecode(token);
//             const currentTime = Date.now() / 1000;

//             console.log('decodedToken', decodedToken)

//             // Check if token is expired
//             if (decodedToken.exp! < currentTime) {
//                 // Prevent call to server & trigger refresh logic here
//                 try {
//                     const response = await agent.post('/account/refreshToken', {
//                         refreshToken: localStorage.getItem('refreshToken'),
//                     });
//                     console.log('response', response)


//                     // console.log('newTokens', newTokens)
//                     // config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
//                 } catch (refreshError) {
//                     // authContext.logout();
//                     return Promise.reject(refreshError);
//                 }
//             } else {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

export default agent;

