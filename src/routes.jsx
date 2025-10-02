import { TiHomeOutline } from "react-icons/ti";
import {
  MdDashboardCustomize,
  MdAttachMoney,
  MdReceiptLong,
  MdList,
  MdHistory,
  MdAccessTime,
  MdAccessTimeFilled,
  MdBeachAccess,
  MdUmbrella,
  MdToday,
  MdFactCheck,
  MdEventBusy,
  MdRedeem,
  MdListAlt,
  MdPersonAddAlt,
  MdAssignmentTurnedIn,
  MdDescription,
  MdSummarize,
  MdCloudUpload,
  MdMenuBook,
  MdEventNote,
  MdCalendarMonth,
  MdSettingsApplications,
  MdBusiness,
  MdCorporateFare,
  MdStore,
  MdAccountTree,
  MdWork,
  MdAccountBalance,
  MdFunctions,
  MdSwapHoriz,
  MdLocationCity,
  MdGroups,
  MdPerson,
  MdWc,
  MdPublic,
  MdAccessible,
  MdBadge,
  MdAssignmentInd,
  MdHealthAndSafety,
  MdLocalHospital,
  MdSecurity,
  MdPolicy,
  MdSavings,
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdPercent,
  MdFamilyRestroom,
  MdCardGiftcard,
  MdCategory,
  MdSchedule,
  MdFlag,
  MdAddCard,
  MdBalance,
  MdLabel,
  MdCalculate,
  MdRemoveCircle,
  MdShowChart,
  MdGavel,
  MdChecklist,
  MdCalendarToday,
  MdEventAvailable,
  MdFlagCircle,
  MdReportProblem,
  MdTune,
  MdAttachMoney as MdAttachMoney2, // para diferenciar si quieres, puedes omitir si no se repite
  MdConfirmationNumber
} from "react-icons/md";

import Home from "./pages/home/Home";
import Empleado from "./pages/maestros/empleados/Empleado";
import GenericMaster from "./pages/maestros/generic_master/GenericMaster";

