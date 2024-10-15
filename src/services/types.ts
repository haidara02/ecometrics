import {
  WhereFilterOp,
  CollectionReference,
  DocumentData,
  FieldPath,
  QueryDocumentSnapshot,
} from '@firebase/firestore-types';

////////////////////////////////////////////////////////////////////////////////
//                                 COLLECTIONS                                //
////////////////////////////////////////////////////////////////////////////////
export type CollectionTypes =
  | CompanyCollectionType
  | MetricInputCollectionType
  | MetricTypesCollectionType
  | FrameworksCollectionType;

export type CompanyMetricYearForEsg = {
  totalMetricValue: number;
  numMetricValues: number;
};

export type CompanyCollectionType = {
  company_name: string;
  headquarter_country: string;
  nb_points_of_observations: number;
  perm_id: number;
  metric_years: Record<string, CompanyMetricYearForEsg>;
};

export type MetricTypesCollectionType = {
  metric_description: string;
  metric_name: string;
  metric_unit: string;
  pillar: string;
};

export type MetricInputCollectionType = {
  metric_name: MetricsNameTypes;
  data_type: string;
  disclosure: string;
  metric_period: string;
  metric_value: number;
  metric_year: number;
  provider_name: string;
  reported_date: string;
};

export type MetricInputCollectionTypeId = {
  metric_name: MetricsNameTypes;
  data_type: string;
  disclosure: string;
  metric_period: string;
  metric_value: number;
  metric_year: number;
  provider_name: string;
  reported_date: string;
  id: string;
};

export type FrameworksCollectionType = {
  uid: string;
  name: string;
  description: string;
  metrics: FrameworkMetricsType;
};

////////////////////////////////////////////////////////////////////////////////
//                                    TYPES                                   //
////////////////////////////////////////////////////////////////////////////////
export type DataImportType = {
  company_name: string;
  data_type: string;
  disclosure: DisclosureTypes;
  headquarter_country: string;
  metric_description: string;
  metric_name: MetricsNameTypes;
  metric_period: string;
  metric_unit: string;
  pillar: PillarTypes;
  metric_value: string;
  metric_year: string;
  nb_points_of_observations: number;
  perm_id: string;
  reported_date: string;
  provider_name: string;
};

////////////////////////////////////////////////////////// GENERAL SERVICE TYPES
// argument type for getData function
// T is which collection you want to get fetch from
// K is the output data you want
export type GetDataArgs<
  T extends CollectionTypes,
  K extends Record<string, any> | number | string,
> = {
  collection: CollectionReference<DocumentData>;
  filters?: FilterConditionType<T>[];
  parseData?: (entry: QueryDocumentSnapshot<DocumentData>) => K;
  errorCb?: () => void;
};

// for filter conditions when inputting into where filter function
export type FilterConditionType<T extends CollectionTypes> = {
  column: Extract<keyof T, string> | FieldPath;
  operator: WhereFilterOp;
  filterBy: string | string[] | number | number[];
};

////////////////////////////////////////////////////////// FUNCTION RETURN TYPES

// for getMetricsForFramework
export type FrameworkMetricsType = {
  [key in MetricsNameTypes]?: number;
};

// for comparison metrics table
export type ComparisonMetricsReturnType = {
  company_name: string;
  named_metrics: Record<MetricsNameTypes, number>[];
};

export type FrameworksReturnType = Record<string, FrameworksCollectionType>;

export type MetricsValueType = {
  metric_name: string;
  metric_value: number;
  metric_year: number;
}[];

export type MetricsByCompanyAndYearsReturnType = {
  company_name: string;
  years: CompanyMetricsParsedByYearsReturnType;
};

export type CompanyMetricsParsedByYearsReturnType = Record<
  number,
  MetricsToInfoType
>;

export type MetricsDescriptionReturnType = {
  [key in MetricsNameTypes]?: string;
};

export type MetricsToInfoType = {
  [key in MetricsNameTypes]?: {
    value: number;
    provider_name: string;
  };
};

export type MetricsToBoolType = {
  [key in MetricsNameTypes]?: boolean;
};

/////////////////////////////////////////////////////////////////// DB CONSTANTS
export type DisclosureTypes =
  | 'CALCULATED'
  | 'ESTIMATED'
  | 'REPORTED'
  | 'ADJUSTED'
  | 'IMPUTED';

export type PillarTypes = 'E' | 'S' | 'G';

