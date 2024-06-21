import ApiBase from './core/ApiBase';

export default class RestApi extends ApiBase {
    public async logout(refreshToken: string) {
        return this.post<any>(`/api/admin/logout`, { refreshToken });
    }

    public async verifyToken(accessToken: string) {
        return this.post<any>(`/api/admin/verify-tokens`, { accessToken });
    }

    public async refreshToken(refreshToken: string) {
        return this.post<any>(`/api/admin/refresh-tokens`, { refreshToken });
    }

    public async getUserDetails() {
        return this.get<any>(`/api/admin/details`);
    }

    public async dashboard(options) {
        return this.post<any>(`/api/admin/dashboard`, options);
    }

    public async quizOverview(options: object = {}) {
        return this.post<any>(`/api/admin/quiz-overview`, options);
    }

    public async masquerade(mobile: string) {
        return this.get<any>(`/api/admin/masquerade/${mobile}`);
    }

    public async btnRequest(url: string) {
        return this.get<any>(url);
    }

    public async btnRequestPost(url: string, field: object) {
        return this.post<any>(url, field);
    }

    public async getFormFields(page: string) {
        return this.get<any>(`/api/admin/${page}/form-fields`);
    }

    public async getEntries(page: string, field: object) {
        return this.post<any>(`/api/admin/${page}/entries`, field);
    }

    public async getOptions(page: string, field: object) {
        return this.post<any>(`/api/admin/${page}/options`, field);
    }

    public async createEntry(page: string, field: object, filters: string[]) {
        const fields = await this.bodyData(field);
        return this.post<any>(`/api/admin/${page}/add?filters=${JSON.stringify(filters)}`, fields);
    }

    public async updateEntry(page: string, id: string, field: object, filters: string[]) {
        const fields = await this.bodyData(field);
        return this.put<any>(`/api/admin/${page}/edit/${id}?filters=${JSON.stringify(filters)}`, fields);
    }

    public async deleteEntry(page: string, id: string) {
        return this.delete(`/api/admin/${page}/delete/${id}`);
    }

    public async importEntries(page: string, field: object) {
        const fields = await this.bodyData(field);
        return this.post<any>(`/api/admin/${page}/import`, fields);
    }

    public async uploadFileFromEditor(fileInfo: { name: string, type: string, size: number, value: string }) {
        return this.post<any>(`/api/admin/uploadFile`, { fileInfo });
    }

    private async bodyData(field: object) {
        await Promise.all(Object.keys(field).map(async (val, key) => {
            if(typeof field[val] === 'object' && field[val].name && (field[val]?.contentType || '').toLowerCase() !== 'json') {
                field[val] = {
                    name: field[val].name,
                    type: field[val].type,
                    size: field[val].size,
                    value: await this.blobToData(field[val])
                }
            }
        }));
        return field;
    }

    private blobToData(blob: Blob) {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
    }
}
