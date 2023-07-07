import { createQueryKeys } from '@lukemorales/query-key-factory';

import { getSearchApiClient, getSecretApiClient } from '@/api/api';
import {
  ModelNodeIdentifierNodeTypeEnum,
  ModelScanInfo,
  ModelScanResultsReq,
  ModelSecret,
  SearchSearchNodeReq,
  SearchSearchScanReq,
} from '@/api/generated';
import { SecretsCountsCardData } from '@/features/secrets/components/landing/SecretsCountsCard';
import { ScanStatusEnum } from '@/types/common';
import { apiWrapper } from '@/utils/api';
import { SECRET_SCAN_STATUS_GROUPS, SecretScanGroupedStatus } from '@/utils/scan';

export const secretQueries = createQueryKeys('secret', {
  scanList: (filters: {
    page?: number;
    nodeTypes?: string[];
    order?: {
      sortBy: string;
      descending: boolean;
    };
    secretScanStatus?: SecretScanGroupedStatus;
    hosts?: string[];
    containers?: string[];
    images?: string[];
    clusters?: string[];
    pageSize: number;
  }) => {
    const {
      page = 1,
      nodeTypes = [],
      secretScanStatus,
      hosts,
      containers,
      images,
      clusters,
      pageSize,
      order,
    } = filters;
    return {
      queryKey: [{ filters }],
      queryFn: async () => {
        type ScanResult = ModelScanInfo & {
          total: number;
          critical: number;
          high: number;
          medium: number;
          low: number;
          unknown: number;
        };
        const results: {
          scans: ScanResult[];
          currentPage: number;
          totalRows: number;
          message?: string;
        } = {
          scans: [],
          currentPage: 1,
          totalRows: 0,
        };

        const scanFilters = {} as {
          status?: string[];
        };

        const nodeFilters = {
          node_type: nodeTypes,
        } as {
          status?: string[];
          node_type?: string[];
          host_name?: string[];
          node_id?: string[];
          docker_image_id?: string[];
          kubernetes_cluster_id?: string[];
        };
        if (hosts && hosts?.length > 0) {
          nodeFilters.host_name = nodeFilters.host_name
            ? nodeFilters.host_name.concat(hosts)
            : hosts;
        }
        if (containers && containers?.length > 0) {
          nodeFilters.node_id = nodeFilters.node_id
            ? nodeFilters.node_id.concat(containers)
            : containers;
        }
        if (images && images?.length > 0) {
          nodeFilters.docker_image_id = nodeFilters.docker_image_id
            ? nodeFilters.docker_image_id.concat(images)
            : images;
        }

        if (clusters && clusters?.length > 0) {
          nodeFilters.kubernetes_cluster_id = clusters;
        }

        const scanRequestParams: SearchSearchScanReq = {
          node_filters: {
            filters: {
              match_filter: { filter_in: {} },
              order_filter: { order_fields: [] },
              contains_filter: { filter_in: { ...nodeFilters } },
              compare_filter: null,
              not_contains_filter: {
                filter_in: {},
              },
            },
            in_field_filter: null,
            window: {
              offset: 0,
              size: 0,
            },
          },
          scan_filters: {
            filters: {
              match_filter: { filter_in: {} },
              order_filter: { order_fields: [] },
              contains_filter: { filter_in: { ...scanFilters } },
              compare_filter: null,
            },
            in_field_filter: null,
            window: {
              offset: 0,
              size: 1,
            },
          },
          window: { offset: page * pageSize, size: pageSize },
        };
        if (order) {
          scanRequestParams.scan_filters.filters.order_filter.order_fields = [
            {
              field_name: order.sortBy,
              descending: order.descending,
            },
          ];
        } else {
          scanRequestParams.scan_filters.filters.order_filter.order_fields = [
            {
              field_name: 'updated_at',
              descending: true,
            },
          ];
        }
        if (secretScanStatus) {
          if (secretScanStatus === SecretScanGroupedStatus.neverScanned) {
            scanRequestParams.node_filters.filters.not_contains_filter!.filter_in = {
              ...scanRequestParams.node_filters.filters.not_contains_filter!.filter_in,
              secret_scan_status: [
                ...SECRET_SCAN_STATUS_GROUPS.complete,
                ...SECRET_SCAN_STATUS_GROUPS.error,
                ...SECRET_SCAN_STATUS_GROUPS.inProgress,
                ...SECRET_SCAN_STATUS_GROUPS.starting,
              ],
            };
          } else {
            scanRequestParams.node_filters.filters.contains_filter.filter_in = {
              ...scanRequestParams.node_filters.filters.contains_filter.filter_in,
              secret_scan_status: SECRET_SCAN_STATUS_GROUPS[secretScanStatus],
            };
          }
        }
        const searchSecretsScanApi = apiWrapper({
          fn: getSearchApiClient().searchSecretsScan,
        });
        const result = await searchSecretsScanApi({
          searchSearchScanReq: scanRequestParams,
        });
        if (!result.ok) {
          throw result.error;
        }

        const countsResultApi = apiWrapper({
          fn: getSearchApiClient().searchSecretScanCount,
        });
        const countsResult = await countsResultApi({
          searchSearchScanReq: {
            ...scanRequestParams,
            window: {
              ...scanRequestParams.window,
              size: 10 * scanRequestParams.window.size,
            },
          },
        });
        if (!countsResult.ok) {
          throw countsResult.error;
        }

        if (result.value === null) {
          return results;
        }

        results.scans = result.value.map((scan) => {
          const severities = scan.severity_counts as {
            critical: number;
            high: number;
            medium: number;
            low: number;
            unknown: number;
          };
          severities.critical = severities.critical ?? 0;
          severities.high = severities.high ?? 0;
          severities.medium = severities.medium ?? 0;
          severities.low = severities.low ?? 0;
          severities.unknown = severities.unknown ?? 0;

          return {
            ...scan,
            total:
              severities.critical + severities.high + severities.medium + severities.low,
            critical: severities.critical,
            high: severities.high,
            medium: severities.medium,
            low: severities.low,
            unknown: severities.unknown,
          };
        });

        results.currentPage = page;
        results.totalRows = page * pageSize + countsResult.value.count;

        return results;
      },
    };
  },
  scanResults: (filters: {
    scanId: string;
    page: number;
    pageSize: number;
    severity: string[];
    rules: string[];
    visibility: string[];
    order?: {
      sortBy: string;
      descending: boolean;
    };
  }) => {
    return {
      queryKey: [{ filters }],
      queryFn: async () => {
        const { scanId, visibility, severity, rules, page, order, pageSize } = filters;
        // status api
        const statusSecretScanApi = apiWrapper({
          fn: getSecretApiClient().statusSecretScan,
        });
        const statusSecretScanResponse = await statusSecretScanApi({
          modelScanStatusReq: {
            scan_ids: [scanId],
            bulk_scan_id: '',
          },
        });
        if (!statusSecretScanResponse.ok) {
          if (statusSecretScanResponse.error.response.status === 400) {
            return { message: statusSecretScanResponse.error.message };
          }
          throw statusSecretScanResponse.error;
        }

        if (
          !statusSecretScanResponse ||
          !statusSecretScanResponse.value?.statuses?.[scanId]
        ) {
          throw new Error('Scan status not found');
        }

        const scanStatus = statusSecretScanResponse.value?.statuses?.[scanId].status;

        const isScanRunning =
          scanStatus !== ScanStatusEnum.complete && scanStatus !== ScanStatusEnum.error;
        const isScanError = scanStatus === ScanStatusEnum.error;

        if (isScanRunning || isScanError) {
          return {
            scanStatusResult: statusSecretScanResponse.value.statuses[scanId],
          };
        }

        const scanResultsReq: ModelScanResultsReq = {
          fields_filter: {
            contains_filter: {
              filter_in: {},
            },
            match_filter: { filter_in: {} },
            order_filter: { order_fields: [] },
            compare_filter: null,
          },
          scan_id: scanId,
          window: {
            offset: page * pageSize,
            size: pageSize,
          },
        };

        if (severity.length) {
          scanResultsReq.fields_filter.contains_filter.filter_in!['cve_severity'] =
            severity;
        }

        if (rules.length) {
          scanResultsReq.fields_filter.contains_filter.filter_in!['name'] = rules;
        }

        if (visibility.length === 1) {
          scanResultsReq.fields_filter.contains_filter.filter_in!['masked'] = [
            visibility.includes('masked') ? true : false,
          ];
        }

        if (order) {
          scanResultsReq.fields_filter.order_filter.order_fields?.push({
            field_name: order.sortBy,
            descending: order.descending,
          });
        }

        const resultSecretScanApi = apiWrapper({
          fn: getSecretApiClient().resultSecretScan,
        });
        const resultSecretScanResponse = await resultSecretScanApi({
          modelScanResultsReq: scanResultsReq,
        });

        if (!resultSecretScanResponse.ok) {
          throw resultSecretScanResponse.error;
        }

        if (resultSecretScanResponse.value === null) {
          // TODO: handle this case with 404 status maybe
          throw new Error('Error getting scan results');
        }
        const totalSeverity = Object.values(
          resultSecretScanResponse.value.severity_counts ?? {},
        ).reduce((acc, value) => {
          acc = acc + value;
          return acc;
        }, 0);

        const resultCountSecretScanApi = apiWrapper({
          fn: getSecretApiClient().resultCountSecretScan,
        });
        const resultCounts = await resultCountSecretScanApi({
          modelScanResultsReq: {
            ...scanResultsReq,
            window: {
              ...scanResultsReq.window,
              size: 10 * scanResultsReq.window.size,
            },
          },
        });

        if (!resultCounts.ok) {
          throw resultCounts.error;
        }

        return {
          scanStatusResult: statusSecretScanResponse.value.statuses[scanId],
          data: {
            totalSeverity,
            severityCounts: {
              critical: resultSecretScanResponse.value.severity_counts?.['critical'] ?? 0,
              high: resultSecretScanResponse.value.severity_counts?.['high'] ?? 0,
              medium: resultSecretScanResponse.value.severity_counts?.['medium'] ?? 0,
              low: resultSecretScanResponse.value.severity_counts?.['low'] ?? 0,
              unknown: resultSecretScanResponse.value.severity_counts?.['unknown'] ?? 0,
            },
            tableData: resultSecretScanResponse.value.secrets ?? [],
            pagination: {
              currentPage: page,
              totalRows: page * pageSize + resultCounts.value.count,
            },
          },
        };
      },
    };
  },
  top5SecretsForScan: (filters: { scanId: string }) => {
    return {
      queryKey: [{ filters }],
      queryFn: async () => {
        const { scanId } = filters;

        const scanResultsReq: ModelScanResultsReq = {
          fields_filter: {
            contains_filter: {
              filter_in: {},
            },
            match_filter: { filter_in: {} },
            order_filter: {
              order_fields: [
                {
                  field_name: 'score',
                  descending: true,
                },
              ],
            },
            compare_filter: null,
          },
          scan_id: scanId,
          window: {
            offset: 0,
            size: 5,
          },
        };

        const resultSecretScanApi = apiWrapper({
          fn: getSecretApiClient().resultSecretScan,
        });
        const resultSecretScanResponse = await resultSecretScanApi({
          modelScanResultsReq: scanResultsReq,
        });

        if (!resultSecretScanResponse.ok) {
          throw resultSecretScanResponse.error;
        }

        if (resultSecretScanResponse.value === null) {
          // TODO: handle this case with 404 status maybe
          throw new Error('Error getting scan results');
        }

        return {
          data: resultSecretScanResponse.value.secrets,
        };
      },
    };
  },
  scanHistories: (filters: { nodeId: string; nodeType: string }) => {
    const { nodeId, nodeType } = filters;
    return {
      queryKey: [{ filters }],
      queryFn: async () => {
        if (!nodeId || !nodeType) {
          throw new Error('Scan Type, Node Type and Node Id are required');
        }

        const getScanHistory = apiWrapper({
          fn: getSecretApiClient().listSecretScans,
        });

        const result = await getScanHistory({
          modelScanListReq: {
            fields_filter: {
              contains_filter: {
                filter_in: {},
              },
              match_filter: { filter_in: {} },
              order_filter: { order_fields: [] },
              compare_filter: null,
            },
            node_ids: [
              {
                node_id: nodeId.toString(),
                node_type: nodeType.toString() as ModelNodeIdentifierNodeTypeEnum,
              },
            ],
            window: {
              offset: 0,
              size: Number.MAX_SAFE_INTEGER,
            },
          },
        });

        if (!result.ok) {
          console.error(result.error);
          return {
            error: 'Error getting scan history',
            message: result.error.message,
            data: [],
          };
        }

        if (!result.value.scans_info) {
          return {
            data: [],
          };
        }

        return {
          data: result.value.scans_info?.map((res) => {
            return {
              updatedAt: res.updated_at,
              scanId: res.scan_id,
              status: res.status,
            };
          }),
        };
      },
    };
  },
  top5SecretAssets: (filters: { nodeType: 'image' | 'host' | 'container' }) => {
    const { nodeType } = filters;
    return {
      queryKey: [filters],
      queryFn: async () => {
        const top5NodesApi = apiWrapper({
          fn: {
            [ModelNodeIdentifierNodeTypeEnum.Image]:
              getSearchApiClient().searchContainerImages,
            [ModelNodeIdentifierNodeTypeEnum.Host]: getSearchApiClient().searchHosts,
            [ModelNodeIdentifierNodeTypeEnum.Container]:
              getSearchApiClient().searchContainers,
          }[nodeType],
        });
        const top5Nodes = await top5NodesApi({
          searchSearchNodeReq: {
            node_filter: {
              filters: {
                contains_filter: {
                  filter_in: {
                    pseudo: [false],
                    active: [true],
                    secret_scan_status: ['COMPLETE'],
                  },
                },
                match_filter: {
                  filter_in: {},
                },
                order_filter: {
                  order_fields: [
                    {
                      field_name: 'secrets_count',
                      descending: true,
                    },
                  ],
                },
                compare_filter: [
                  {
                    field_name: 'secrets_count',
                    field_value: 0,
                    greater_than: true,
                  },
                ],
              },
              in_field_filter: [],
              window: {
                offset: 0,
                size: 0,
              },
            },
            window: {
              offset: 0,
              size: 5,
            },
          },
        });
        if (!top5Nodes.ok) {
          throw new Error('error getting top 5 container images');
        }

        const top5NodeScansApi = apiWrapper({
          fn: getSearchApiClient().searchSecretsScan,
        });
        const top5NodeScans = await top5NodeScansApi({
          searchSearchScanReq: {
            node_filters: {
              filters: {
                compare_filter: [],
                contains_filter: { filter_in: {} },
                match_filter: { filter_in: {} },
                order_filter: { order_fields: [] },
                not_contains_filter: { filter_in: {} },
              },
              in_field_filter: [],
              window: { offset: 0, size: 0 },
            },
            scan_filters: {
              filters: {
                compare_filter: [],
                contains_filter: {
                  filter_in: {
                    node_id: top5Nodes.value
                      .map((node) => node.secret_latest_scan_id)
                      .filter((scanId) => {
                        return !!scanId?.length;
                      }),
                  },
                },
                match_filter: { filter_in: {} },
                order_filter: { order_fields: [] },
                not_contains_filter: { filter_in: {} },
              },
              in_field_filter: [],
              window: { offset: 0, size: 0 },
            },
            window: {
              offset: 0,
              size: 5,
            },
          },
        });

        if (!top5NodeScans.ok) {
          throw new Error('error getting top 5 scans');
        }

        return top5Nodes.value
          .map((node) => {
            const latestScan = top5NodeScans.value.find(
              (scan) => scan.node_id === node.node_id,
            );
            if (!latestScan) {
              return null;
            }
            return {
              name: latestScan.node_name,
              critical: latestScan.severity_counts?.critical ?? 0,
              high: latestScan.severity_counts?.high ?? 0,
              medium: latestScan.severity_counts?.medium ?? 0,
              low: latestScan.severity_counts?.low ?? 0,
              unknown: latestScan.severity_counts?.unknown ?? 0,
            };
          })
          .reduce<
            Array<{
              name: string;
              critical: number;
              high: number;
              medium: number;
              low: number;
              unknown: number;
            }>
          >((acc, curr) => {
            if (curr) {
              acc.push(curr);
            }
            return acc;
          }, []);
      },
    };
  },
  uniqueSecretsCount: () => {
    return {
      queryKey: ['uniqueSecretsCount'],
      queryFn: async () => {
        const defaultResults: SecretsCountsCardData = {
          total: 0,
          severityBreakdown: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            unknown: 0,
          },
        };
        const searchSecretsCountApi = apiWrapper({
          fn: getSearchApiClient().searchSecretsCount,
        });
        const uniqueSecretsCounts = await searchSecretsCountApi({
          searchSearchNodeReq: {
            node_filter: {
              filters: {
                contains_filter: { filter_in: {} },
                match_filter: { filter_in: {} },
                order_filter: { order_fields: [] },
                compare_filter: null,
              },
              in_field_filter: [],
              window: {
                offset: 0,
                size: 0,
              },
            },
            window: {
              offset: 0,
              size: 999999999,
            },
          },
        });

        if (!uniqueSecretsCounts.ok) {
          // TODO handle error
          return defaultResults;
        }

        return {
          total: uniqueSecretsCounts.value.count,
          severityBreakdown: {
            critical: uniqueSecretsCounts.value.categories?.['critical'] ?? 0,
            high: uniqueSecretsCounts.value.categories?.['high'] ?? 0,
            medium: uniqueSecretsCounts.value.categories?.['medium'] ?? 0,
            low: uniqueSecretsCounts.value.categories?.['low'] ?? 0,
            unknown: uniqueSecretsCounts.value.categories?.['unknown'] ?? 0,
          },
        };
      },
    };
  },
  mostExploitableSecretsCount: () => {
    return {
      queryKey: ['mostExploitableSecretsCount'],
      queryFn: async () => {
        const defaultResults: SecretsCountsCardData = {
          total: 0,
          severityBreakdown: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            unknown: 0,
          },
        };

        const searchSecretsCountApi = apiWrapper({
          fn: getSearchApiClient().searchSecretsCount,
        });
        const mostExploitableSecretCounts = await searchSecretsCountApi({
          searchSearchNodeReq: {
            node_filter: {
              filters: {
                contains_filter: { filter_in: { exploitability_score: [0, 1, 2, 3] } },
                match_filter: { filter_in: {} },
                order_filter: {
                  order_fields: [
                    {
                      size: 1000,
                      field_name: 'exploitability_score',
                      descending: true,
                    },
                  ],
                },
                compare_filter: null,
              },
              in_field_filter: [],
              window: {
                offset: 0,
                size: 0,
              },
            },
            window: {
              offset: 0,
              size: 1000,
            },
          },
        });
        if (!mostExploitableSecretCounts.ok) {
          // TODO handle error
          return defaultResults;
        }

        return {
          total: mostExploitableSecretCounts.value.count,
          severityBreakdown: {
            critical: mostExploitableSecretCounts.value.categories?.['critical'] ?? 0,
            high: mostExploitableSecretCounts.value.categories?.['high'] ?? 0,
            medium: mostExploitableSecretCounts.value.categories?.['medium'] ?? 0,
            low: mostExploitableSecretCounts.value.categories?.['low'] ?? 0,
            unknown: mostExploitableSecretCounts.value.categories?.['unknown'] ?? 0,
          },
        };
      },
    };
  },
  uniqueSecrets: (filters: {
    page?: number;
    order?: {
      sortBy: string;
      descending: boolean;
    };
    pageSize: number;
    severity: string[];
  }) => {
    const { page = 1, order, severity, pageSize } = filters;
    return {
      queryKey: [{ filters }],
      queryFn: async () => {
        const results: {
          secrets: Array<ModelSecret>;
          currentPage: number;
          totalRows: number;
          message?: string;
        } = {
          currentPage: 1,
          totalRows: 0,
          secrets: [],
        };

        const searchSecretsRequestParams: SearchSearchNodeReq = {
          node_filter: {
            filters: {
              contains_filter: { filter_in: {} },
              order_filter: { order_fields: [] },
              match_filter: { filter_in: {} },
              compare_filter: null,
            },
            in_field_filter: null,
            window: {
              offset: 0,
              size: 0,
            },
          },
          window: { offset: page * pageSize, size: pageSize },
        };

        if (severity.length) {
          searchSecretsRequestParams.node_filter.filters.contains_filter.filter_in![
            'level'
          ] = severity;
        }

        if (order) {
          searchSecretsRequestParams.node_filter.filters.order_filter.order_fields = [
            {
              field_name: order.sortBy,
              descending: order.descending,
            },
          ];
        } else {
          searchSecretsRequestParams.node_filter.filters.order_filter.order_fields = [
            {
              field_name: 'level',
              descending: true,
            },
          ];
        }

        const searchSecretsApi = apiWrapper({
          fn: getSearchApiClient().searchSecrets,
        });
        const searchSecretsResponse = await searchSecretsApi({
          searchSearchNodeReq: searchSecretsRequestParams,
        });
        if (!searchSecretsResponse.ok) {
          throw searchSecretsResponse.error;
        }

        const searchSecretsCountApi = apiWrapper({
          fn: getSearchApiClient().searchSecretsCount,
        });
        const searchSecretsCountResponse = await searchSecretsCountApi({
          searchSearchNodeReq: {
            ...searchSecretsRequestParams,
            window: {
              ...searchSecretsRequestParams.window,
              size: 10 * pageSize,
            },
          },
        });
        if (!searchSecretsCountResponse.ok) {
          throw searchSecretsCountResponse.error;
        }

        results.secrets = searchSecretsResponse.value;
        results.currentPage = page;
        results.totalRows = page * pageSize + searchSecretsCountResponse.value.count;

        return results;
      },
    };
  },
  mostExploitableSecrets: (filters: { severity: string[] }) => {
    const { severity } = filters;
    return {
      queryKey: [{ filters }],
      queryFn: async () => {
        const results: {
          secrets: Array<ModelSecret>;
          currentPage: number;
          totalRows: number;
          message?: string;
        } = {
          currentPage: 1,
          totalRows: 0,
          secrets: [],
        };

        const searchSecretsRequestParams: SearchSearchNodeReq = {
          node_filter: {
            filters: {
              contains_filter: { filter_in: { exploitability_score: [0, 1, 2, 3] } },
              order_filter: {
                order_fields: [
                  {
                    size: 1000,
                    field_name: 'exploitability_score',
                    descending: true,
                  },
                ],
              },
              match_filter: { filter_in: {} },
              compare_filter: null,
            },
            in_field_filter: null,
            window: {
              offset: 0,
              size: 0,
            },
          },
          window: { offset: 0, size: 1000 },
        };

        const searchSecretsApi = apiWrapper({
          fn: getSearchApiClient().searchSecrets,
        });
        const searchSecretsResponse = await searchSecretsApi({
          searchSearchNodeReq: searchSecretsRequestParams,
        });

        if (!searchSecretsResponse.ok) {
          throw searchSecretsResponse.error;
        }

        results.secrets = searchSecretsResponse.value;

        if (severity?.length) {
          results.secrets = results.secrets.filter((v) => {
            let match = true;
            if (severity.length && !severity.includes(v.level)) {
              match = false;
            }
            return match;
          });
        }

        return results;
      },
    };
  },
  scanResultSummaryCounts: (filters: { scanId: string }) => {
    return {
      queryKey: [filters],
      queryFn: async () => {
        const { scanId } = filters;
        const resultSecretScanApi = apiWrapper({
          fn: getSecretApiClient().resultSecretScan,
        });
        const secretScanResults = await resultSecretScanApi({
          modelScanResultsReq: {
            scan_id: scanId,
            window: {
              offset: 0,
              size: 1,
            },
            fields_filter: {
              contains_filter: {
                filter_in: {},
              },
              match_filter: {
                filter_in: {},
              },
              order_filter: { order_fields: [] },
              compare_filter: null,
            },
          },
        });

        if (!secretScanResults.ok) {
          console.error(secretScanResults);
          throw new Error("Couldn't get secret scan results");
        }
        return {
          scanId,
          timestamp: secretScanResults.value.created_at,
          counts: secretScanResults.value.severity_counts ?? {},
        };
      },
    };
  },
});
