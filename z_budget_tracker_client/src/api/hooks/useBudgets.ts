// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from "@tanstack/react-query";
import budgets from "../../sample_data/budgets";
// import agent from "../agent";


const fetchBudget = async (initiativeId: number, grantId: number): Promise<Budget> => {

    // const response = await agent.get<Role[], any, {}>("/groups", {
    //     params: {
    //         "filter": filter.trim()
    //     },
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // });

    // return response.data

    const budget = budgets.filter(x => x.initiative_id == initiativeId && x.grant_id == grantId);

    return new Promise((resolve, reject) => {

        setTimeout(() => {
            if (budget && budget.length === 1) {
                resolve(budget[0]);

            } else {
                reject('Budget not found')
            }
        }, 300);
    });
};



const useBudget = (initiatveId: number, grantId: number) => {


    const { data, isLoading } = useQuery<Budget>({
        queryKey: ['budget', initiatveId, grantId],
        queryFn: () => fetchBudget(initiatveId, grantId),
    })

    return { data, isLoading }
}


export default useBudget;