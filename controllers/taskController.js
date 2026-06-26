const { Task, Project, Tag } = require('../models');

const getOwnedTask = async (taskId, userId) =>
  Task.findOne({
    where: { id: taskId },
    include: [{ model: Project, where: { userId } }, Tag]
  });

// --- Web controllers ---

exports.showNew = async (req, res) => {
  const projects = await Project.findAll({ where: { userId: req.user.id } });
  res.render('tasks/new', { title: 'New Task', projects, projectId: req.query.projectId || '' });
};

exports.create = async (req, res) => {
  const { title, description, status, priority, dueDate, projectId } = req.body;
  try {
    const project = await Project.findOne({ where: { id: projectId, userId: req.user.id } });
    if (!project) { req.flash('error', 'Invalid project.'); return res.redirect('/tasks/new'); }
    await Task.create({ title, description, status, priority, dueDate, projectId });
    req.flash('success', 'Task created!');
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    req.flash('error', 'Failed to create task.');
    res.redirect('/tasks/new');
  }
};

exports.showEdit = async (req, res) => {
  const task = await getOwnedTask(req.params.id, req.user.id);
  if (!task) { req.flash('error', 'Task not found.'); return res.redirect('/projects'); }
  res.render('tasks/edit', { title: 'Edit Task', task });
};

exports.update = async (req, res) => {
  try {
    const task = await getOwnedTask(req.params.id, req.user.id);
    if (!task) { req.flash('error', 'Task not found.'); return res.redirect('/projects'); }
    await task.update(req.body);
    req.flash('success', 'Task updated!');
    res.redirect(`/projects/${task.projectId}`);
  } catch (err) {
    req.flash('error', 'Failed to update task.');
    res.redirect(`/tasks/${req.params.id}/edit`);
  }
};

exports.destroy = async (req, res) => {
  const task = await getOwnedTask(req.params.id, req.user.id);
  if (!task) { req.flash('error', 'Task not found.'); return res.redirect('/projects'); }
  const projectId = task.projectId;
  await task.destroy();
  req.flash('success', 'Task deleted.');
  res.redirect(`/projects/${projectId}`);
};

// --- API controllers ---

exports.apiCreate = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId } = req.body;
    if (!title || !projectId) return res.status(400).json({ error: 'title and projectId are required.' });
    const project = await Project.findOne({ where: { id: projectId, userId: req.user.id } });
    if (!project) return res.status(403).json({ error: 'Project not found or access denied.' });
    const task = await Task.create({ title, description, status, priority, dueDate, projectId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.apiUpdate = async (req, res) => {
  try {
    const task = await getOwnedTask(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.apiDestroy = async (req, res) => {
  const task = await getOwnedTask(req.params.id, req.user.id);
  if (!task) return res.status(404).json({ error: 'Task not found.' });
  await task.destroy();
  res.json({ message: 'Task deleted.' });
};
