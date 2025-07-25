import { defineStore } from "pinia";
import { api } from "boot/axios";



export const institionListStore = defineStore('institionList',{
    state:()=>({
     institionList:[],
     count:null,
     pageSizeNew:null,
     isFetching : false, 
     selectedOrganization: null,
     pagination: JSON.parse(localStorage.getItem("pagination")) || {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    
    }),
    actions:{

  // Global or class-level flag

      async updateInstition(institutionType = "", selectedEnabled = "", searchValue = "", pageCount = 1, pageSize = 10) {
        if (this.isFetching) return; // Prevent duplicate API calls
        this.isFetching = true; // Set the flag to true before starting the API call
      
        try {
          let response = await api.post("/api/v1.0/organization/list", {
            pagination: {
              pageCount: pageCount,
              pageSize: pageSize,
            },
            filters: {
              institutionType: institutionType,
              status: selectedEnabled,
              search: searchValue,
            },
          });
      
          this.institionList = response.data.Organizations;
      
          this.count = response.data.Count;
          this.pagination.page = response.data.Pagination.PageCount;
          this.pagination.rowsPerPage = response.data.Pagination.PageSize;
          this.pagination.rowsNumber = response.data.Pagination.TotalRecords;
          return true;
        } catch (error) {
          console.error("Error:", error);
          return false;
        } finally {
          this.isFetching = false; // Reset the flag after the API call completes
        }
      },
async setPagination(pageCount,pageSize,rowsNumber){
  this.pagination= {
    page: pageCount,
    rowsPerPage: pageSize,
    rowsNumber: rowsNumber,
  }
  localStorage.setItem("pagination", JSON.stringify(this.pagination));
},
        setSelectedOrganization(organization) {
          this.selectedOrganization = organization;
        },
        clearPagination() {
          localStorage.removeItem("pagination");
          this.pagination = {   page: 1,
            rowsPerPage: 10,
            rowsNumber: 0, }; // Reset to default
        }
    },
   
})