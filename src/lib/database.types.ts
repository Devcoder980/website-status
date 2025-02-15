export interface Database {
    public: {
      Tables: {
        customers: {
          Row: {
            id: string;
            created_at: string;
            updated_at: string;
            name: string;
            company_name: string | null;
            email: string;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            postal_code: string | null;
            country: string;
            notes: string | null;
            last_contacted_at: string | null;
          };
          Insert: {
            id?: string;
            created_at?: string;
            updated_at?: string;
            name: string;
            company_name?: string | null;
            email: string;
            phone?: string | null;
            address?: string | null;
            city?: string | null;
            state?: string | null;
            postal_code?: string | null;
            country?: string;
            notes?: string | null;
            last_contacted_at?: string | null;
          };
          Update: {
            id?: string;
            created_at?: string;
            updated_at?: string;
            name?: string;
            company_name?: string | null;
            email?: string;
            phone?: string | null;
            address?: string | null;
            city?: string | null;
            state?: string | null;
            postal_code?: string | null;
            country?: string;
            notes?: string | null;
            last_contacted_at?: string | null;
          };
        };
        websites: {
          Row: {
            id: string;
            created_at: string;
            updated_at: string;
            customer_id: string | null;
            name: string;
            url: string;
            status: string;
            check_frequency: string;
            last_check_at: string | null;
            next_maintenance_date: string | null;
            maintenance_notes: string | null;
          };
          Insert: {
            id?: string;
            created_at?: string;
            updated_at?: string;
            customer_id?: string | null;
            name: string;
            url: string;
            status?: string;
            check_frequency?: string;
            last_check_at?: string | null;
            next_maintenance_date?: string | null;
            maintenance_notes?: string | null;
          };
          Update: {
            id?: string;
            created_at?: string;
            updated_at?: string;
            customer_id?: string | null;
            name?: string;
            url?: string;
            status?: string;
            check_frequency?: string;
            last_check_at?: string | null;
            next_maintenance_date?: string | null;
            maintenance_notes?: string | null;
          };
        };
        performance_metrics: {
          Row: {
            id: string;
            created_at: string;
            website_id: string;
            mobile_score: number | null;
            desktop_score: number | null;
            mobile_fcp: number | null;
            mobile_lcp: number | null;
            mobile_cls: number | null;
            mobile_fid: number | null;
            desktop_fcp: number | null;
            desktop_lcp: number | null;
            desktop_cls: number | null;
            desktop_fid: number | null;
            status: string | null;
            error_message: string | null;
          };
          Insert: {
            id?: string;
            created_at?: string;
            website_id: string;
            mobile_score?: number | null;
            desktop_score?: number | null;
            mobile_fcp?: number | null;
            mobile_lcp?: number | null;
            mobile_cls?: number | null;
            mobile_fid?: number | null;
            desktop_fcp?: number | null;
            desktop_lcp?: number | null;
            desktop_cls?: number | null;
            desktop_fid?: number | null;
            status?: string | null;
            error_message?: string | null;
          };
          Update: {
            id?: string;
            created_at?: string;
            website_id?: string;
            mobile_score?: number | null;
            desktop_score?: number | null;
            mobile_fcp?: number | null;
            mobile_lcp?: number | null;
            mobile_cls?: number | null;
            mobile_fid?: number | null;
            desktop_fcp?: number | null;
            desktop_lcp?: number | null;
            desktop_cls?: number | null;
            desktop_fid?: number | null;
            status?: string | null;
            error_message?: string | null;
          };
        };
      };
    };
  }
  