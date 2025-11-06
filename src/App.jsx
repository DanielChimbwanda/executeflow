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
