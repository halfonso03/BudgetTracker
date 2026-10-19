import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});


const sleep = (delay: number) =>
    new Promise((resolve) => setTimeout(resolve, delay));


agent.interceptors.request.use(async (config) => {
    // store.uiStore.isBusy();

    if (import.meta.env.DEV) {
        await sleep(250);
    }
    return config;
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
        const navigate = useNavigate();

        if (error.response) {
            // Handle specific HTTP error status codes globally
            switch (error.response.status) {
                case 400: {

                    // const data = {
                    //     response: {
                    //         type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
                    //         title: 'One or more validation errors occurred.',
                    //         status: 400,
                    //         errors: { Justification: ['The Justification field is required.'] },
                    //         traceId: '00-4dc566c61390943cdbf90037d2bb1038-dd38a36cfb784cb1-00'
                    //     },
                    //     status: 400,
                    //     statusText: '',
                    //     headers: {
                    //         'content-type': 'application/problem+json; charset=utf-8'
                    //     }
                    // }



                    // console.log('error', error)

                    if (error.response.data) {
                        toast.error(error.response.data, { duration: 2000 })

                    }
                    else if (error.response) {
                        toast.error(error.response, { duration: 2000 })
                    }
                    break;
                }
                case 401: {
                    
                    console.log('123', 123)

                    navigate("/login")
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