const getRoutes = ({ profile }) => {
  const routesw = [
    {
      type: "menu",
      key: "sistema",
      label: "Sistema",
      icon: TiHomeOutline,
      insideBar: true,
      children: [
        {
          component: Empleado,
          type: "route",
          path: "/maestros/empleados",
          label: "Empleados",
          icon: TiHomeOutline,
          insideBar: true,
        },
      ],
    },
    {
      type: "menu",
      key: "maestros",
      label: "Maestros",
      icon: TiHomeOutline,
      insideBar: true,
      children:[
        {
          type: "menu",
          key: "mrEmpresa",
          label: "Empresa",
          icon: TiHomeOutline,
          insideBar: true,
          children:[
            {
              component: GenericMaster,
              type: "route",
              path: "/maestros/empresa",
              label: "Empresa",
              icon: TiHomeOutline,
              props: {
                pk: "rut_empresa",
                path: "gm/empresa",
                title: "Empresa",
                title_plural: "Empresas",
              },
              insideBar: true,
            },
            {
              component: GenericMaster,
            type: "route",
            path: "/maestros/centros_costo",
            label: "Centros de Costo",
            icon: TiHomeOutline,
            props: {
              pk: "cod_centro_costo",
              path: "gm/centro_costo",
              title: "Centro de Costo",
              title_plural: "Centros de Costo",
            },
            insideBar: true,
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/maestros/cargos",
            label: "Cargos",
            icon: TiHomeOutline,
            props: {
              pk: "cod_cargo",
              path: "gm/cargo",
              title: "Cargo",
              title_plural: "Cargos",
            },
            insideBar: true,
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/maestros/tipo_contrato",
            label: "Tipo Contrato",
            icon: TiHomeOutline,
            props: {
              pk: "cod_tipo_contrato",
              path: "gm/tipo_contrato",
              title: "Tipo Contrato",
              title_plural: "Tipos de Contrato",
            },
            insideBar: true,
          },
        ]
      },
      {
          type: "menu",
          key: "mrPrevisionales",
          label: "Previsionales",
          icon: TiHomeOutline,
          insideBar: true,
          children:[
            {
              component: GenericMaster,
              type: "route",
              path: "/maestros/salud",
              label: "Salud",
              icon: TiHomeOutline,
              props: {
                pk: "cod_salud",
                path: "gm/salud",
                title: "Salud",
                title_plural: "Intituciones de Salud",
              },
              insideBar: true,
            },
            {
              component: GenericMaster,
              type: "route",
              path: "/maestros/leyes_sociales",
              label: "Leyes Sociales",
              icon: TiHomeOutline,
              props: {
                pk: "cod_contantes",
                path: "gm/constantes",
                title: "LS",
                title_plural: "Leyes Sociales",
              },
              insideBar: true,
            },
            {
              component: GenericMaster,
              type: "route",
              path: "/maestros/tope_asignacion",
              label: "Asignacion Familiar",
              icon: TiHomeOutline,
              props: {
                pk: "cod_tope_asignacion",
                path: "gm/tope_asignacion",
                title: "Asignacion Familiar",
                title_plural: "Asignaciones Fam",
              },
              insideBar: true,
            },
          ]
      },
      {
          type: "menu",
          key: "mrConf",
          label: "Configuración",
          icon: TiHomeOutline,
          insideBar: true,
          children:[
            {
              component: GenericMaster,
              type: "route",
              path: "/maestros/lre",
              label: "Libro Remuneraciones Electrónico",
              icon: TiHomeOutline,
              props: {
                pk: "cod_lre",
                path: "gm/lre",
                title: "Libro Remuneraciones Electrónico",
                title_plural: "Libros Remuneraciones Electrónicos",
              },
              insideBar: true,
            },
            {
              component: GenericMaster,
              type: "route",
              path: "/maestros/tipo_hd",
              label: "Tipo Haber Descuento",
              icon: TiHomeOutline,
              props: {
                pk: "cod_tipo_h_d",
                path: "gm/tipo_h_d",
                title: "Tipo Haber Descuento",
                title_plural: "Tipos Haber Descuento",
              },
              insideBar: true,
            },
            {
              component: GenericMaster,
              type: "route",
              path: "/maestros/haber_descuento",
              label: "Haber Descuento",
              icon: TiHomeOutline,
              props: {
                pk: "cod_haberes_descuentos",
                path: "gm/haberes_descuentos",
                title: "Haber Descuento",
                title_plural: "Haberes y Descuentos",
              },
              insideBar: true,
            }
          ]
      },
    ]
  },
  {
    type: "menu",
      key: "maestros2",
      label: "Maestros2",
      icon: TiHomeOutline,
      insideBar: true,
      children: [
        ,
        
        ,
        
        
      ],
    },
  ];
  const routes = [
  /* ===========================
   *        SISTEMA
   * =========================== */
  {
    type: "menu",
    key: "sistema",
    label: "Sistema",
    icon: MdDashboardCustomize,
    insideBar: true,
    children: [
      /* Remuneraciones */
      {
        type: "menu",
        key: "smRemuneraciones",
        label: "Remuneraciones",
        icon: MdAttachMoney,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/liquidacion",
            label: "Liquidaciones",
            icon: MdReceiptLong,
            props: {
              path: "gm/liquidacion",
              title: "Liquidación",
              title_plural: "Liquidaciones"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/detalle_liquidacion",
            label: "Detalle de Liquidación",
            icon: MdList,
            props: {
              path: "gm/detalle_liquidacion",
              title: "Detalle de Liquidación",
              title_plural: "Detalles de Liquidación",
              meta: { detailOf: "liquidacion" }
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/empleado_h_d",
            label: "Mov. Haberes/Descuentos",
            icon: MdHistory,
            props: {
              path: "gm/empleado_h_d",
              title: "Movimiento H/D",
              title_plural: "Movimientos H/D"
            },
            insideBar: true
          }
        ]
      },

      /* Horas Extras */
      {
        type: "menu",
        key: "smHorasExtras",
        label: "Horas Extras",
        icon: MdAccessTime,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/horas_extras",
            label: "Horas Extras",
            icon: MdAccessTimeFilled,
            props: {
              path: "gm/horas_extras",
              title: "Hora Extra",
              title_plural: "Horas Extras"
            },
            insideBar: true
          }
        ]
      },

      /* Vacaciones y Ausencias */
      {
        type: "menu",
        key: "smVacacionesAusencias",
        label: "Vacaciones y Ausencias",
        icon: MdBeachAccess,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/vacaciones",
            label: "Vacaciones",
            icon: MdUmbrella,
            props: {
              path: "gm/vacaciones",
              title: "Vacación",
              title_plural: "Vacaciones"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/dias_vacaciones",
            label: "Días de Vacaciones",
            icon: MdToday,
            props: {
              path: "gm/dias_vacaciones",
              title: "Día de Vacación",
              title_plural: "Días de Vacación",
              meta: { detailOf: "vacaciones" }
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/detalle_dias_vacaciones",
            label: "Detalle Días de Vacaciones",
            icon: MdFactCheck,
            props: {
              path: "gm/detalle_dias_vacaciones",
              title: "Detalle Día Vacación",
              title_plural: "Detalle Días Vacación",
              meta: { detailOf: "vacaciones" }
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/ausencias",
            label: "Ausencias",
            icon: MdEventBusy,
            props: {
              path: "gm/ausencias",
              title: "Ausencia",
              title_plural: "Ausencias"
            },
            insideBar: true
          }
        ]
      },

      /* Beneficios */
      {
        type: "menu",
        key: "smBeneficios",
        label: "Beneficios",
        icon: MdRedeem,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/entrega_beneficio",
            label: "Entregas de Beneficios",
            icon: MdCardGiftcard,
            props: {
              path: "gm/entrega_beneficio",
              title: "Entrega de Beneficio",
              title_plural: "Entregas de Beneficios"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/detalle_entrega_beneficio",
            label: "Detalle Entrega Beneficio",
            icon: MdListAlt,
            props: {
              path: "gm/detalle_entrega_beneficio",
              title: "Detalle Entrega",
              title_plural: "Detalles de Entrega",
              meta: { detailOf: "entrega_beneficio" }
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/empleado_beneficio",
            label: "Beneficios por Empleado",
            icon: MdPersonAddAlt,
            props: {
              path: "gm/empleado_beneficio",
              title: "Beneficio de Empleado",
              title_plural: "Beneficios de Empleado"
            },
            insideBar: true
          }
        ]
      },

      /* Finiquitos */
      {
        type: "menu",
        key: "smFiniquitos",
        label: "Finiquitos",
        icon: MdAssignmentTurnedIn,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/detalle_finiquito",
            label: "Finiquitos (Detalle)",
            icon: MdDescription,
            props: {
              path: "gm/detalle_finiquito",
              title: "Finiquito",
              title_plural: "Finiquitos"
            },
            insideBar: true
          }
        ]
      },

      /* Declaraciones y Reportes */
      {
        type: "menu",
        key: "smDeclaracionesReportes",
        label: "Declaraciones y Reportes",
        icon: MdSummarize,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/previred",
            label: "Previred",
            icon: MdCloudUpload,
            props: {
              path: "gm/previred",
              title: "Previred",
              title_plural: "Previred"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/lre",
            label: "Libro de Remuneraciones (LRE)",
            icon: MdMenuBook,
            props: {
              path: "gm/lre",
              title: "Libro de Remuneraciones",
              title_plural: "Libros de Remuneraciones"
            },
            insideBar: true
          }
        ]
      },

      /* Períodos y Contabilidad */
      {
        type: "menu",
        key: "smPeriodosContables",
        label: "Períodos y Contabilidad",
        icon: MdEventNote,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/periodo_contable",
            label: "Períodos Contables",
            icon: MdCalendarMonth,
            props: {
              path: "gm/periodo_contable",
              title: "Período Contable",
              title_plural: "Períodos Contables"
            },
            insideBar: true
          }
        ]
      }
    ]
  },

  /* ===========================
   *         MAESTROS
   * =========================== */
  {
    type: "menu",
    key: "maestros",
    label: "Maestros",
    icon: MdSettingsApplications,
    insideBar: true,
    children: [
      /* Empresa y Organización */
      {
        type: "menu",
        key: "mrEmpresa",
        label: "Empresa y Organización",
        icon: MdBusiness,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/empresa",
            label: "Empresa",
            icon: MdCorporateFare,
            props: {
              path: "gm/empresa",
              title: "Empresa",
              title_plural: "Empresas"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/sucursal",
            label: "Sucursales",
            icon: MdStore,
            props: {
              path: "gm/sucursal",
              title: "Sucursal",
              title_plural: "Sucursales"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/departamento",
            label: "Departamentos",
            icon: MdAccountTree,
            props: {
              path: "gm/departamento",
              title: "Departamento",
              title_plural: "Departamentos"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/cargo",
            label: "Cargos",
            icon: MdWork,
            props: {
              path: "gm/cargo",
              title: "Cargo",
              title_plural: "Cargos"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/centro_costo",
            label: "Centros de Costo",
            icon: MdAccountBalance,
            props: {
              path: "gm/centro_costo",
              title: "Centro de Costo",
              title_plural: "Centros de Costo"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/indice_centro_costo",
            label: "Índice Centro de Costo",
            icon: MdFunctions,
            props: {
              path: "gm/indice_centro_costo",
              title: "Índice Centro de Costo",
              title_plural: "Índices Centro de Costo",
              meta: { detailOf: "centro_costo" }
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/empleado_ccosto",
            label: "Empleado ↔ Centro Costo",
            icon: MdSwapHoriz,
            props: {
              path: "gm/empleado_ccosto",
              title: "Asignación CCosto",
              title_plural: "Asignaciones CCosto",
              meta: { detailOf: "empleado" }
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/comuna",
            label: "Comunas",
            icon: MdLocationCity,
            props: {
              path: "gm/comuna",
              title: "Comuna",
              title_plural: "Comunas"
            },
            insideBar: true
          }
        ]
      },

      /* Personas y Contratos */
      {
        type: "menu",
        key: "mrPersonas",
        label: "Personas y Contratos",
        icon: MdGroups,
        insideBar: true,
        children: [
          {
            component: Empleado, // si tienes componente específico, si no usar GenericMaster
            type: "route",
            path: "/gm/empleado",
            label: "Empleados",
            icon: MdPerson,
            props: {
              path: "gm/empleado",
              title: "Empleado",
              title_plural: "Empleados"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/sexo",
            label: "Sexo",
            icon: MdWc,
            props: {
              path: "gm/sexo",
              title: "Sexo",
              title_plural: "Sexos"
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/nacionalidad",
            label: "Nacionalidades",
            icon: MdPublic,
            props: {
              path: "gm/nacionalidad",
              title: "Nacionalidad",
              title_plural: "Nacionalidades"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/discapacidad",
            label: "Discapacidad",
            icon: MdAccessible,
            props: {
              path: "gm/discapacidad",
              title: "Discapacidad",
              title_plural: "Discapacidades"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/tipo_trabajador",
            label: "Tipos de Trabajador",
            icon: MdBadge,
            props: {
              path: "gm/tipo_trabajador",
              title: "Tipo de Trabajador",
              title_plural: "Tipos de Trabajador"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/tipo_contrato",
            label: "Tipos de Contrato",
            icon: MdAssignmentInd,
            props: {
              path: "gm/tipo_contrato",
              title: "Tipo de Contrato",
              title_plural: "Tipos de Contrato"
            },
            insideBar: true
          }
        ]
      },

      /* Previsión y Salud */
      {
        type: "menu",
        key: "mrPrevisionales",
        label: "Previsión y Salud",
        icon: MdHealthAndSafety,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/salud",
            label: "Salud",
            icon: MdLocalHospital,
            props: {
              path: "gm/salud",
              title: "Institución de Salud",
              title_plural: "Instituciones de Salud"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/prevision",
            label: "Previsión",
            icon: MdSecurity,
            props: {
              path: "gm/prevision",
              title: "Previsión",
              title_plural: "Previsiones"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/regimen_previsional",
            label: "Régimen Previsional",
            icon: MdPolicy,
            props: {
              path: "gm/regimen_previsional",
              title: "Régimen Previsional",
              title_plural: "Regímenes Previsionales"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/institucion_apv",
            label: "Instituciones APV",
            icon: MdSavings,
            props: {
              path: "gm/institucion_apv",
              title: "Institución APV",
              title_plural: "Instituciones APV"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/caja_compensacion",
            label: "Cajas de Compensación",
            icon: MdAccountBalanceWallet,
            props: {
              path: "gm/caja_compensacion",
              title: "Caja de Compensación",
              title_plural: "Cajas de Compensación"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/mutual",
            label: "Mutuales",
            icon: MdHealthAndSafety,
            props: {
              path: "gm/mutual",
              title: "Mutual",
              title_plural: "Mutuales"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/valores_prevision",
            label: "Valores Previsión",
            icon: MdTrendingUp,
            props: {
              path: "gm/valores_prevision",
              title: "Valor Previsión",
              title_plural: "Valores Previsión"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/topes_impuestos",
            label: "Topes de Impuestos",
            icon: MdPercent,
            props: {
              path: "gm/topes_impuestos",
              title: "Tope de Impuesto",
              title_plural: "Topes de Impuestos"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/tope_asignacion",
            label: "Asignación Familiar (Topes)",
            icon: MdFamilyRestroom,
            props: {
              path: "gm/tope_asignacion",
              title: "Tope Asignación Familiar",
              title_plural: "Topes Asignación Familiar"
            },
            insideBar: true
          }
        ]
      },

      /* Beneficios (Catálogos) */
      {
        type: "menu",
        key: "mrBeneficios",
        label: "Beneficios (Catálogos)",
        icon: MdCardGiftcard,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/beneficio",
            label: "Beneficios",
            icon: MdRedeem,
            props: {
              path: "gm/beneficio",
              title: "Beneficio",
              title_plural: "Beneficios"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/tipo_beneficio",
            label: "Tipos de Beneficio",
            icon: MdCategory,
            props: {
              path: "gm/tipo_beneficio",
              title: "Tipo de Beneficio",
              title_plural: "Tipos de Beneficio"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/beneficio_periocidad",
            label: "Periodicidad de Beneficio",
            icon: MdSchedule,
            props: {
              path: "gm/beneficio_periocidad",
              title: "Periodicidad de Beneficio",
              title_plural: "Periodicidades de Beneficio"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/estado_entrega_beneficio",
            label: "Estados Entrega Beneficio",
            icon: MdFlag,
            props: {
              path: "gm/estado_entrega_beneficio",
              title: "Estado Entrega Beneficio",
              title_plural: "Estados Entrega Beneficio"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/cargo_beneficio",
            label: "Cargos por Beneficio",
            icon: MdAddCard,
            props: {
              path: "gm/cargo_beneficio",
              title: "Cargo por Beneficio",
              title_plural: "Cargos por Beneficio",
              meta: { detailOf: "beneficio" }
            },
            insideBar: false
          }
        ]
      },

      /* Remuneracionales (H/D y Contabilidad) */
      {
        type: "menu",
        key: "mrRemuContable",
        label: "Remuneracionales y Contabilidad",
        icon: MdBalance,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/haberes_descuentos",
            label: "Haberes y Descuentos (Catálogo)",
            icon: MdBalance,
            props: {
              path: "gm/haberes_descuentos",
              title: "Haber/Descuento",
              title_plural: "Haberes y Descuentos"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/tipo_h_d",
            label: "Tipos de Haber/Descuento",
            icon: MdLabel,
            props: {
              path: "gm/tipo_h_d",
              title: "Tipo Haber/Descuento",
              title_plural: "Tipos Haber/Descuento"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/cuenta_hd",
            label: "Cuentas para H/D",
            icon: MdCalculate,
            props: {
              path: "gm/cuenta_hd",
              title: "Cuenta H/D",
              title_plural: "Cuentas H/D"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/cargo_descuento",
            label: "Cargos por Descuento",
            icon: MdRemoveCircle,
            props: {
              path: "gm/cargo_descuento",
              title: "Cargo por Descuento",
              title_plural: "Cargos por Descuento",
              meta: { detailOf: "haberes_descuentos" }
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/cargo_comision",
            label: "Cargos por Comisión",
            icon: MdShowChart,
            props: {
              path: "gm/cargo_comision",
              title: "Cargo por Comisión",
              title_plural: "Cargos por Comisión",
              meta: { detailOf: "haberes_descuentos" }
            },
            insideBar: false
          }
        ]
      },

      /* Finiquitos (Catálogos) */
      {
        type: "menu",
        key: "mrFiniquitos",
        label: "Finiquitos (Catálogos)",
        icon: MdGavel,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/item_finiquito",
            label: "Ítems de Finiquito",
            icon: MdChecklist,
            props: {
              path: "gm/item_finiquito",
              title: "Ítem de Finiquito",
              title_plural: "Ítems de Finiquito"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/causal_finiquito",
            label: "Causales de Finiquito",
            icon: MdGavel,
            props: {
              path: "gm/causal_finiquito",
              title: "Causal de Finiquito",
              title_plural: "Causales de Finiquito"
            },
            insideBar: true
          }
        ]
      },

      /* Calendario, Estados y Parámetros */
      {
        type: "menu",
        key: "mrCalendarioParametros",
        label: "Calendario, Estados y Parámetros",
        icon: MdCalendarToday,
        insideBar: true,
        children: [
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/mes",
            label: "Meses",
            icon: MdCalendarMonth,
            props: {
              path: "gm/mes",
              title: "Mes",
              title_plural: "Meses"
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/festivos",
            label: "Días Festivos",
            icon: MdEventAvailable,
            props: {
              path: "gm/festivos",
              title: "Día Festivo",
              title_plural: "Días Festivos"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/estado_vacaciones",
            label: "Estados de Vacaciones",
            icon: MdFlag,
            props: {
              path: "gm/estado_vacaciones",
              title: "Estado de Vacaciones",
              title_plural: "Estados de Vacaciones"
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/estado_periodo_contable",
            label: "Estados Período Contable",
            icon: MdFlagCircle,
            props: {
              path: "gm/estado_periodo_contable",
              title: "Estado Período Contable",
              title_plural: "Estados Período Contable"
            },
            insideBar: false
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/tipo_ausencia",
            label: "Tipos de Ausencia",
            icon: MdReportProblem,
            props: {
              path: "gm/tipo_ausencia",
              title: "Tipo de Ausencia",
              title_plural: "Tipos de Ausencia"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/constantes",
            label: "Parámetros del Sistema",
            icon: MdTune,
            props: {
              path: "gm/constantes",
              title: "Parámetro",
              title_plural: "Parámetros"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/moneda",
            label: "Monedas",
            icon: MdAttachMoney,
            props: {
              path: "gm/moneda",
              title: "Moneda",
              title_plural: "Monedas"
            },
            insideBar: true
          },
          {
            component: GenericMaster,
            type: "route",
            path: "/gm/sn",
            label: "Series/Correlativos (SN)",
            icon: MdConfirmationNumber,
            props: {
              path: "gm/sn",
              title: "Serie/Correlativo",
              title_plural: "Series/Correlativos"
            },
            insideBar: true
          }
        ]
      }
    ]
  }
]



  return routes;
};

export default getRoutes;
