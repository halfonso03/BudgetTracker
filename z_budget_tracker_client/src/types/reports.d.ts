type ReportParameter2 = {
    id: number,
    name: string,
    label: string
    sortOrder: number
    controlType: string
    dependsOn:string
}

type Report2 = {
    id: number,
    name: string,
    path: string,
    categoryId: number,
    enabled: boolean,
    parameters: ReportParameter2[]
}

type ReportParamterValue = {
    id: number,
    text: number
}