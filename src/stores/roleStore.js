// stores/roleStore.js
import { defineStore } from "pinia";

export const roleStore = defineStore('InstitutionLayout',{
    state:()=>({
        selectedRole: [],
        roleStatus:""
         }),
         actions:{
          
          setRoles(roleArray) {
              this.selectedRole = Array.isArray(roleArray) ? roleArray : [];
             },
             setRoleStatus(roleStatus) {
                this.roleStatus = roleStatus ? roleStatus : "";
               },
         },
   
   
})