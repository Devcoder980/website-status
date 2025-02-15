import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { checkPageSpeed } from '../lib/pagespeed'; // Your function to check page speed
import { AddWebsite } from './AddWebsite';
import { WebsiteCard } from './WebsiteCard';

interface Website {
  id: string;
  name: string;
  url: string;
}

interface PerformanceMetric {
  id: string;
  website_id: string;
  timestamp: string;
  mobile_score: number;
  desktop_score: number;
  mobile_fcp: number;
  mobile_lcp: number;
  mobile_cls: number;
  mobile_fid: number;
  mobile_inp: number;
  mobile_worst_cluster: number;
  desktop_fcp: number;
  desktop_lcp: number;
  desktop_cls: number;
  desktop_fid: number;
  desktop_inp: number;
  desktop_worst_cluster: number;
  status: string;
}

export const WebsiteList = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [speedFilter, setSpeedFilter] = useState<string>('all');
  const [isCheckingAll, setIsCheckingAll] = useState<boolean>(false);

  // Fetch websites and metrics from Supabase
  const loadWebsites = async () => {
    setLoading(true);
    try {
      const { data: websitesData, error: websitesError } = await supabase
        .from('websites')
        .select('*');
      if (websitesError) throw websitesError;
      setWebsites(websitesData);

      const { data: metricsData, error: metricsError } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      if (metricsError) throw metricsError;

      // Ensure metrics are sorted by timestamp (most recent first)
      const sortedMetrics = (metricsData || []).sort(
        (a: PerformanceMetric, b: PerformanceMetric) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setMetrics(sortedMetrics);
    } catch (err) {
      setError('Failed to load websites.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebsites();
  }, []);

  // Delete website handler
  const handleDeleteWebsite = async (websiteId: string) => {
    if (!confirm('Are you sure you want to delete this website?')) return;
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId);
      if (error) throw error;
      setWebsites((prev) => prev.filter((website) => website.id !== websiteId));
    } catch (err) {
      console.error('Failed to delete website:', err);
    }
  };

  // Get an overall status from the best available score
  const getStatus = (score: number) => {
    if (score >= 90) return 'Good';
    if (score >= 50) return 'Poor';
    return 'Very Poor';
  };

  // Filter websites based on latest metric and filter selections
  const filteredWebsites = websites.filter((website) => {
    const latestMetric = metrics.find((m) => m.website_id === website.id);
    if (!latestMetric) return false;
    const score = Math.max(latestMetric.mobile_score, latestMetric.desktop_score);
    const status = getStatus(score);
    return (
      (statusFilter === 'all' || status === statusFilter) &&
      (speedFilter === 'all' ||
        (speedFilter === 'fast' && score >= 90) ||
        (speedFilter === 'medium' && score >= 50 && score < 90) ||
        (speedFilter === 'slow' && score < 50))
    );
  });

  // Check performance for all websites sequentially
  const checkAllWebsites = async () => {
    setIsCheckingAll(true);
    const queue = [...websites];
    for (const website of queue) {
      try {
        const results = await checkPageSpeed(website.url);
        if (results.status === 'success') {
          const newMetric = {
            website_id: website.id,
            timestamp: new Date().toISOString(),
            ...results,
          };

          const { error } = await supabase.from('performance_metrics').insert([newMetric]);
          if (error) throw error;
          setMetrics((prev) => [newMetric, ...prev]);
        } else {
          console.error(`Failed to check ${website.name}: API returned error status`);
        }
      } catch (err) {
        console.error(`Failed to check ${website.name}:`, err);
      }
      // Wait 2 seconds before the next check
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    setIsCheckingAll(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Activity className="w-6 h-6 mr-2 animate-spin" />
        <span>Loading websites...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Add Website and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
        <AddWebsite onWebsiteAdded={loadWebsites} />
        <div className="bg-white rounded-lg shadow p-4 w-full sm:max-w-md">
          <h2 className="text-lg font-semibold mb-3">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All</option>
                <option value="Good">Good</option>
                <option value="Poor">Poor</option>
                <option value="Very Poor">Very Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Speed</label>
              <select
                value={speedFilter}
                onChange={(e) => setSpeedFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All</option>
                <option value="fast">Fast (≥90)</option>
                <option value="medium">Medium (50-89)</option>
                <option value="slow">Slow (&lt;50)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Check All Websites Button */}
      <div className="mb-6">
        <button
          onClick={checkAllWebsites}
          disabled={isCheckingAll}
          className="inline-flex items-center px-5 py-2 rounded-md shadow bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCheckingAll ? (
            <>
              <Activity className="w-5 h-5 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Performance for All Websites'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Website Cards */}
      {filteredWebsites.length === 0 ? (
        <p className="text-center text-gray-600">No websites match the selected filters.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWebsites.map((website) => {
            const latestMetric = metrics.find((m) => m.website_id === website.id);
            return latestMetric ? (
              <WebsiteCard
                key={website.id}
                website={website}
                metric={latestMetric}
                onDelete={handleDeleteWebsite}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};
