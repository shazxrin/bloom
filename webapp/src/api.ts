import axios from "axios";

export interface APICreateCurrentTask {
    name: string;
    categoryId: string;
    duration: number;
}

export interface APICurrentTask {
    name: string;
    categoryId: string;
    duration: number;
    remainingDuration: number;
    isPaused: boolean;
    startTime: string;
    lastStartTime: string;
}

export interface APIListCategory {
    id: string;
    name: string;
    color: string;
}

export interface APICreateCategory {
    name: string;
    color: string;
}

export function apiGetCurrentTask() {
    return axios.get<APICurrentTask>("/api/task/current");
}

export function apiPostCreateTask(data: APICreateCurrentTask) {
    return axios.post<APICreateCurrentTask>("/api/task/current/create", data);
}

export function apiPostPauseTask() {
    return axios.post("/api/task/current/pause");
}

export function apiPostResumeTask() {
    return axios.post("/api/task/current/resume");
}

export function apiPostEndTask() {
    return axios.post("/api/task/current/end");
}

export function apiGetAllCategory() {
    return axios.get<APIListCategory[]>("/api/category/all");
}

export function apiPostCreateCategory(data: APICreateCategory) {
    return axios.post<APICreateCategory>("/api/category", data);
}
