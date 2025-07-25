import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    user: null,
    isSuccess:false
  }),
  actions: {
    async fetchCurrentUser() {
      const getCurrentUserInfo = async () => {
        // Make an API call to get the current user info.
        try {
          let response = await api.get("\\api/v1.0/users/current_user/info");
          return response.data;
        } catch (error) {
          console.error("Error:", error);
        }

        return null;
      };

      this.user = await getCurrentUserInfo();
      this.isLoggedIn = !!this.user;
    },
    async logout() {
      // Remove the cookie: 'session_id' from the browser.
      document.cookie =
        "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
      // Clear the user info and set the isLoggedIn to false.
      this.isLoggedIn = false;
      this.user = null;
      const logoutApi = async () => {
        const controller = new AbortController(); // Create an AbortController instance
        const { signal } = controller; // Get the signal to attach to the request
        // Set a timeout (e.g., 10 seconds)
        const timeout = setTimeout(() => {
          controller.abort(); // Abort the request after the timeout
        }, 90000); 
      
        try {
          await api.post("\\api/v1.0/users/logout", {}, { signal });
          this.isSuccess=true
          clearTimeout(timeout); // Clear the timeout if the API call is successful
        } catch (error) {
          clearTimeout(timeout); // Clear the timeout if an error occurs
        if (!error.response) {
          this.isSuccess = false;
          console.error("The backend is not reachable.");
        } else {
          console.error("Logout failed due to: ");
        }
          return error;
        }
      };
      await logoutApi();
    }
  }
  
});
