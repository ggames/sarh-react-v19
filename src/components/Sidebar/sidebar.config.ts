import { IconType } from "react-icons";
import { FaFileInvoiceDollar, FaUsers, FaUsersCog } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { LiaUserClockSolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiTreeStructureDuotone } from "react-icons/pi";
import { TbPasswordUser, TbReport, TbTransformFilled } from "react-icons/tb";
import { VscLibrary } from "react-icons/vsc";


export interface ISidebarItem {
  name: string;
  path: string;
  icon: IconType; // Use the correct type for your icon
  items?: ISubItem[]; // Nested items
}

interface ISubItem {
  name: string;
  path: string;
}

// ========  Menu ONLY CONSULT =============
export const onlyConsultItems: ISidebarItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: LuLayoutDashboard,
  },
  {
    name: 'Usuarios',
    path: "/usuarios",
    icon: FaUsers
  },
  {
    name: "Configuracion Paritaria",
    path: "/puntos",
    icon: FaFileInvoiceDollar
  },
  {
    name: "Agentes",
    path: "/agentes/all",
    icon: FaUsersCog,
  },
  {
    name: "Cargos",
    path: "/cargos/all",
    icon: GrUserWorker,
  },
  {
    name: "Planta de cargos",
    path: "/plantas",
    icon: LiaUserClockSolid,
  },
  {
    name: "Transformación",
    path: "/transformaciones",
    icon: TbTransformFilled
  },
  {
    name: "Departamento",
    path: "/departamento",
    icon: PiTreeStructureDuotone

  },
  {
    name: 'Materias',
    path: '/materias',
    icon: VscLibrary
  },

  {
    name: "Cambiar Contraseña",
    path: "/change",
    icon: TbPasswordUser
  },
    {
      name: "Informes",
      path: "/settings",
      icon: TbReport,
      items: [
        {
          name: "De planta",
          path: "/reporte-plantas",
        },
       
      ],
    },
];

export const developerItems: ISidebarItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: LuLayoutDashboard,
  },
  {
    name: 'Usuarios',
    path: "/usuarios",
    icon: FaUsers
  },
  {
    name: "Administrador Contraseña",
    path: "/resetpassword",
    icon: TbPasswordUser
  },
  {
    name: "Cambiar Contraseña",
    path: "/change",
    icon: TbPasswordUser
  },
];

// ========  Menu ADMIN  ============
export const adminItems: ISidebarItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: LuLayoutDashboard,
  },
  {
    name: 'Usuarios',
    path: "/usuarios",
    icon: FaUsers
  },
  {
    name: "Configuracion Paritaria",
    path: "/puntos",
    icon: FaFileInvoiceDollar
  },
  {
    name: "Administrador Contraseña",
    path: "/resetpassword",
    icon: TbPasswordUser
  },
  {
    name: "Cambiar Contraseña",
    path: "/change",
    icon: TbPasswordUser
  },
];

// ========  Menu USER  ============
export const userItems: ISidebarItem[] =
  [

    {
      name: "Dashboard",
      path: "/",
      icon: LuLayoutDashboard,
    },
    {
      name: "Cambiar Contraseña",
      path: "/change",
      icon: TbPasswordUser
    },
    {
      name: "Agentes",
      path: "/agentes/all",
      icon: FaUsersCog,
    },
    {
      name: "Cargos",
      path: "/cargos/all",
      icon: GrUserWorker,
    },
    {
      name: "Planta de cargos",
      path: "/plantas",
      icon: LiaUserClockSolid,
    },
    {
      name: "Transformación",
      path: "/transformaciones",
      icon: TbTransformFilled
    },
    {
      name: "Departamento",
      path: "/departamento",
      icon: PiTreeStructureDuotone

    },
    {
      name: 'Materias',
      path: '/materias',
      icon: VscLibrary
    },
    {
      name: "Informes",
      path: "/settings",
      icon: TbReport,
      items: [
        {
          name: "De planta",
          path: "/reporte-plantas",
        },
        {
          name: "Security",
          path: "/settings/security",
        },
        {
          name: "Notifications",
          path: "/settings/notifications",
        },
      ],
    },
  ];

