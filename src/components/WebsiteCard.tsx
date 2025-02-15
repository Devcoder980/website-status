import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Website {
  id: string;
  name: string;
  url: string;
}

interface PerformanceMetric {
  website_id: string;
  timestamp: string;
  mobile_score: number;
  desktop_score: number;
  mobile_fcp: number;
  mobile_lcp: number; // in ms
  mobile_cls: number;
  mobile_fid: number;
  mobile_inp: number; // in ms
  mobile_worst_cluster: number;
  desktop_fcp: number;
  desktop_lcp: number; // in ms
  desktop_cls: number;
  desktop_fid: number;
  desktop_inp: number; // in ms
  desktop_worst_cluster: number;
  status: string;
}

interface WebsiteCardProps {
  website: Website;
  metric: PerformanceMetric;
  onDelete: (id: string) => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, metric, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper functions to determine status and color based on metric thresholds
  const getLcpStatus = (lcp: number) => {
    // lcp is in ms
    if (lcp <= 2500) return { text: 'Good', color: 'text-green-600' };
    if (lcp <= 4000) return { text: 'Needs Improvement', color: 'text-yellow-600' };
    return { text: 'Poor', color: 'text-red-600' };
  };

  const getClsStatus = (cls: number) => {
    if (cls <= 0.1) return { text: 'Good', color: 'text-green-600' };
    if (cls <= 0.25) return { text: 'Needs Improvement', color: 'text-yellow-600' };
    return { text: 'Poor', color: 'text-red-600' };
  };

  const getInpStatus = (inp: number) => {
    if (inp <= 100) return { text: 'Good', color: 'text-green-600' };
    return { text: 'Poor', color: 'text-red-600' };
  };

  const getWorstClusterStatus = (cluster: number) => {
    if (cluster === 0) return { text: 'Good', color: 'text-green-600' };
    if (cluster === 1) return { text: 'Needs Improvement', color: 'text-yellow-600' };
    return { text: 'Poor', color: 'text-red-600' };
  };

  // Convert ms to seconds with 2 decimal places
  const formatLcp = (ms: number) => (ms / 1000).toFixed(2) + ' s';

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
      {/* Header with website info */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{website.name}</h2>
          <p className="text-sm text-gray-500 break-words">{website.url}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onDelete(website.id)} className="text-red-500 hover:text-red-700" title="Delete">
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700"
            title="Toggle Details"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Summary scores */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <p className="text-sm font-medium">Mobile Score</p>
          <p className="text-2xl font-bold">{metric.mobile_score}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <p className="text-sm font-medium">Desktop Score</p>
          <p className="text-2xl font-bold">{metric.desktop_score}</p>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-6 space-y-6">
          {/* Mobile Metrics */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Mobile Metrics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  Largest Contentful Paint (LCP): {formatLcp(metric.mobile_lcp)}
                </p>
                <p className={`text-xs ${getLcpStatus(metric.mobile_lcp).color}`}>
                  Your local LCP value of {formatLcp(metric.mobile_lcp)} is {getLcpStatus(metric.mobile_lcp).text}.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Cumulative Layout Shift (CLS): {metric.mobile_cls.toFixed(2)}
                </p>
                <p className={`text-xs ${getClsStatus(metric.mobile_cls).color}`}>
                  Your local CLS value of {metric.mobile_cls.toFixed(2)} is {getClsStatus(metric.mobile_cls).text}.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Worst Cluster: {metric.mobile_worst_cluster} shift{metric.mobile_worst_cluster !== 1 ? 's' : ''}
                </p>
                <p className={`text-xs ${getWorstClusterStatus(metric.mobile_worst_cluster).color}`}>
                  {getWorstClusterStatus(metric.mobile_worst_cluster).text}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Interaction to Next Paint (INP): {metric.mobile_inp} ms
                </p>
                <p className={`text-xs ${getInpStatus(metric.mobile_inp).color}`}>
                  Your local INP value of {metric.mobile_inp} ms is {getInpStatus(metric.mobile_inp).text}.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Metrics */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Desktop Metrics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  Largest Contentful Paint (LCP): {formatLcp(metric.desktop_lcp)}
                </p>
                <p className={`text-xs ${getLcpStatus(metric.desktop_lcp).color}`}>
                  Your local LCP value of {formatLcp(metric.desktop_lcp)} is {getLcpStatus(metric.desktop_lcp).text}.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Cumulative Layout Shift (CLS): {metric.desktop_cls.toFixed(2)}
                </p>
                <p className={`text-xs ${getClsStatus(metric.desktop_cls).color}`}>
                  Your local CLS value of {metric.desktop_cls.toFixed(2)} is {getClsStatus(metric.desktop_cls).text}.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Worst Cluster: {metric.desktop_worst_cluster} shift{metric.desktop_worst_cluster !== 1 ? 's' : ''}
                </p>
                <p className={`text-xs ${getWorstClusterStatus(metric.desktop_worst_cluster).color}`}>
                  {getWorstClusterStatus(metric.desktop_worst_cluster).text}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Interaction to Next Paint (INP): {metric.desktop_inp} ms
                </p>
                <p className={`text-xs ${getInpStatus(metric.desktop_inp).color}`}>
                  Your local INP value of {metric.desktop_inp} ms is {getInpStatus(metric.desktop_inp).text}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
