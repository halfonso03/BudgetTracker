// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from "@tanstack/react-query";
import budgets from "../../sample_data/budget";
// import agent from "../agent";


const fetchBudget = async (): Promise<Budget> => {

    // const response = await agent.get<Role[], any, {}>("/groups", {
    //     params: {
    //         "filter": filter.trim()
    //     },
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // });

    // return response.data

    return new Promise((resolve) => {
        setTimeout(() => {
            const result = budgets
            resolve(result);
        }, 300); // Simulates 1.5 seconds of network delay
    });
};



const useBudget = () => {


    const { data, isLoading } = useQuery<Budget>({
        queryKey: ['budget'],
        queryFn: fetchBudget,
    })

    return { data, isLoading }
}


export default useBudget;