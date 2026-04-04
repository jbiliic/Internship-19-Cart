import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
} from 'axios';

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export type ApiResult<T> =
    | { data: T; error: null }
    | { data: null; error: string };

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.SERVER_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

function extractError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse<any>>;

        const res = axiosError.response?.data;

        if (res) {
            return res.message || 'Request failed';
        }

        return axiosError.message;
    }

    if (error instanceof Error) return error.message;

    return 'Unexpected error';
}
async function apiWrapper<T>(
    request: Promise<{ data: ApiResponse<T> }>
): Promise<ApiResult<T>> {
    try {
        const response = await request;

        return {
            data: response.data.data,
            error: null,
        };
    } catch (err) {
        const message = extractError(err);
        console.error('[API ERROR]:', message);

        return {
            data: null,
            error: message,
        };
    }
}

function request<T>(
    config: AxiosRequestConfig
): Promise<ApiResult<T>> {
    return apiWrapper<T>(axiosInstance.request<ApiResponse<T>>(config));
}

const client = {
    request,

    get: <T>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'GET', url }),

    post: <T, B = unknown>(
        url: string,
        data?: B,
        config?: AxiosRequestConfig
    ) =>
        request<T>({ ...config, method: 'POST', url, data }),

    put: <T, B = unknown>(
        url: string,
        data?: B,
        config?: AxiosRequestConfig
    ) =>
        request<T>({ ...config, method: 'PUT', url, data }),

    patch: <T, B = unknown>(
        url: string,
        data?: B,
        config?: AxiosRequestConfig
    ) =>
        request<T>({ ...config, method: 'PATCH', url, data }),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'DELETE', url }),

    instance: axiosInstance,
};

export default client;