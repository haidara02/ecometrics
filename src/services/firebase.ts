import firebase from 'firebase/compat/app';
import {
  DocumentData,
  Query,
  CollectionReference,
  QuerySnapshot,
  DocumentReference,
  QueryDocumentSnapshot,
} from '@firebase/firestore-types';
import { doc, addDoc, collection, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  updateMetadata,
  uploadBytes,
  uploadString,
} from 'firebase/storage';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import {
  FilterConditionType,
  FrameworkMetricsType,
  GetDataArgs,
  MetricsNameTypes,
  ComparisonMetricsReturnType,
  MetricsDescriptionReturnType,
  CollectionTypes,
  CompanyCollectionType,
  FrameworksCollectionType,
  MetricInputCollectionType,
  MetricTypesCollectionType,
  FrameworksReturnType,
  MetricInputCollectionTypeId,
  DataImportType,
  CompanyMetricsParsedByYearsReturnType,
} from './types';
import { User, updateProfile } from '@firebase/auth';
import { TableRowType } from '../pages/CompanySelection/CompaniesTable';
import { parseMetricYear } from '../utils/helpers';
import { saveAs } from 'file-saver';

const firebaseConfig = {
};

export const app = firebase.initializeApp(firebaseConfig);
const db: firebase.firestore.Firestore = firebase.firestore();
const storage = getStorage(app);
export default db;

const frameworksRef = db.collection('frameworks');
const companiesRef = db.collection('companies');

/**
 * Returns a collection reference for company metrics based on company ID.
 * @param companyId - The ID of the company.
 * @returns A collection reference to the company metrics.
 */
const companyMetricsRef = (
  companyId: number
): CollectionReference<DocumentData> =>
  db.collection(`companies/${companyId}/metrics`);
const metricTypesRef = db.collection('metric_types');

// const companiesEsgRed =

/**
 * MAIN function that returns a promise to get data from a Firestore collection.
 * For general usage, see Getters functions
 * @param {CollectionReference<DocumentData, DocumentData>} collection - Collection (framewordsRef/metricsRef) to get data from
 * @param filters - Filters for where clasuse
 * @param parseData - Function to change each row of data
 * @param errorCb - Error callback function
 * @returns {Promise<K[]>} A promise to get the return data
 */
export const getDataPromise = async <
  T extends CollectionTypes,
  K extends Record<string, any> | number | string,
