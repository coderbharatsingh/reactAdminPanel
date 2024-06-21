
export interface IEduleteApi {
    getResult(method: any): Promise<any>;
    
    logout(): Promise<any>;

    verifyToken(): Promise<any>;

    refreshToken(): Promise<any>;

    getUserDetails(): Promise<any>;

    dashboard(options?: object): Promise<any>;

    quizOverview(options: object): Promise<any>;

    masquerade(mobile: string): Promise<any>;

    btnRequest(url: string): Promise<any>;
    
    btnRequestPost(url: string, field: object): Promise<any>;
    
    getFormFields(page: string): Promise<any>;

    getEntries(page: string, field: object): Promise<any>;

    getOptions(page: string, field: object): Promise<any>;

    createEntry(page: string, field: object, filters: string[]): Promise<any>;

    updateEntry(page: string, id: string, field: object, filters: string[]): Promise<any>;
    
    deleteEntry(page: string, id: string): Promise<any>;
    
    importEntries(page: string, field: object): Promise<any>;

    uploadFileFromEditor(fileInfo: { name: string, type: string, size: number, value: string }): Promise<any>;
}
