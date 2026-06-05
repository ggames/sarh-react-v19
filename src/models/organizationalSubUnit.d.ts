//import { OrganizationalUnitWithId } from "./organizationalUnit";

export interface OrganizationalSubUnit {
  
  nameSubUnit: string;
  guaraniCode?: string; 
  organizationalUnit: OrganizationalUnitWithId;

}

export interface OrganizationalSubUnitWithId extends OrganizationalSubUnit {
  id: number;
}

export interface OrganizationalSubUnitDto {
  id: number;
  nameSubUnit: string;
  guaraniCode?: string;
  nameUnit: string;
 
}