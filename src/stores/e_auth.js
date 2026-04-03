import { defineStore } from 'pinia';

export const useEAuthStore = defineStore('eAuth', {
state: () => ({
    isLoggedIn: false,
    employeeId: null,
    role:null,
}),
actions: {
    initializeAuth() {
    const savedEmployeeId = localStorage.getItem("employeeId");
    this.isLoggedIn = !!savedEmployeeId;
    this.employeeId = savedEmployeeId;
    this.role=null;
    },
    setEmployee(employee) {
    this.employeeId = employee.employeeId;
    this.isLoggedIn = true;
    this.role=employee.role
    localStorage.setItem("employeeId", employee.employeeId);
    localStorage.setItem("role", employee.role);
    localStorage.setItem("isLoggedIn","true");
    },
    logout() {
    this.isLoggedIn = false;
    this.employeeId = null;
    this.role=null;
    localStorage.removeItem("employeeId");
    localStorage.removeItem("role");
    localStorage.setItem("isLoggedIn","false");
    },
    loadAuth() {
        const storedIsLog = localStorage.getItem("isLoggedIn") === "true"; // 轉換為 boolean
        const storedEmployeeId = localStorage.getItem("employeeId");
        const storedRole = localStorage.getItem("role");
        if (storedIsLog) {
            this.isLoggedIn = storedIsLog;
            this.employeeId = storedEmployeeId;
            this.role = storedRole;
        }
} 
},
});
