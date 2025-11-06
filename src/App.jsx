import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, Edit2, Trash2, Save, X, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import './App.css';

export default function ExecuteFlow() {
  const [projects, setProjects] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [view, setView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showNewIdea, setShowNewIdea] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaType, setNewIdeaType] = useState('AI Solution');
  const [filter, setFilter] = useState('all');
  const [expandedAIs, setExpandedAIs] = useState({});

  // Load from localStorage
  useEffect(() => {
    try {
      const projectsData = localStorage.getItem('executeflow-projects');
      const ideasData = localStorage.getItem('executeflow-ideas');
      
      if (projectsData) setProjects(JSON.parse(projectsData));
      if (ideasData) setIdeas(JSON.parse(ideasData));
    } catch (error) {
      console.log('First time setup');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('executeflow-projects', JSON.stringify(projects));
      localStorage.setItem('executeflow-ideas', JSON.stringify(ideas));
    } catch (error) {
      console.error('Save error:', error);
    }
  }, [projects, ideas]);

  const handleNewIdea = () => {
    if (newIdeaTitle.trim()) {
      const idea = {
        id: Math.max(...ideas.map(i => i.id), 0) + 1,
        title: newIdeaTitle,
        type: newIdeaType,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Brainstorm'
      };
      setIdeas([idea, ...ideas]);
      setNewIdeaTitle('');
      setShowNewIdea(false);
    }
  };

  const handleNewProject = () => {
    const newProject = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      title: 'New Project',
      type: 'AI Solution',
      sector: 'Other',
      stage: 'Ideation',
      description: '',
      aiInsights: { claude: '', chatgpt: '', gemini: '', deepseek: '', grok: '', copilot: '' },
      actions: [],
      blockers: '',
      resources: '',
      financials: '',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setProjects([newProject, ...projects]);
    setSelectedProject(newProject);
    setView('project');
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project });
  };

  const handleSaveProject = () => {
    setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    setSelectedProject(editingProject);
    setEditingProject(null);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    setView('dashboard');
  };

  const handleDeleteIdea = (id) => {
    setIdeas(ideas.filter(i => i.id !== id));
  };

  const handlePromoteIdea = (idea) => {
    const newProject = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      title: idea.title,
      type: idea.type,
      sector: 'Other',
      stage: 'Ideation',
      description: '',
      aiInsights: { claude: '', chatgpt: '', gemini: '', deepseek: '', grok: '', copilot: '' },
      actions: [],
      blockers: '',
      resources: '',
      financials: '',
      createdDate: idea.createdDate
    };
    setProjects([newProject, ...projects]);
    handleDeleteIdea(idea.id);
    setSelectedProject(newProject);
    setView('project');
  };

  const toggleAI = (aid) => {
    setExpandedAIs(prev => ({ ...prev, [aid]: !prev[aid] }));
  };

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.stage === filter);

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
              ExecuteFlow
            </h1>
            <p className="text-slate-400 text-lg">Capture Ideas. Get Multi-AI Feedback. Execute.</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-slate-600">
              <p className="text-slate-400 text-sm font-semibold">Active Projects</p>
              <p className="text-4xl font-bold text-blue-400 mt-2">{projects.length}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-slate-600">
              <p className="text-slate-400 text-sm font-semibold">Ideas Pipeline</p>
              <p className="text-4xl font-bold text-cyan-400 mt-2">{ideas.length}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-slate-600">
              <p className="text-slate-400 text-sm font-semibold">Ready to Execute</p>
              <p className="text-4xl font-bold text-green-400 mt-2">{projects.filter(p => p.stage === 'Ready').length}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-slate-600">
              <p className="text-slate-400 text-sm font-semibold">In Progress</p>
              <p className="text-4xl font-bold text-yellow-400 mt-2">{projects.filter(p => p.stage === 'In Progress').length}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {!showNewIdea ? (
              <button
                onClick={() => setShowNewIdea(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition text-lg shadow-lg"
              >
                <Plus size={24} /> Quick Idea Capture
              </button>
            ) : (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                <input
                  type="text"
                  placeholder="Idea title..."
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  className="w-full bg-slate-700 text-white placeholder-slate-500 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleNewIdea()}
                  autoFocus
                />
                <select
                  value={newIdeaType}
                  onChange={(e) => setNewIdeaType(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>AI Solution</option>
                  <option>AI Execution</option>
                  <option>Research</option>
                  <option>Business Model</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleNewIdea}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowNewIdea(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={handleNewProject}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition text-lg shadow-lg"
            >
              <Plus size={24} /> New Project
            </button>
          </div>

          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded font-semibold transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              All ({projects.length})
            </button>
            {['Ideation', 'Research', 'Planning', 'Ready', 'In Progress', 'Testing', 'Launch'].map(stage => (
              <button
                key={stage}
                onClick={() => setFilter(stage)}
                className={`px-4 py-2 rounded font-semibold transition ${filter === stage ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                {stage} ({projects.filter(p => p.stage === stage).length})
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Projects ({filteredProjects.length})</h2>
            {filteredProjects.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-600">
                <p className="text-slate-400">No projects yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProjects.map(project => (
                  <div
                    key={project.id}
                    className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-5 hover:from-slate-700 hover:to-slate-600 transition cursor-pointer border border-slate-600 hover:border-blue-500"
                    onClick={() => { setSelectedProject(project); setView('project'); }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{project.description || 'No description'}</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="bg-blue-900 text-blue-200 text-xs px-3 py-1 rounded font-semibold">{project.type}</span>
                          <span className="bg-purple-900 text-purple-200 text-xs px-3 py-1 rounded font-semibold">{project.sector}</span>
                          <span className="bg-green-900 text-green-200 text-xs px-3 py-1 rounded font-semibold">{project.stage}</span>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-400" size={24} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Ideas Pipeline ({ideas.length})</h2>
            {ideas.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-600">
                <p className="text-slate-400">No ideas yet. Capture your first idea!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {ideas.map(idea => (
                  <div key={idea.id} className="bg-slate-800 rounded-lg p-4 flex items-start justify-between hover:bg-slate-700 transition border border-slate-600">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{idea.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className="text-slate-400 text-xs bg-slate-700 px-2 py-1 rounded">{idea.type}</span>
                        <span className="text-slate-400 text-xs bg-slate-700 px-2 py-1 rounded">{idea.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePromoteIdea(idea)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                      >
                        Promote
                      </button>
                      <button
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'project' && selectedProject) {
    const project = editingProject || selectedProject;
    const aiTools = [
      { key: 'claude', label: 'Claude', color: 'from-purple-900 to-purple-800' },
      { key: 'chatgpt', label: 'ChatGPT', color: 'from-green-900 to-green-800' },
      { key: 'gemini', label: 'Gemini', color: 'from-blue-900 to-blue-800' },
      { key: 'deepseek', label: 'DeepSeek', color: 'from-red-900 to-red-800' },
      { key: 'grok', label: 'Grok', color: 'from-yellow-900 to-yellow-800' },
      { key: 'copilot', label: 'Copilot', color: 'from-cyan-900 to-cyan-800' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => { setView('dashboard'); setEditingProject(null); }}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition font-semibold"
          >
            <ChevronLeft size={20} /> Back to Dashboard
          </button>

          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-8 border border-slate-600">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                {editingProject ? (
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="text-4xl font-black text-white bg-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 block w-full"
                  />
                ) : (
                  <h1 className="text-4xl font-black text-white mb-3">{project.title}</h1>
                )}
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-blue-900 text-blue-200 text-xs px-3 py-1 rounded font-semibold">{project.type}</span>
                  <span className="bg-purple-900 text-purple-200 text-xs px-3 py-1 rounded font-semibold">{project.sector}</span>
                  <span className="bg-green-900 text-green-200 text-xs px-3 py-1 rounded font-semibold">{project.stage}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {editingProject ? (
                  <>
                    <button onClick={handleSaveProject} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition font-semibold">
                      <Save size={18} /> Save
                    </button>
                    <button onClick={() => setEditingProject(null)} className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded flex items-center gap-2 transition font-semibold">
                      <X size={18} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditProject(project)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition font-semibold">
                      <Edit2 size={18} /> Edit
                    </button>
                    <button onClick={() => handleDeleteProject(project.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 transition font-semibold">
                      <Trash2 size={18} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 font-bold mb-2">Description</label>
                {editingProject ? (
                  <textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-slate-600 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                ) : (
                  <p className="text-white text-lg">{project.description || '(No description)'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-2">Stage</label>
                  {editingProject ? (
                    <select
                      value={editingProject.stage}
                      onChange={(e) => setEditingProject({ ...editingProject, stage: e.target.value })}
                      className="w-full bg-slate-600 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Ideation</option>
                      <option>Research</option>
                      <option>Planning</option>
                      <option>Ready</option>
                      <option>In Progress</option>
                      <option>Testing</option>
                      <option>Launch</option>
                    </select>
                  ) : (
                    <p className="text-white text-lg font-semibold">{project.stage}</p>
                  )}
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-2">Sector</label>
                  {editingProject ? (
                    <select
                      value={editingProject.sector}
                      onChange={(e) => setEditingProject({ ...editingProject, sector: e.target.value })}
                      className="w-full bg-slate-600 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Health</option>
                      <option>Education</option>
                      <option>Housing</option>
                      <option>Manufacturing</option>
                      <option>Pharmaceutical</option>
                      <option>Farming</option>
                      <option>Infrastructure</option>
                      <option>Technology</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    <p className="text-white text-lg font-semibold">{project.sector}</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">🤖 AI Feedback</h3>
                <div className="space-y-3">
                  {aiTools.map(ai => (
                    <div key={ai.key} className={`bg-gradient-to-r ${ai.color} rounded-lg p-3`}>
                      <button
                        onClick={() => toggleAI(ai.key)}
                        className="w-full flex items-center justify-between text-white font-semibold hover:opacity-80"
                      >
                        <span>{ai.label}</span>
                        {expandedAIs[ai.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      {expandedAIs[ai.key] && (
                        <div className="mt-3">
                          {editingProject ? (
                            <textarea
                              value={editingProject.aiInsights[ai.key]}
                              onChange={(e) => setEditingProject({
                                ...editingProject,
                                aiInsights: { ...editingProject.aiInsights, [ai.key]: e.target.value }
                              })}
                              className="w-full bg-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                              rows="3"
                              placeholder={`Add insights from ${ai.label}...`}
                            />
                          ) : (
                            <p className="text-white text-sm">{editingProject.aiInsights[ai.key] || `(No feedback)`}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">📋 Next Actions</label>
                {editingProject ? (
                  <textarea
                    value={editingProject.actions.join('\n')}
                    onChange={(e) => setEditingProject({ ...editingProject, actions: e.target.value.split('\n').filter(a => a.trim()) })}
                    className="w-full bg-slate-600 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="List actions (one per line)"
                  />
                ) : (
                  <ul className="text-white list-disc list-inside">
                    {project.actions.length > 0 ? project.actions.map((a, i) => <li key={i}>{a}</li>) : <li className="text-slate-400">(No actions)</li>}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">⚠️ Blockers</label>
                {editingProject ? (
                  <textarea
                    value={editingProject.blockers}
                    onChange={(e) => setEditingProject({ ...editingProject, blockers: e.target.value })}
                    className="w-full bg-slate-600 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                ) : (
                  <p className="text-white">{project.blockers || '(No blockers)'}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">📚 Resources</label>
                {editingProject ? (
                  <textarea
                    value={editingProject.resources}
                    onChange={(e) => setEditingProject({ ...editingProject, resources: e.target.value })}
                    className="w-full bg-slate-600 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                ) : (
                  <p className="text-white">{project.resources || '(No resources)'}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">💰 Financial Notes</label>
                {editingProject ? (
                  <textarea
                    value={editingProject.financials}
                    onChange={(e) => setEditingProject({ ...editingProject, financials: e.target.value })}
                    className="w-full bg-slate-600 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                ) : (
                  <p className="text-white">{project.financials || '(No financial details)'}</p>
                )}
              </div>

              <p className="text-slate-400 text-sm border-t border-slate-600 pt-4">Created: {project.createdDate}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
