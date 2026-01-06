import React, { useRef } from 'react';
import { ArrowLeft, Download, TrendingUp, Package, BarChart3 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const CampaignReport = ({ campaign, orders, onBack }) => {
  const reportRef = useRef(); // Reference to the area we want to print
  
  const campaignOrders = orders.filter(o => o.campaignId === campaign.id && o.status === 'delivered');
  const totalRevenue = campaignOrders.reduce((sum, o) => sum + o.total, 0);
  const roiValue = totalRevenue - Number(campaign.budget);

  /**
   * Generates a PDF of the reportRef element
   */
  const handleDownloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin:       10,
      filename:     `${campaign.name}_Report_${campaign.id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="animate-fade-in">
      {/* Header - This part is NOT included in the PDF download */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary btn-sm rounded-circle shadow-sm" onClick={onBack}>
            <ArrowLeft size={18} />
            </button>
            <h2 className="fw-bold mb-0">Campaign Report</h2>
        </div>
        <button className="btn btn-success d-flex align-items-center gap-2 shadow-sm" onClick={handleDownloadPDF}>
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* This DIV is what gets converted to PDF */}
      <div ref={reportRef} className="p-3 bg-white rounded shadow-sm">
        <div className="mb-4 border-bottom pb-3">
          <h2 className="fw-bold text-primary">{campaign.name} - Performance Summary</h2>
          <p className="text-muted mb-0">Target Audience: {campaign.targetAudience} | Campaign ID: {campaign.id}</p>
          <p className="text-muted small">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        {/* KPI Cards */}
        <div className="row g-4 mb-4">
          <div className="col-4">
            <div className="p-3 border rounded bg-light">
              <small className="fw-bold text-muted">TOTAL REVENUE</small>
              <h3 className="fw-bold mb-0">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
          <div className="col-4">
            <div className="p-3 border rounded bg-light">
              <small className="fw-bold text-muted">NET ROI</small>
              <h3 className={`fw-bold mb-0 ${roiValue >= 0 ? 'text-success' : 'text-danger'}`}>
                ₹{roiValue.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
          <div className="col-4">
            <div className="p-3 border rounded bg-light">
              <small className="fw-bold text-muted">TOTAL ORDERS</small>
              <h3 className="fw-bold mb-0">{campaignOrders.length}</h3>
            </div>
          </div>
        </div>

        

        <div className="row g-4">
          <div className="col-8">
            <h5 className="fw-bold mb-3">Order Breakdown</h5>
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th className="text-end">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {campaignOrders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.shippingAddress?.fullName || 'Guest Customer'}</td>
                    <td className="text-end fw-bold">₹{o.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-4">
            <h5 className="fw-bold mb-3">ROI Analysis</h5>
            <div className="p-3 border rounded">
                <div className="d-flex justify-content-between mb-2">
                    <span>Revenue:</span>
                    <span className="text-success fw-bold">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span>Budget:</span>
                    <span className="text-danger"> - ₹{Number(campaign.budget).toLocaleString()}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between h5 fw-bold mb-0">
                    <span>Net Profit:</span>
                    <span className={roiValue >= 0 ? 'text-success' : 'text-danger'}>
                    ₹{roiValue.toLocaleString()}
                    </span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignReport;