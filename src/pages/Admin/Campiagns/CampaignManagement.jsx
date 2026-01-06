import React, { useState, useEffect } from 'react';
import { campaignAPI, orderAPI, handleApiError } from '../../../services/api';
import { Megaphone, TrendingUp, Calendar, Plus, BarChart3, IndianRupee, Trash2, Clock, ArrowLeft, Package, Users } from 'lucide-react';
import CampaignReport from './CampaignReport';

function CampaignManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    targetAudience: '',
    budget: '',
    startDate: '',
    endDate: ''
  });

  const fetchData = async () => {
    try {
      const orderRes = await orderAPI.getAllOrders();
      setOrders(orderRes.data);

      const campRes = await campaignAPI.getAllCampaigns();
      const today = new Date().toISOString().split('T')[0];

      const validated = await Promise.all(campRes.data.map(async (camp) => {
        if (camp.active && camp.status !== 'Completed' && camp.endDate < today) {
          const updated = { ...camp, status: 'Completed' };
          await campaignAPI.updateCampaign(camp.id, updated);
          return updated;
        }
        return camp;
      }));

      setCampaigns(validated.filter(c => c.active === true));
    } catch (err) {
      console.error(handleApiError(err).message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateROI = (campaignId, budget) => {
    const totalRevenue = orders
      .filter(order => order.campaignId === campaignId && order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);

    const netROI = totalRevenue - Number(budget);
    return `₹${netROI.toLocaleString('en-IN')}`;
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const campaignData = {
      id: `CMP-${Date.now()}`,
      name: newCampaign.name,
      targetAudience: newCampaign.targetAudience, 
      budget: Number(newCampaign.budget), 
      startDate: newCampaign.startDate, 
      endDate: newCampaign.endDate, 
      status: 'Active',
      active: true,
    };

    try {
      const response = await campaignAPI.createCampaign(campaignData);
      setCampaigns(prev => [...prev, response.data]);
      setShowCreateModal(false);
      setNewCampaign({ name: '', targetAudience: '', budget: '', startDate: '', endDate: '' });
    } catch (err) {
      alert(handleApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCampaign = async (camp) => {
    if (window.confirm(`Set status to inactive for "${camp.name}"?`)) {
      try {
        await campaignAPI.updateCampaign(camp.id, { ...camp, active: false });
        setCampaigns(prev => prev.filter(c => c.id !== camp.id));
      } catch (err) {
        alert("Failed to update status");
      }
    }
  };

  const displayedCampaigns = campaigns.filter(c => showCompleted ? true : c.status === 'Active');

  if (selectedReport) {
    return (
      <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <CampaignReport 
          campaign={selectedReport} 
          orders={orders} 
          onBack={() => setSelectedReport(null)} 
        />
      </div>
    );
  }

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold h3 mb-0">Marketing Campaigns & Reporting</h1>
        <div className="d-flex align-items-center gap-3">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="compSwitch" checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />
            <label className="form-check-label small fw-bold" htmlFor="compSwitch">Show Completed</label>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> Launch Campaign
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4">
            <small className="text-muted fw-bold d-block mb-2 text-uppercase">Total Budget</small>
            <h3 className="fw-bold">₹{campaigns.reduce((a,c) => a + Number(c.budget), 0).toLocaleString('en-IN')}</h3>
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div className="card border-0 shadow-sm p-4 bg-light">
             <TrendingUp size={30} className="text-primary mx-auto mb-2" />
             <small className="text-muted fw-bold d-block">ROI LOGIC</small>
             <p className="mb-0 fw-bold">Revenue - Budget</p>
          </div>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="card border-0 shadow-sm p-4">
            <small className="text-muted fw-bold d-block mb-2 text-uppercase">Active Efforts</small>
            <h3 className="fw-bold text-success">{campaigns.filter(c => c.status === 'Active').length}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th>Campaign</th>
                <th>Audience</th>
                <th>Budget</th>
                <th>Timeline</th>
                <th>Status</th>
                <th className="text-primary fw-bold">Net ROI</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedCampaigns.map(camp => (
                <tr key={camp.id}>
                  <td><div className="fw-bold">{camp.name}</div><small className="text-muted">{camp.id}</small></td>
                  <td><span className="badge bg-light text-dark border">{camp.targetAudience}</span></td>
                  <td className="fw-bold">₹{Number(camp.budget).toLocaleString('en-IN')}</td>
                  <td><div className="small text-muted"><Calendar size={12}/> {camp.startDate}</div><div className="small text-muted"><Clock size={12}/> {camp.endDate}</div></td>
                  <td><span className={`badge ${camp.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{camp.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-link p-0 fw-bold text-decoration-none" onClick={() => setSelectedReport(camp)}>
                      <BarChart3 size={16} className="me-1" />
                      {calculateROI(camp.id, camp.budget)}
                    </button>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteCampaign(camp)}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content border-0" onSubmit={handleCreateCampaign}>
              <div className="modal-header border-0"><h5 className="fw-bold">New Targeted Campaign</h5><button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button></div>
              <div className="modal-body">
                <div className="mb-3"><label className="form-label fw-bold small">Campaign Name</label><input type="text" className="form-control shadow-sm" required onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} /></div>
                <div className="mb-3"><label className="form-label fw-bold small">Audience</label>
                  <select className="form-select shadow-sm" required onChange={e => setNewCampaign({...newCampaign, targetAudience: e.target.value})}>
                    <option value="">Select Audience...</option>
                    <option value="All Customers">All Customers</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Loyalty Members">Loyalty Members</option>
                  </select>
                </div>
                <div className="mb-3"><label className="form-label fw-bold small">Budget (₹)</label><input type="number" className="form-control shadow-sm" required onChange={e => setNewCampaign({...newCampaign, budget: e.target.value})} /></div>
                <div className="row g-2">
                  <div className="col-6"><label className="form-label fw-bold small">Start Date</label><input type="date" className="form-control shadow-sm" required onChange={e => setNewCampaign({...newCampaign, startDate: e.target.value})} /></div>
                  <div className="col-6"><label className="form-label fw-bold small">End Date</label><input type="date" className="form-control shadow-sm" required onChange={e => setNewCampaign({...newCampaign, endDate: e.target.value})} /></div>
                </div>
              </div>
              <div className="modal-footer border-0"><button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={isLoading}>{isLoading ? 'Launching...' : 'Confirm Launch'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignManagement;