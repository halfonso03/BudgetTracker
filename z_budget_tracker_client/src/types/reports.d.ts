type ReportParameter2 = {
    id: number,
    name: string,
    label: string
    sortOrder: number
    controlType: string
    dependsOn: string
}

type Report2 = {
    id: number,
    name: string,
    path: string,
    categoryId: number,
    enabled: boolean,
    parameters: ReportParameter2[],
    downloadFilename: string
}

type ReportParameterValue = {
    id: number,
    text: number
}

type ParameterSelections = {
    name: string;
    value?: string;
    values?: string[];
};

type ParameterDependency = {
    parameterName: string;
    dependentParameterName: string;
    value: string;
};

type ParameterQueryResult = {} & UseQueryResult<
    {
        parameterName: string;
        controlType: string;
        dependsOn: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any;
    },
    Error
>;

type RunReportRequest = {
    path: string,
    reportId: number
    reportExportFormat: number
    fileName: string
    parameters: RunReportParameterRequest[]
}

type RunReportParameterRequest = {
    name: string,
    value: string
}