export type MetricsNameTypes =
  | 'AIRPOLLUTANTS_DIRECT'
  | 'AIRPOLLUTANTS_INDIRECT'
  | 'ANALYTICAUDITCOMMIND'
  | 'ANALYTICBOARDFEMALE'
  | 'ANALYTICCEO_CHAIRMAN_SEPARATION'
  | 'ANALYTICCOMPCOMMIND'
  | 'ANALYTICCSR_COMP_INCENTIVES'
  | 'ANALYTICEMPLOYMENTCREATION'
  | 'ANALYTICESTIMATEDCO2TOTAL'
  | 'ANALYTICINDEPBOARD'
  | 'ANALYTICNOMINATIONCOMMIND'
  | 'ANALYTICNONAUDITAUDITFEESRATIO'
  | 'ANALYTICNONEXECBOARD'
  | 'ANALYTICQMS'
  | 'ANALYTICTOTALDONATIONS'
  | 'ANALYTICWASTERECYCLINGRATIO'
  | 'ANALYTIC_ANTI_TAKEOVER_DEVICES'
  | 'ANALYTIC_AUDIT_COMM_EXPERTISE'
  | 'ANALYTIC_VOTING_RIGHTS'
  | 'ANIMAL_TESTING_REDUCTION'
  | 'ANNUAL_MEDIAN_COMPENSATION'
  | 'AUDITCOMMNONEXECMEMBERS'
  | 'AVGTRAININGHOURS'
  | 'BIODIVERSITY_IMPACT_REDUCTION'
  | 'BOARDMEETINGATTENDANCEAVG'
  | 'BRIBERY_AND_CORRUPTION_PAI_INSUFFICIENT_ACTIONS'
  | 'CALL_MEETINGS_LIMITED_RIGHTS'
  | 'CEO_ANNUAL_COMPENSATION'
  | 'CEO_PAY_RATIO_MEDIAN'
  | 'CLIMATE_CHANGE_RISKS_OPP'
  | 'CO2DIRECTSCOPE1'
  | 'CO2INDIRECTSCOPE2'
  | 'CO2INDIRECTSCOPE3'
  | 'COMMMEETINGSATTENDANCEAVG'
  | 'COMPCOMMNONEXECMEMBERS'
  | 'CONFORMANCE_OECD_MNE'
  | 'CONFORMANCE_UN_GUID'
  | 'CSR_REPORTINGGRI'
  | 'CSR_REPORTING_EXTERNAL_AUDIT'
  | 'DAY_CARE_SERVICES'
  | 'ECO_DESIGN_PRODUCTS'
  | 'ELECTRICITYPURCHASED'
  | 'ELIMINATION_CUM_VOTING_RIGHTS'
  | 'EMPLOYEEFATALITIES'
  | 'EMPLOYEE_HEALTH_SAFETY_POLICY'
  | 'EMS_CERTIFIED_PCT'
  | 'ENERGYPURCHASEDDIRECT'
  | 'ENERGYUSETOTAL'
  | 'ENV_INVESTMENTS'
  | 'ENV_SUPPLY_CHAIN_MGT'
  | 'E_WASTE_REDUCTION'
  | 'GENDER_PAY_GAP_PERCENTAGE'
  | 'GLOBAL_COMPACT'
  | 'GRIEVANCE_REPORTING_PROCESS'
  | 'HAZARDOUSWASTE'
  | 'HUMAN_RIGHTS_CONTRACTOR'
  | 'HUMAN_RIGHTS_POLICY_DUEDILIGENCE'
  | 'HUMAN_RIGHTS_VIOLATION_PAI'
  | 'IMPROVEMENT_TOOLS_BUSINESS_ETHICS'
  | 'ISO14000'
  | 'LABELED_WOOD'
  | 'LOSTWORKINGDAYS'
  | 'NATURAL_RESOURCE_USE_DIRECT'
  | 'NOXEMISSIONS'
  | 'N_OXS_OX_EMISSIONS_REDUCTION'
  | 'ORGANIC_PRODUCTS_INITIATIVES'
  | 'PARTICULATE_MATTER_EMISSIONS'
  | 'POLICY_BOARD_DIVERSITY'
  | 'POLICY_BRIBERYAND_CORRUPTION'
  | 'POLICY_BUSINESS_ETHICS'
  | 'POLICY_CHILD_LABOR'
  | 'POLICY_DATA_PRIVACY'
  | 'POLICY_EMISSIONS'
  | 'POLICY_FORCED_LABOR'
  | 'POLICY_FREEDOMOF_ASSOCIATION'
  | 'POLICY_HUMAN_RIGHTS'
  | 'POLICY_SUSTAINABLE_PACKAGING'
  | 'POLICY_WATER_EFFICIENCY'
  | 'RENEWENERGYCONSUMED'
  | 'RENEWENERGYPRODUCED'
  | 'RENEWENERGYPURCHASED'
  | 'SOXEMISSIONS'
  | 'SUPPLY_CHAINHS_POLICY'
  | 'SUSTAINABLE_BUILDING_PRODUCTS'
  | 'TAKEBACK_RECYCLING_INITIATIVES'
  | 'TARGETS_DIVERSITY_OPPORTUNITY'
  | 'TARGETS_EMISSIONS'
  | 'TARGETS_WATER_EFFICIENCY'
  | 'TIRTOTAL'
  | 'TOXIC_CHEMICALS_REDUCTION'
  | 'TRADEUNIONREP'
  | 'TRANALYTICRENEWENERGYUSE'
  | 'TURNOVEREMPLOYEES'
  | 'VOCEMISSIONS'
  | 'VOC_EMISSIONS_REDUCTION'
  | 'WASTETOTAL'
  | 'WASTE_RECYCLED'
  | 'WASTE_REDUCTION_TOTAL'
  | 'WATERWITHDRAWALTOTAL'
  | 'WATER_TECHNOLOGIES'
  | 'WATER_USE_PAI_M10'
  | 'WHISTLEBLOWER_PROTECTION'
  | 'WOMENEMPLOYEES'
  | 'WOMENMANAGERS';

// data needed to be returned from firebase to calculate esg rating and other
// information for table in dashboard
// NOTE pls edit
export type CompanyRowDataType = {
  company: string;
  esgValue: number;
  industry: string;
};
