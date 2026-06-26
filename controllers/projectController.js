const { Project, Task } = require('../models');

// --- Web controllers ---

exports.index = async (req, res) => {
  const projects = await Project.findAll({ where: { userId: req.user.id } });
  res.render('projects/index', { title: 'My Projects', projects });
};

exports.showNew = (req, res) => res.render('projects/new', { title: 'New Project' });

exports.create = async (req, res) => {
  const { title, description, color } = req.body;
  try {
    await Project.create({ title, description, color, userId: req.user.id });
    req.flash('success', 'Project created!');
    res.redirect('/projects');
  } catch (err) {
    req.flash('error', 'Failed to create project.');
    res.redirect('/projects/new');
  }
};

exports.show = async (req, res) => {
  const project = await Project.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [Task]
  });
  if (!project) { req.flash('error', 'Project not found.'); return res.redirect('/projects'); }
  res.render('projects/show', { title: project.title, project });
};

exports.showEdit = async (req, res) => {
  const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!project) { req.flash('error', 'Project not found.'); return res.redirect('/projects'); }
  res.render('projects/edit', { title: 'Edit Project', project });
};

exports.update = async (req, res) => {
  const { title, description, color } = req.body;
  try {
    const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!project) { req.flash('error', 'Project not found.'); return res.redirect('/projects'); }
    await project.update({ title, description, color });
    req.flash('success', 'Project updated!');
    res.redirect(`/projects/${project.id}`);
  } catch (err) {
    req.flash('error', 'Failed to update project.');
    res.redirect(`/projects/${req.params.id}/edit`);
  }
};

exports.destroy = async (req, res) => {
  const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (project) await project.destroy();
  req.flash('success', 'Project deleted.');
  res.redirect('/projects');
};

// --- API controllers ---

exports.apiIndex = async (req, res) => {
  const projects = await Project.findAll({ where: { userId: req.user.id }, include: [Task] });
  res.json(projects);
};

exports.apiCreate = async (req, res) => {
  try {
    const { title, description, color } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required.' });
    const project = await Project.create({ title, description, color, userId: req.user.id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.apiShow = async (req, res) => {
  const project = await Project.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [Task]
  });
  if (!project) return res.status(404).json({ error: 'Project not found.' });
  res.json(project);
};

exports.apiUpdate = async (req, res) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    await project.update(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.apiDestroy = async (req, res) => {
  const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!project) return res.status(404).json({ error: 'Project not found.' });
  await project.destroy();
  res.json({ message: 'Project deleted.' });
};