>({
  collection,
  filters = [],
  parseData = (doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as K,
  errorCb,
}: GetDataArgs<T, K>): Promise<K[]> => {
  const storage: K[] = [];

  await applyWhereFilters<T>(collection, filters)
    .then((collection: QuerySnapshot<DocumentData>) => {
      collection.docs.forEach((doc) => {
        storage.push(parseData(doc));
      });
    })
    .catch((error) => {
      errorCb ? errorCb() : console.error('Error fetching data:', error);
    });

  return storage;
};

////////////////////////////////////////////////////////////////////////////////
//                                    HELPERS                                 //
////////////////////////////////////////////////////////////////////////////////
/**
 * Applies all filters for where clause to given collection and returns the
 * Promise to get said data
 * 
  EXAMPLE USAGE:
    applyWhereFilters({
      collection: metricsRef, 
      columns: [
        { column: "pillar", operator: "in", filterBy: ["E", "G"] },
        {
          column: "company_name",
          operator: "==",
          filterBy: "Samsung Electronics Co Ltd",
        },
      ]} as FilterConditionType<MetricsFieldType>[])
      .then((data) => {
        data.docs.forEach((doc) => console.log(doc.data()));
      });
 * @T - the columns/fields of a particular collection
 * @param collection - db.collection("name")
 * @param {FilterConditionType<T>[]} filters - an array of objects with the query where clause arguments
 * @returns {Promise} A promise to get the data queried based on filters and collection
 */
const applyWhereFilters = <T extends CollectionTypes>(
  collection: CollectionReference<DocumentData>,
  filters: FilterConditionType<T>[]
): Promise<QuerySnapshot<DocumentData>> => {
  let query: Query<DocumentData> = collection;
  filters.forEach((filter) => {
    query = query.where(filter.column, filter.operator, filter.filterBy);
  });

  return query.get();
};

////////////////////////////////////////////////////////////////////////////////
//                                 FRAMEWORKS                                 //
////////////////////////////////////////////////////////////////////////////////

/**
 * Returns a promise to get frameworks data based on user ID.
 * Example usage:
    const [data, setData] = useState<FrameworksCollectionType[]>([]);
    const { auth } = useAuth();

    useEffect(() => {
      getFrameworks(auth.currentUser.uid).then((frameworks) => {
        setData(frameworks)
      })
    }, [])
 * @param {string} uid - User ID.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<FrameworksReturnType>} A promise to get frameworks data.
 */
export const getFrameworks = async (
  uid: string,
  errorCb?: () => void
): Promise<FrameworksReturnType> => {
  const storage: FrameworksReturnType = {};
  await applyWhereFilters<FrameworksCollectionType>(frameworksRef, [
    { column: 'uid', operator: 'in', filterBy: [uid, ''] },
  ])
    .then((data) => {
      data.docs.forEach((doc) => {
        storage[doc.id] = doc.data() as FrameworksCollectionType;
      });
    })
    .catch((error) => {
      errorCb ? errorCb() : console.error('Error fetching data:', error);
    });
  return storage;
};

/**
 * Updates the metrics of a framework in the database.
 * @param {string} framework_id - The ID of the framework to update.
 * @param {FrameworkMetricsType} metrics - The new metrics data.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<void>} A promise to update the framework.
 */
export const updateFramework = async (
  framework_id: string,
  metrics: FrameworkMetricsType,
  errorCb?: () => void
): Promise<void> => {
  try {
    const docRef = doc(frameworksRef, framework_id);
    updateDoc(docRef, {
      metrics: metrics,
    });
  } catch (e) {
    errorCb ? errorCb() : console.error('Error updating framework:', e);
  }
};

/**
 * Adds a new framework to the database.
 * @param {string} uid - Owner ID.
 * @param {string} name - Name of the framework.
 * @param {string} description - Description of the framework.
 * @param {FrameworkMetricsType} metrics - Metrics of the framework.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<string>} A promise with the ID of the added framework.
 */
export const addFramework = async (
  uid: string,
  name: string,
  description: string,
  metrics: FrameworkMetricsType,
  isPublic: boolean,
  errorCb?: () => void
): Promise<string> => {
  const framework = {
    uid: isPublic ? '' : uid,
    name: name,
    description: description,
    metrics: metrics,
  };

  try {
    const docRef = await addDoc(collection(db, 'frameworks'), framework);
    return docRef.id;
  } catch (e) {
    errorCb ? errorCb() : console.error('Error adding framework: ', e);
    return '';
  }
};

////////////////////////////////////////////////////////////////////////////////
//                                    GETTERS                                 //
////////////////////////////////////////////////////////////////////////////////

/**
 * Returns a promise to get all companies data.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<TableRowType[]>} A promise to get all companies data.
 */
export const getAllCompaniesTableData = async (
  errorCb?: () => void
): Promise<TableRowType[]> => {
  const mapCompanyDataToTableRow = (company: DocumentData): TableRowType => ({
    id: company.perm_id,
    company: company.company_name,
    esgRating: {
      currentValue: 0,
      lastYearValue: 0,
    },
    headquarter_country: company.headquarter_country,
  });

  const storage: TableRowType[] = [];
  const batchSize = 50;

  const collection = await companiesRef.get();

  const docs = collection.docs;

  for (let i = 0; i < docs.length; i += batchSize) {
    const batchDocs = docs.slice(i, i + batchSize);

    await Promise.all(
      batchDocs.map(async (doc) => {
        const data = doc.data() as CompanyCollectionType;
        const rowData = mapCompanyDataToTableRow(data);
        const currYear = new Date().getFullYear();

        for (let yr = currYear; yr > 1990; yr--) {
          if (!data?.metric_years || !(yr in data.metric_years)) continue;
          rowData.esgRating.currentValue = Math.round(
            data.metric_years[yr].totalMetricValue /
              data.metric_years[yr].numMetricValues
          );
          rowData.esgRating.lastYearValue =
            yr - 1 in data.metric_years
              ? Math.round(
                  data.metric_years[yr - 1].totalMetricValue /
                    data.metric_years[yr - 1].numMetricValues
                )
              : 0;
          storage.push(rowData);
          break;
        }
      })
    ).catch(() => {
      errorCb && errorCb();
    });
  }

  return storage;
};

/**
 * Returns a promise to get CompanyName by their ID
 * @param {number} companyId - The ID of the company.
 * @returns {Promise<string>} A promise to get the name of the company.
 */
const getCompanyNameByPermId = async (companyId: number): Promise<string> => {
  return companiesRef
    .doc(companyId.toString())
    .get()
    .then((data) => data.data()?.company_name);
};

/**
 * Returns a promise to get all metrics for a company.
 * @param {number} companyId - The ID of the company.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<MetricInputCollectionType[]>} A promise to get all metrics for the company.
 */
export const getAllMetricByCompany = async (
  companyId: number,
  errorCb?: () => void
): Promise<MetricInputCollectionType[]> => {
  const getAllMetricByCompanyArgs: GetDataArgs<
    MetricInputCollectionType,
    MetricInputCollectionType
  > = {
    collection: companyMetricsRef(companyId),
    errorCb,
  };

  return getDataPromise(getAllMetricByCompanyArgs);
};

/**
 * Returns a promise to get comparison metrics for multiple companies.
 * @param {number[]} companyIds - An array of company IDs.
 * @param {MetricsNameTypes[]} metricNames - An array of metric names.
 * @param {number} year - The year for comparison.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<ComparisonMetricsReturnType[]>} A promise to get comparison metrics.
 */
export const getComparisonMetrics = async (
  companyIds: number[],
  metricNames: MetricsNameTypes[],
  year: number,
  errorCb?: () => void
): Promise<ComparisonMetricsReturnType[]> => {
  const getMetricsPromises: Promise<any>[] = [];
  for (const id of companyIds) {
    const getComparisonMetricsArgs: GetDataArgs<
      MetricInputCollectionType,
      { [key in MetricsNameTypes]?: number }
    > = {
      collection: companyMetricsRef(id),
      filters: [
        { column: 'metric_name', operator: 'in', filterBy: metricNames },
        { column: 'metric_year', operator: '==', filterBy: year },
      ],
      parseData: (doc) => {
        const name = doc.data().metric_name as MetricsNameTypes;
        const metricValue = doc.data().metric_value as number;
        return { [name]: metricValue };
      },
      errorCb,
    };

    getMetricsPromises.push(
      Promise.all([
        getCompanyNameByPermId(id),
        getDataPromise(getComparisonMetricsArgs),
      ]).then((data) => ({ company_name: data[0], named_metrics: data[1] }))
    );
  }
  return Promise.all(getMetricsPromises);
};

/**
 * Returns a promise to get all years by companies.
 * @param {number[]} companyIds - An array of company IDs.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<number[]>} A promise to get all years.
 */
export const getAllYearsByCompanies = async (
  companyIds: number[],
  errorCb?: () => void
): Promise<number[]> => {
  const years = new Set<number>([]);

  await applyWhereFilters<CompanyCollectionType>(companiesRef, [
    { column: 'perm_id', operator: 'in', filterBy: companyIds },
  ])
    .then((collection: QuerySnapshot<DocumentData>) => {
      collection.docs.forEach((doc) => {
        doc.data().metric_years.forEach((year: number) => years.add(year));
      });
    })
    .catch((error) => {
      errorCb ? errorCb() : console.error('Error fetching data:', error);
    });

  return Array.from(years);
};

/**
 * Returns a promise to get company data by company ID.
 * @param {number} companyId - The ID of the company.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<CompanyCollectionType>} A promise to get company data.
 */
export const getCompanyData = (
  companyId: number,
  errorCb?: () => {}
): Promise<CompanyCollectionType> => {
  return db
    .collection('companies')
    .doc(`${companyId}`)
    .get()
    .then((doc) => {
      if (!doc.exists && errorCb) throw Error('Company not found.');
      return doc.data() as CompanyCollectionType;
    });
};

/**
 * Returns company metrics parsed by years.
 * @param {number} [companyId] - Company id.
 * @returns {Promise<CompanyMetricsParsedByYearsReturnType>} A promise to get metrics parsed by years.
 */
export const getCompanyMetricsParsedByYears = (
  companyId: number
): Promise<CompanyMetricsParsedByYearsReturnType> => {
  return companyMetricsRef(companyId)
    .get()
    .then((data) => {
      const storage: CompanyMetricsParsedByYearsReturnType = {};
      data.docs.forEach((doc) => {
        const docData = doc.data() as MetricInputCollectionTypeId;
        if (!(docData.metric_year in storage)) {
          storage[docData.metric_year] = {};
        }

        if (!(docData.metric_name in storage[docData.metric_year])) {
          storage[docData.metric_year][docData.metric_name] = {
            value: 0,
            provider_name: '',
          };
        }

        const metric = storage[docData.metric_year][docData.metric_name];
        if (metric) {
          metric.value = docData.metric_value;
          metric.provider_name = docData.provider_name;
        }
      });
      return storage;
    });
};

/**
 * Returns a promise to get metric descriptions.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<MetricsDescriptionReturnType>} A promise to get metric descriptions.
 */
export const getMetricDescription = async (
  errorCb?: () => void
): Promise<MetricsDescriptionReturnType> => {
  const metrics: MetricsDescriptionReturnType = {};
  await applyWhereFilters<MetricTypesCollectionType>(metricTypesRef, [])
    .then((collection: QuerySnapshot<DocumentData>) => {
      collection.docs.forEach((doc) => {
        const docData = doc.data();
        metrics[docData.metric_name as MetricsNameTypes] =
          docData.metric_description as string;
      });
    })
    .catch((error) => {
      errorCb ? errorCb() : console.error('Error fetching data:', error);
    });
  return metrics;
};

/**
 * Returns a promise to get ESG score calculation.
 * @param {{ metric_name: string; metric_value: number; metric_year: number; }[]} filteredMetrics - Filtered metrics data.
 * @param {FrameworkMetricsType} metricWeighting - Weighting of metrics.
 * @param {function} [errorCb] - Error callback function.
 * @returns {Promise<number>} A promise to get ESG score calculation.
 */
export const getEsgScoreCalculation = async (
  metrics: CompanyMetricsParsedByYearsReturnType,
  metricWeighting: FrameworkMetricsType,
  errorCb?: () => void
): Promise<number> => {
  try {
    // Weighted average
    let totalScore = 0;
    let totalWeight = 0;
    Object.keys(metrics).forEach((year) => {
      Object.keys(metrics[parseInt(year)]).forEach((metric) => {
        // If number, keep number, else if boolean, revert to 1/0
        let metricWeight = metricWeighting[metric as MetricsNameTypes];
        if (metricWeight === undefined) {
          // Weight cannot be found, default to 0, as user has not inputted anything
          metricWeight = 0;
        }

        totalScore +=
          (metrics[parseInt(year)][metric as MetricsNameTypes]?.value ?? 0) *
          metricWeight;
        totalWeight += metricWeight;
      });
    });

    if (totalWeight === 0) {
      if (errorCb) errorCb();
      return 0;
    }

    const averageScore = Math.round(totalScore / totalWeight);
    return averageScore;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

////////////////////////////////////////////////////////////////////////////////
//                                 UPLOAD CSV                                 //
////////////////////////////////////////////////////////////////////////////////

/**
 * Returns a promise to handle
 * @param {DocumentReference<DocumentData>} companyDoc -
 * @param {DataImportType} csv - Data imported from CSV.
 * @param {CompanyMutableDataType} companiesMutableData -
 * @returns {Promise<void>}
 */
const handleMetricCompanyData = async (
  companyDoc: DocumentReference<DocumentData>,
  csv: DataImportType,
  companiesMutableData: CompanyMutableDataType
): Promise<void> => {
  const metricCompanyColl = companyDoc.collection('metrics');
  const searchMetricsArgs: GetDataArgs<
    MetricInputCollectionType,
    MetricInputCollectionTypeId
  > = {
    collection: metricCompanyColl,
    filters: [
      {
        column: 'metric_year',
        operator: '==',
        filterBy: parseMetricYear(csv.metric_year),
      },
      { column: 'metric_name', operator: '==', filterBy: csv.metric_name },
      { column: 'metric_period', operator: '==', filterBy: csv.metric_period },
      {
        column: 'reported_date',
        operator: '<=',
        filterBy: csv.reported_date,
      },
      {
        column: 'provider_name',
        operator: '==',
        filterBy: csv.provider_name,
      },
    ],
    parseData: (doc) => {
      return {
        ...(doc.data() as MetricInputCollectionType),
        id: doc.id,
      };
    },
  };

  return new Promise<void>(async (resolve) => {
    const data = await getDataPromise(searchMetricsArgs);

    const parsedYear = parseMetricYear(csv.metric_year);

    // update data of company for which this metric belongs to
    companiesMutableData[csv.perm_id].nb_points_of_observations += 1;

    if (!(parsedYear in companiesMutableData[csv.perm_id].metric_years)) {
      companiesMutableData[csv.perm_id].metric_years[parsedYear] = {
        totalMetricValue: 0,
        numMetricValues: 0,
      };
    }
    // update year values
    companiesMutableData[parseInt(csv.perm_id)].metric_years[
      parsedYear
    ].totalMetricValue += parseInt(csv.metric_value);
    companiesMutableData[parseInt(csv.perm_id)].metric_years[
      parsedYear
    ].numMetricValues += 1;

    if (data.length === 0) {
      // no repeat was found
      await metricCompanyColl.add({
        metric_name: csv.metric_name,
        data_type: csv.data_type,
        disclosure: csv.disclosure,
        metric_period: csv.metric_period,
        metric_value: parseInt(csv.metric_value),
        metric_year: parsedYear,
        provider_name: csv.provider_name,
        reported_date: csv.reported_date,
      });
    } else if (data[0].metric_value !== parseInt(csv.metric_value)) {
      // repeat was found, so update value if different
      await metricCompanyColl.doc(data[0].id).update({
        ...data[0],
        metric_value: parseInt(csv.metric_value),
      } as MetricInputCollectionType);

      // update year values
      companiesMutableData[parseInt(csv.perm_id)].metric_years[
        parsedYear
      ].totalMetricValue -= data[0].metric_value;
      companiesMutableData[parseInt(csv.perm_id)].metric_years[
        parsedYear
      ].numMetricValues -= 1;
      companiesMutableData[csv.perm_id].nb_points_of_observations -= 1;
    }
    resolve();
  });
};

const handleCompanyData = async (
  companyDoc: DocumentReference<DocumentData>,
  companyData: CompanyCollectionType
) => {
  const doc = await companyDoc.get();

  if (doc.exists) {
    // if doc does exists, need to update data
    const entryData = doc.data() as CompanyCollectionType;
    const newYears = { ...companyData.metric_years };
    const newNBPoints = companyData.nb_points_of_observations ?? 0;
    // combine metric years
    companyData.nb_points_of_observations =
      newNBPoints + (entryData.nb_points_of_observations ?? 0);

    entryData.metric_years &&
      Object.keys(entryData.metric_years).forEach((year) => {
        if (year in newYears) {
          // year in currently stored new data so combine it with data in db
          const oldYearEsgData = entryData.metric_years[year];
          newYears[year] = {
            totalMetricValue:
              oldYearEsgData.totalMetricValue + newYears[year].totalMetricValue,
            numMetricValues:
              oldYearEsgData.numMetricValues + newYears[year].numMetricValues,
          };
        } else {
          newYears[year] = entryData.metric_years[year];
        }
      });
    companyData.metric_years = newYears;
  }
  return companyDoc.set(companyData);
};

/**
 * Mutable data type for companies.
 * @property {CompanyCollectionType} - Data of companies.
 */
type CompanyMutableDataType = Record<string, CompanyCollectionType>;

/**
 * Uploads data from CSV import to the database.
 * @param {DataImportType[]} csvData - Data imported from CSV.
 * @param {React.Dispatch<React.SetStateAction<number>>} setUploadProgress - Function to set upload progress state.
 * @returns {Promise<void>} A promise that resolves when data upload is completed.
 */
export const uploadData = async (
  csvData: DataImportType[],
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const companiesMutableData: CompanyMutableDataType = {};
  let metricsProgress = 0;

  let metricPromises: Promise<void>[] = [];
  // loop through data
  for (const csv of csvData) {
    if (!csv.perm_id) continue; // invalid data entry

    // start tracking data of new company that might need to be changed
    if (!(parseInt(csv.perm_id) in companiesMutableData)) {
      companiesMutableData[parseInt(csv.perm_id)] = {
        metric_years: {},
        nb_points_of_observations: 0,
        company_name: csv.company_name ?? '',
        headquarter_country: csv.headquarter_country ?? '',
        perm_id: parseInt(csv.perm_id) ?? -1,
      };
    }

    const companyDoc = companiesRef.doc(`${parseInt(csv.perm_id)}`);

    metricPromises.push(
      new Promise(async (resolve) => {
        await companyDoc.set(
          {
            company_name: csv.company_name ?? '',
            headquarter_country: csv.headquarter_country ?? '',
            perm_id: parseInt(csv.perm_id) ?? -1,
          },
          { merge: true }
        );
        await handleMetricCompanyData(
          companyDoc,
          csv,
          companiesMutableData
        ).then(() => resolve());
      })
    );

    // wait until firestore writes finish to avoid using up firebase queue
    if (metricPromises.length === 125) {
      await Promise.all(metricPromises);
      metricsProgress += 125;
      setUploadProgress((metricsProgress / csvData.length) * 80);
      metricPromises = [];
    }
  }
  setUploadProgress(80);
  await Promise.all(metricPromises).then(async () => {
    // set all company data that was stored for update
    let i = 0;
    const companyPromises: Promise<void>[] = [];
    Object.keys(companiesMutableData).forEach(async (companyId: string) => {
      i += 1;

      companyPromises.push(
        handleCompanyData(
          companiesRef.doc(`${companyId}`),
          companiesMutableData[companyId]
        )
      );
      // wait for write to finish to not overload firebase queue
      if (companyPromises.length === 125) {
        await Promise.all(companyPromises);
        setUploadProgress(
          (i / Object.keys(companiesMutableData).length) * 20 + 80
        );
      }
    });

    await Promise.all(companyPromises);
  });
};

////////////////////////////////////////////////////////////////////////////////
//                                     USER                                   //
////////////////////////////////////////////////////////////////////////////////

export const updateUserPhoto = async (
  user: User,
  photo: File,
  errorCb?: () => void
): Promise<string | void> => {
  return new Promise(async (resolve) => {
    const storageRef = ref(storage, 'user_photos/' + user.uid);
    let urlStore = '';
    if (user?.photoURL !== null) {
      await deleteObject(storageRef);
    }

    uploadBytes(storageRef, photo)
      .then(() => getDownloadURL(storageRef))
      .then((url) => {
        updateProfile(user, { photoURL: url });
        urlStore = url;
      })
      .then(() => {
        resolve(urlStore);
      })
      .catch((e) => {
        if (errorCb) {
          errorCb();
        } else {
          console.error('Error updating user photo:', e);
        }
      });
  });
};

////////////////////////////////////////////////////////////////////////////////
//                              FRAMEWORKS SHARING                            //
////////////////////////////////////////////////////////////////////////////////

export const downloadFramework = async (
  framework: FrameworksCollectionType,
  errorCb?: () => void
): Promise<void> => {
  try {
    const blob = new Blob([JSON.stringify(framework)], {
      type: 'application/json',
    });
    saveAs(blob, `${framework.name}.json`);
  } catch (e) {
    if (errorCb) {
      errorCb();
    } else {
      console.error('Error downloading framework:', e);
    }
  }
};

export const uploadFramework = async (
  uid: string,
  frameworksFile: File,
  errorCb?: () => void
): Promise<void> => {
  const reader = new FileReader();

  reader.onload = function (event) {
    if (!event.target) return;
    const contents = event.target.result;
    const frameworksData = JSON.parse(contents as string);

    addFramework(
      uid,
      frameworksData.name,
      frameworksData.description,
      frameworksData.metrics,
      false
    );
  };

  try {
    reader.readAsText(frameworksFile);
  } catch (e) {
    if (errorCb) {
      errorCb();
    } else {
      console.error('Error uploading framework:', e);
    }
  }
};

export const deleteFramework = async (
  uid: string,
  frameworkId: string,
  errorCb?: () => void
): Promise<void> => {};

////////////////////////////////////////////////////////////////////////////////
//                          NEW USER STATUS HELPERS                           //
////////////////////////////////////////////////////////////////////////////////

export const addNewUser = async (
  user: User,
  errorCb?: () => void
): Promise<void> => {
  try {
    const storageRef = ref(storage, 'new_users/' + user.uid);
    await uploadString(storageRef, '');
    await updateMetadata(storageRef, { contentType: 'text/plain' });
  } catch (e) {
    if (errorCb) {
      errorCb();
    } else {
      console.error('Error creating user avatar:', e);
    }
  }
};

export const removeUserData = async (
  user: User,
  location: string,
  errorCb?: () => void
): Promise<void> => {
  try {
    const storageRef = ref(storage, location + user.uid);
    try {
      await getMetadata(storageRef);
    } catch (e) {
      console.error('Object does not exist.');
      return;
    }
    await deleteObject(storageRef);
  } catch (e) {
    if (errorCb) {
      errorCb();
    } else {
      console.error('Error removing user status:', e);
    }
  }
};
export const changeUserStatus = async (
  user: User,
  errorCb?: () => void
): Promise<void> => {
  try {
    const companiesRef = ref(storage, 'new_users/' + user.uid);
    const metricsRef = ref(storage, 'new_users/metrics/' + user.uid);
    const onCompany = await getMetadata(companiesRef);
    if (onCompany) {
      await uploadString(metricsRef, '');
      await updateMetadata(metricsRef, { contentType: 'text/plain' });
      await deleteObject(companiesRef);
    }
  } catch (e) {
    if (errorCb) {
      errorCb();
    }
  }
};

export const newUserStatus = async (
  user: User,
  page: number,
  errorCb?: () => void
): Promise<boolean> => {
  try {
    let storageRef = ref(storage, 'new_users/' + user.uid); // page 1
    if (page === 2) {
      storageRef = ref(storage, 'new_users/metrics/' + user.uid);
    }
    const metadata = await getMetadata(storageRef);
    return !!metadata;
  } catch (e) {
    if (errorCb) {
      errorCb();
      return false;
    } else {
      console.error('Error checking user status:', e);
      return false;
    }
  }
};
