const express = require('express');
const router  = express.Router();

// In-memory workflow state (production: use MongoDB)
let workflowState = {
  candidates: {
    c001: { candidateId:'c001', name:'Rajesh Kumar Sharma', status:'approved',      assignedTo:'employee@votewise.in', submittedAt:'2024-05-01', updatedAt:'2024-05-10' },
    c002: { candidateId:'c002', name:'Priya Nair Menon',    status:'under_review',  assignedTo:'employee@votewise.in', submittedAt:'2024-05-05', updatedAt:'2024-05-07' },
    c003: { candidateId:'c003', name:'Amit Tiwari',          status:'pending',       assignedTo:null,                   submittedAt:'2024-05-08', updatedAt:'2024-05-08' },
    c004: { candidateId:'c004', name:'Sunita Devi Yadav',    status:'approved',      assignedTo:'employee@votewise.in', submittedAt:'2024-04-20', updatedAt:'2024-04-28' },
    c005: { candidateId:'c005', name:'Vikram Chandra Gupta', status:'approved',      assignedTo:'employee@votewise.in', submittedAt:'2024-04-15', updatedAt:'2024-04-22' },
    c006: { candidateId:'c006', name:'Ananya Chakraborty',   status:'approved',      assignedTo:'employee@votewise.in', submittedAt:'2024-04-10', updatedAt:'2024-04-18' },
    c007: { candidateId:'c007', name:'Ravi Shankar Das',     status:'approved',      assignedTo:'employee@votewise.in', submittedAt:'2024-04-08', updatedAt:'2024-04-15' },
    c008: { candidateId:'c008', name:'Meera Patil Deshmukh', status:'under_review',  assignedTo:'employee@votewise.in', submittedAt:'2024-05-06', updatedAt:'2024-05-09' },
  },
  updateRequests: [
    { id:'ur1', candidateId:'c001', type:'Profile Update',   status:'pending',  submittedAt:'2024-05-19', note:'Constituency section update' },
    { id:'ur2', candidateId:'c001', type:'Manifesto Update', status:'approved', submittedAt:'2024-05-15', note:'Infrastructure promise added' },
    { id:'ur3', candidateId:'c002', type:'Asset Update',     status:'rejected', submittedAt:'2024-05-12', note:'Document resubmission needed' },
  ],
  tasks: [
    { id:'t1', type:'Candidate Verification', targetId:'c002', assignedTo:'employee@votewise.in', assignedBy:'admin@votewise.in', status:'in_progress', priority:'high',   dueDate:'2024-05-25' },
    { id:'t2', type:'Data Update',            targetId:null,   assignedTo:'employee@votewise.in', assignedBy:'admin@votewise.in', status:'in_progress', priority:'medium', dueDate:'2024-05-28' },
    { id:'t3', type:'Profile Review',         targetId:'c003', assignedTo:null,                   assignedBy:'admin@votewise.in', status:'pending',    priority:'low',    dueDate:'2024-05-30' },
    { id:'t4', type:'Candidate Verification', targetId:'c008', assignedTo:'employee@votewise.in', assignedBy:'admin@votewise.in', status:'pending',    priority:'high',   dueDate:'2024-05-31' },
  ],
};

// GET all workflow statuses
router.get('/candidates', (req, res) => {
  res.json({ success:true, data: Object.values(workflowState.candidates) });
});

// GET status for one candidate
router.get('/candidates/:id', (req, res) => {
  const item = workflowState.candidates[req.params.id];
  if (!item) return res.status(404).json({ success:false, error:'Not found' });
  res.json({ success:true, data: item });
});

// PATCH — update candidate workflow status (admin action)
router.patch('/candidates/:id', (req, res) => {
  const { status, assignedTo } = req.body;
  const item = workflowState.candidates[req.params.id];
  if (!item) return res.status(404).json({ success:false, error:'Not found' });
  if (status)     item.status     = status;
  if (assignedTo) item.assignedTo = assignedTo;
  item.updatedAt = new Date().toISOString().split('T')[0];
  res.json({ success:true, data: item });
});

// GET update requests
router.get('/requests', (req, res) => {
  const { candidateId } = req.query;
  let data = workflowState.updateRequests;
  if (candidateId) data = data.filter(r => r.candidateId === candidateId);
  res.json({ success:true, data });
});

// POST — submit new update request
router.post('/requests', (req, res) => {
  const { candidateId, type, note } = req.body;
  if (!candidateId || !type) return res.status(400).json({ error:'candidateId and type required' });
  const req_ = { id:`ur${Date.now()}`, candidateId, type, status:'pending', submittedAt: new Date().toISOString().split('T')[0], note: note||'' };
  workflowState.updateRequests.push(req_);
  res.status(201).json({ success:true, data: req_ });
});

// GET tasks
router.get('/tasks', (req, res) => {
  const { assignedTo, status } = req.query;
  let data = workflowState.tasks;
  if (assignedTo) data = data.filter(t => t.assignedTo === assignedTo);
  if (status)     data = data.filter(t => t.status === status);
  res.json({ success:true, data });
});

// PATCH task status
router.patch('/tasks/:id', (req, res) => {
  const { status } = req.body;
  const task = workflowState.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error:'Task not found' });
  if (status) task.status = status;
  res.json({ success:true, data: task });
});

// Platform summary for admin
router.get('/summary', (req, res) => {
  const cands = Object.values(workflowState.candidates);
  res.json({
    success: true,
    data: {
      candidates: {
        total:       cands.length,
        approved:    cands.filter(c=>c.status==='approved').length,
        under_review:cands.filter(c=>c.status==='under_review').length,
        pending:     cands.filter(c=>c.status==='pending').length,
        rejected:    cands.filter(c=>c.status==='rejected').length,
      },
      tasks: {
        total:      workflowState.tasks.length,
        pending:    workflowState.tasks.filter(t=>t.status==='pending').length,
        in_progress:workflowState.tasks.filter(t=>t.status==='in_progress').length,
        completed:  workflowState.tasks.filter(t=>t.status==='completed').length,
      },
      updateRequests: {
        total:    workflowState.updateRequests.length,
        pending:  workflowState.updateRequests.filter(r=>r.status==='pending').length,
        approved: workflowState.updateRequests.filter(r=>r.status==='approved').length,
        rejected: workflowState.updateRequests.filter(r=>r.status==='rejected').length,
      }
    }
  });
});

module.exports = router;
