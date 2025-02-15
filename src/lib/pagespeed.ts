export interface PageSpeedResult {
  status: 'success' | 'error';
  mobile_score: number;
  desktop_score: number;
  mobile_fcp: number;
  mobile_lcp: number;
  mobile_cls: number;
  mobile_fid: number;
  desktop_fcp: number;
  desktop_lcp: number;
  desktop_cls: number;
  desktop_fid: number;
}

export async function checkPageSpeed(url: string): Promise<PageSpeedResult> {
  const apiKey = 'AIzaSyCiUuFw2SD947Zbudxgb82NCv1ZWLknCFc'; // Your Google PageSpeed Insights API key
  const apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  try {
    // Fetch mobile metrics
    const mobileResponse = await fetch(
      `${apiUrl}?url=${encodeURIComponent(url)}&strategy=mobile&key=${apiKey}`
    );
    const mobileData = await mobileResponse.json();

    // Fetch desktop metrics
    const desktopResponse = await fetch(
      `${apiUrl}?url=${encodeURIComponent(url)}&strategy=desktop&key=${apiKey}`
    );
    const desktopData = await desktopResponse.json();

    // Extract metrics from the API response
    const mobileScore = mobileData.lighthouseResult.categories.performance.score * 100;
    const desktopScore = desktopData.lighthouseResult.categories.performance.score * 100;

    const mobileAudits = mobileData.lighthouseResult.audits;
    const desktopAudits = desktopData.lighthouseResult.audits;

    return {
      status: 'success',
      mobile_score: mobileScore,
      desktop_score: desktopScore,
      mobile_fcp: mobileAudits['first-contentful-paint'].numericValue,
      mobile_lcp: mobileAudits['largest-contentful-paint'].numericValue,
      mobile_cls: mobileAudits['cumulative-layout-shift'].numericValue,
      mobile_fid: mobileAudits['max-potential-fid'].numericValue,
      desktop_fcp: desktopAudits['first-contentful-paint'].numericValue,
      desktop_lcp: desktopAudits['largest-contentful-paint'].numericValue,
      desktop_cls: desktopAudits['cumulative-layout-shift'].numericValue,
      desktop_fid: desktopAudits['max-potential-fid'].numericValue,
    };
  } catch (error) {
    console.error('Error checking page speed:', error);
    return {
      status: 'error',
      mobile_score: 0,
      desktop_score: 0,
      mobile_fcp: 0,
      mobile_lcp: 0,
      mobile_cls: 0,
      mobile_fid: 0,
      desktop_fcp: 0,
      desktop_lcp: 0,
      desktop_cls: 0,
      desktop_fid: 0,
    };
  }
}