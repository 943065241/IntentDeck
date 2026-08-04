const COLORS = ["#d8ff65", "#78a9ff", "#c995ff", "#ff9f6e", "#62d6c5", "#f2cc60"];
const UI_SCALE = 1.25;
const $ = (selector) => document.querySelector(selector);
const uid = () => `node_${Math.random().toString(36).slice(2, 8)}`;
const RECENT_PROJECTS_KEY = "mindspace-recent-projects";
const ACTIVE_PANEL_KEY = "mindspace-active-sidebar-panel";

const STARTER_CONTRACTS = [
  {
    category: "代码", code: "CODE-001", title: "功能实现", color: "#78a9ff",
    content: "根据节点描述实现完整功能。先理解现有工程结构、数据流和编码风格，再进行最小范围修改；保持向后兼容，不破坏无关功能。完成后检查边界情况、错误处理与可维护性，并说明改动结果和验证方式。"
  },
  {
    category: "代码", code: "CODE-002", title: "缺陷诊断与修复", color: "#ff9f6e",
    content: "复现并定位问题的根因，区分现象、直接原因与系统性原因。修复应针对根因且控制影响范围，不改变未被要求的行为；同时检查相邻逻辑是否存在同类问题，并完成与风险相称的验证。"
  },
  {
    category: "代码", code: "CODE-003", title: "代码审查", color: "#c995ff",
    content: "审查实现的正确性、边界条件、安全性、性能、可读性和可维护性。优先报告会导致错误或数据损坏的问题，给出明确位置、触发条件和可执行的修改建议；不要把纯风格偏好当作缺陷。"
  },
  {
    category: "代码", code: "CODE-004", title: "重构优化", color: "#62d6c5",
    content: "在保持外部行为和数据兼容不变的前提下重构代码。减少重复与隐式耦合，明确职责和命名，优先采用现有架构与工具；避免无关的大规模改写，并通过现有测试或等效检查证明行为未改变。"
  },
  {
    category: "代码", code: "CODE-005", title: "自动化测试", color: "#f2cc60",
    content: "为目标功能设计并实现自动化测试，覆盖正常流程、关键边界、失败路径和回归风险。测试应稳定、独立、可重复，避免依赖不确定时间或外部状态；失败信息应能快速定位具体问题。"
  },
  {
    category: "美术", code: "ART-001", title: "UI 视觉设计", color: "#d8ff65",
    content: "根据产品目标设计清晰、一致且可落地的界面视觉。遵循现有设计语言、色彩、字体、间距和组件规范，突出信息层级与主要操作；同时考虑不同尺寸、交互状态、可读性和开发实现成本。"
  },
  {
    category: "美术", code: "ART-002", title: "图标与图形资产", color: "#78a9ff",
    content: "制作与现有产品风格一致的图标或图形资产。保持统一的视觉重量、轮廓、圆角、透视和留白；确保小尺寸下仍清晰可辨，并明确画布尺寸、导出格式、透明背景、颜色模式与命名规则。"
  },
  {
    category: "美术", code: "ART-003", title: "角色与场景概念", color: "#c995ff",
    content: "基于世界观、叙事功能和目标受众设计角色或场景概念。明确主体特征、构图、镜头、光照、材质、色彩气氛与时代信息；保持设定一致，避免无依据增加元素，并提供可供后续制作使用的视觉说明。"
  },
  {
    category: "美术", code: "ART-004", title: "美术资源制作规范", color: "#ff9f6e",
    content: "按项目规范制作可直接交付的美术资源。确认尺寸、比例、分辨率、切图边界、透明通道、色彩空间、压缩方式、文件格式和命名；控制资源体积与平台性能，并保持源文件分层清晰、便于修改。"
  },
  {
    category: "美术", code: "ART-005", title: "视觉验收", color: "#62d6c5",
    content: "依据设计目标与资源规范进行视觉验收。检查构图、层级、对齐、间距、色彩、字体、清晰度、状态完整性和跨尺寸表现；分别列出阻塞问题、建议优化和已符合项，并给出明确可执行的修改标准。"
  }
];

const initialDocument = {
  version: 1,
  title: "产品体验地图",
  viewport: { x: 80, y: 90, zoom: 1 },
  nodes: [
    { id: "root", parentId: null, text: "下一代创作工具", note: "产品思维导图的核心主题", x: 880, y: 660, color: "#d8ff65", shape: "rounded", priority: "none", updatedAt: Date.now() },
    { id: "research", parentId: "root", text: "用户研究", note: "理解核心场景与真实阻力", x: 580, y: 430, color: "#78a9ff", shape: "rounded", priority: "high", updatedAt: Date.now() },
    { id: "interview", parentId: "research", text: "深度访谈", note: "每周 5 位目标用户", x: 310, y: 340, color: "#78a9ff", shape: "pill", priority: "medium", updatedAt: Date.now() },
    { id: "journey", parentId: "research", text: "用户旅程", note: "标记关键情绪和转化点", x: 300, y: 495, color: "#62d6c5", shape: "rounded", priority: "none", updatedAt: Date.now() },
    { id: "experience", parentId: "root", text: "核心体验", note: "围绕低摩擦创作闭环", x: 1160, y: 410, color: "#c995ff", shape: "rounded", priority: "high", updatedAt: Date.now() },
    { id: "canvas", parentId: "experience", text: "无限画布", note: "缩放、平移、选择和多选", x: 1450, y: 310, color: "#c995ff", shape: "rounded", priority: "none", updatedAt: Date.now() },
    { id: "ai", parentId: "experience", text: "AI 协作", note: "理解结构后辅助扩写和整理", x: 1450, y: 470, color: "#ff9f6e", shape: "pill", priority: "medium", updatedAt: Date.now() },
    { id: "delivery", parentId: "root", text: "交付与增长", note: "让内容可被传播与复用", x: 1180, y: 850, color: "#f2cc60", shape: "rounded", priority: "none", updatedAt: Date.now() },
    { id: "share", parentId: "delivery", text: "分享与导出", note: "JSON、PNG 与 SVG", x: 1470, y: 800, color: "#f2cc60", shape: "rounded", priority: "low", updatedAt: Date.now() },
    { id: "template", parentId: "delivery", text: "模板市场", note: "沉淀高价值工作流", x: 1470, y: 930, color: "#62d6c5", shape: "rounded", priority: "none", updatedAt: Date.now() }
  ]
};

let doc = loadDocument();
let selectedId = null;
let selectedIds = new Set();
let selectedConnectionId = null;
let history = [];
let future = [];
let dragging = null;
let resizing = null;
let linking = null;
let reconnecting = null;
let panning = null;
let marquee = null;
let suppressNodeClick = false;
let spacePressed = false;
let saveTimer;
let currentFileHandle = null;
let fileDirty = false;
let nodeClipboard = null;
let pasteOffset = 0;
let contractEditor = null;
let contractSearchQuery = "";
const collapsedContractCategoryIds = new Set();
const collapsedCanvasIds = new Set();
const collapsedOutlineNodeIds = new Set();
let nodeContractPickerQuery = "";
let nodeContractPickerCategoryId = null;

function loadDocument() {
  try { return normalizeDocument(JSON.parse(localStorage.getItem("mindspace-document")) || structuredClone(initialDocument)); }
  catch { return normalizeDocument(structuredClone(initialDocument)); }
}

function seedStarterContractLibrary(value) {
  if ((Number(value.contractLibrarySeedVersion) || 0) >= 1) return;
  const ensureCategory = (name) => {
    let category = value.contractCategories.find((item) => item.name === name);
    if (!category) {
      const preferredId = `category_${name === "代码" ? "code" : "art"}`;
      const id = value.contractCategories.some((item) => item.id === preferredId) ? `category_${Math.random().toString(36).slice(2, 9)}` : preferredId;
      category = { id, name };
      value.contractCategories.push(category);
    }
    return category;
  };
  STARTER_CONTRACTS.forEach((template, index) => {
    if (value.contracts.some((contract) => String(contract.title || "").trim().toLowerCase() === template.title.toLowerCase())) return;
    const category = ensureCategory(template.category);
    value.contracts.push({
      id: `contract_starter_${template.code.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
      code: template.code,
      title: template.title,
      content: template.content,
      categoryId: category.id,
      color: template.color || COLORS[index % COLORS.length],
      updatedAt: Date.now()
    });
  });
  value.contractLibrarySeedVersion = 1;
}

function normalizeDocument(value) {
  if (!value || (!Array.isArray(value.nodes) && !Array.isArray(value.canvases))) throw new Error("Invalid Mindspace document");
  if (!Array.isArray(value.canvases)) {
    const legacyNodes = value.nodes;
    const legacyRelationships = value.relationships || [];
    const legacyViewport = value.viewport || { x: 80, y: 90, zoom: 1 };
    value.canvases = [{
      id: "main",
      title: value.title || "主画布",
      parentCanvasId: null,
      ownerNodeId: null,
      rootNodeId: legacyNodes.find((node) => node.id === "root")?.id || legacyNodes.find((node) => node.parentId === null)?.id || null,
      viewport: legacyViewport,
      nodes: legacyNodes,
      relationships: legacyRelationships
    }];
    delete value.nodes;
    delete value.relationships;
    delete value.viewport;
  }
  if (!value.canvases.length) throw new Error("Invalid Mindspace document");
  delete value.nodes;
  delete value.relationships;
  delete value.viewport;
  value.version = 3;
  value.projectId ||= `project_${Math.random().toString(36).slice(2, 10)}`;
  value.title = String(value.title || "未命名工程");
  value.contractCategories = Array.isArray(value.contractCategories) ? value.contractCategories : [];
  value.contractCategories = value.contractCategories.map((category, index) => ({
    id: String(category.id || `category_${Math.random().toString(36).slice(2, 8)}`),
    name: String(category.name || `未命名类目 ${index + 1}`)
  }));
  value.contracts = Array.isArray(value.contracts) ? value.contracts : [];
  seedStarterContractLibrary(value);
  if (value.contracts.length && !value.contractCategories.length) value.contractCategories.push({ id: "category_uncategorized", name: "未分类" });
  const categoryIds = new Set(value.contractCategories.map((category) => category.id));
  value.contracts = value.contracts.map((contract, index) => ({
    id: String(contract.id || `contract_${Math.random().toString(36).slice(2, 8)}`),
    code: String(contract.code || ""),
    title: String(contract.title || "未命名合约"),
    content: String(contract.content || contract.prompt || ""),
    categoryId: categoryIds.has(contract.categoryId) ? contract.categoryId : value.contractCategories[0]?.id || null,
    color: /^#[0-9a-f]{6}$/i.test(contract.color || "") ? contract.color : COLORS[index % COLORS.length],
    updatedAt: Number(contract.updatedAt) || Date.now()
  }));
  const validContractIds = new Set(value.contracts.map((contract) => contract.id));
  value.canvases.forEach((canvas, index) => {
    canvas.id ||= index === 0 ? "main" : `canvas_${Math.random().toString(36).slice(2, 8)}`;
    canvas.title ||= index === 0 ? "主画布" : "子画布";
    canvas.parentCanvasId ??= null;
    canvas.ownerNodeId ??= null;
    canvas.viewport ||= { x: 80, y: 90, zoom: 1 };
    canvas.nodes ||= [];
    canvas.relationships ||= [];
    canvas.nodes.forEach((node) => {
      node.note = String(node.note || "");
      node.aiPrompt = String(node.aiPrompt || "");
      const references = Array.isArray(node.contractIds) ? node.contractIds : (node.contractId ? [node.contractId] : []);
      node.contractIds = [...new Set(references.filter((id) => validContractIds.has(id)))];
      delete node.contractId;
    });
    canvas.rootNodeId ||= canvas.nodes.find((node) => node.id === "root")?.id || canvas.nodes.find((node) => node.parentId === null)?.id || null;
  });
  value.mainCanvasId ||= value.canvases.find((canvas) => canvas.parentCanvasId === null)?.id || value.canvases[0].id;
  if (!value.canvases.some((canvas) => canvas.id === value.activeCanvasId)) value.activeCanvasId = value.mainCanvasId;
  const validCanvasIds = new Set(value.canvases.map((canvas) => canvas.id));
  value.openCanvasIds = Array.isArray(value.openCanvasIds) ? value.openCanvasIds.filter((id) => validCanvasIds.has(id)) : [];
  value.openCanvasIds = [...new Set([value.mainCanvasId, ...value.openCanvasIds, value.activeCanvasId])];
  Object.defineProperties(value, {
    nodes: { configurable: true, get() { return currentCanvas(value).nodes; }, set(nodes) { currentCanvas(value).nodes = nodes; } },
    relationships: { configurable: true, get() { return currentCanvas(value).relationships; }, set(relationships) { currentCanvas(value).relationships = relationships; } },
    viewport: { configurable: true, get() { return currentCanvas(value).viewport; }, set(viewport) { currentCanvas(value).viewport = viewport; } }
  });
  return value;
}

function currentCanvas(documentValue = doc) {
  return documentValue.canvases.find((canvas) => canvas.id === documentValue.activeCanvasId)
    || documentValue.canvases.find((canvas) => canvas.id === documentValue.mainCanvasId)
    || documentValue.canvases[0];
}

function findCanvas(canvasId) { return doc.canvases.find((canvas) => canvas.id === canvasId); }

function findNodeAcrossCanvases(nodeId) {
  for (const canvas of doc.canvases) {
    const node = canvas.nodes.find((item) => item.id === nodeId);
    if (node) return { canvas, node };
  }
  return null;
}

function createBlankDocument(title = "未命名工程") {
  return normalizeDocument({
    version: 1,
    title,
    viewport: { x: 0, y: 0, zoom: 1 },
    relationships: [],
    nodes: [{ id: "root", parentId: null, text: "中心主题", note: "", aiPrompt: "", contractIds: [], x: 1000, y: 760, color: COLORS[0], shape: "rounded", priority: "none", updatedAt: Date.now() }]
  });
}

function getRecentProjects() {
  try { return JSON.parse(localStorage.getItem(RECENT_PROJECTS_KEY)) || []; }
  catch { return []; }
}

function rememberProject() {
  const recent = getRecentProjects().filter((item) => item.id !== doc.projectId);
  recent.unshift({ id: doc.projectId, title: doc.title, updatedAt: Date.now(), document: structuredClone(doc) });
  try { localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(recent.slice(0, 8))); }
  catch { /* Browser storage is only a convenience; file saving still works. */ }
}

function setSaveState(message, state = "saved") {
  $("#saveState").dataset.state = state;
  $("#saveState").innerHTML = `<i></i> ${message}`;
}

function snapshot() {
  history.push(JSON.stringify(doc));
  if (history.length > 60) history.shift();
  future = [];
}

function commit(message = "已保存") {
  clearTimeout(saveTimer);
  fileDirty = true;
  setSaveState("自动保存中…", "saving");
  saveTimer = setTimeout(() => {
    localStorage.setItem("mindspace-document", JSON.stringify(doc));
    rememberProject();
    setSaveState(currentFileHandle ? "文件有未保存修改" : "已自动保存", "dirty");
    if (["projects", "canvases"].includes($(".rail-item.active")?.dataset.panel)) renderPanel();
  }, 180);
}

function render() {
  $("#documentTitle").textContent = doc.title;
  renderCanvasNavigation();
  renderCanvasTabs();
  renderNodes();
  renderConnections();
  updateTransform();
  renderPanel();
  renderInspector();
  renderSelectionState();
}

function renderCanvasTabs() {
  doc.openCanvasIds = doc.openCanvasIds.filter((canvasId) => Boolean(findCanvas(canvasId)));
  if (!doc.openCanvasIds.includes(doc.mainCanvasId)) doc.openCanvasIds.unshift(doc.mainCanvasId);
  if (!doc.openCanvasIds.includes(doc.activeCanvasId)) doc.openCanvasIds.push(doc.activeCanvasId);
  $("#canvasTabs").innerHTML = doc.openCanvasIds.map((canvasId) => {
    const canvas = findCanvas(canvasId);
    const active = canvasId === doc.activeCanvasId;
    return `<div class="canvas-tab ${active ? "active" : ""}"><button class="canvas-tab-select" type="button" role="tab" aria-selected="${active}" data-tab-canvas="${escapeHtml(canvasId)}" title="${escapeHtml(canvasDisplayName(canvas))}"><span class="canvas-tab-label">${escapeHtml(canvasDisplayName(canvas))}</span></button>${canvasId === doc.mainCanvasId ? "" : `<button class="canvas-tab-close" type="button" data-close-canvas-tab="${escapeHtml(canvasId)}" aria-label="关闭 ${escapeHtml(canvasDisplayName(canvas))} 页签" title="关闭页签">×</button>`}</div>`;
  }).join("");
  document.querySelectorAll("[data-tab-canvas]").forEach((button) => button.addEventListener("click", () => openCanvas(button.dataset.tabCanvas)));
  document.querySelectorAll("[data-close-canvas-tab]").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); closeCanvasTab(button.dataset.closeCanvasTab); }));
  requestAnimationFrame(() => document.querySelector(".canvas-tab.active")?.scrollIntoView({ block: "nearest", inline: "nearest" }));
}

function closeCanvasTab(canvasId) {
  if (canvasId === doc.mainCanvasId) return;
  doc.openCanvasIds = doc.openCanvasIds.filter((id) => id !== canvasId);
  if (doc.activeCanvasId === canvasId) {
    const fallbackId = doc.openCanvasIds.at(-1) || doc.mainCanvasId;
    openCanvas(fallbackId);
    return;
  }
  localStorage.setItem("mindspace-document", JSON.stringify(doc));
  renderCanvasTabs();
}

function canvasDisplayName(canvas) {
  if (canvas.id === doc.mainCanvasId) return "主画布";
  const owner = findNodeAcrossCanvases(canvas.ownerNodeId);
  return owner?.node.text || canvas.title || "子画布";
}

function renderCanvasNavigation() {
  const active = currentCanvas();
  const path = [];
  const visited = new Set();
  let canvas = active;
  while (canvas && !visited.has(canvas.id)) {
    path.unshift(canvas);
    visited.add(canvas.id);
    canvas = canvas.parentCanvasId ? findCanvas(canvas.parentCanvasId) : null;
  }
  const back = $("#canvasBack");
  back.disabled = !active.parentCanvasId;
  $("#canvasBreadcrumbs").innerHTML = path.map((item) => `<button class="canvas-crumb" type="button" data-canvas-id="${item.id}" title="进入 ${escapeHtml(canvasDisplayName(item))}">${escapeHtml(canvasDisplayName(item))}</button>`).join("");
  document.querySelectorAll(".canvas-crumb").forEach((button) => button.addEventListener("click", () => openCanvas(button.dataset.canvasId)));
}

function openCanvas(canvasId, fit = false) {
  if (!findCanvas(canvasId)) return;
  if (!doc.openCanvasIds.includes(canvasId)) doc.openCanvasIds.push(canvasId);
  if (canvasId === doc.activeCanvasId) { renderCanvasTabs(); return; }
  doc.activeCanvasId = canvasId;
  selectedConnectionId = null;
  selectedId = null;
  selectedIds.clear();
  $("#workspace").classList.remove("inspector-open");
  $("#inspector").setAttribute("aria-hidden", "true");
  localStorage.setItem("mindspace-document", JSON.stringify(doc));
  render();
  if (fit) requestAnimationFrame(() => fitView(false));
}

function createNodeCanvas() {
  const owner = selectedNode();
  if (!owner) return;
  if (owner.childCanvasId && findCanvas(owner.childCanvasId)) { openCanvas(owner.childCanvasId); return; }
  snapshot();
  const canvasId = `canvas_${Math.random().toString(36).slice(2, 9)}`;
  const rootNodeId = uid();
  doc.canvases.push({
    id: canvasId,
    title: owner.text,
    parentCanvasId: doc.activeCanvasId,
    ownerNodeId: owner.id,
    rootNodeId,
    viewport: { x: 0, y: 0, zoom: 1 },
    relationships: [],
    nodes: [{ id: rootNodeId, parentId: null, text: owner.text, note: "", aiPrompt: "", contractIds: [], x: 1000, y: 760, color: owner.color, shape: "rounded", priority: "none", updatedAt: Date.now() }]
  });
  owner.childCanvasId = canvasId;
  owner.updatedAt = Date.now();
  doc.activeCanvasId = canvasId;
  doc.openCanvasIds.push(canvasId);
  selectedConnectionId = null;
  selectedId = null;
  selectedIds.clear();
  $("#workspace").classList.remove("inspector-open");
  $("#inspector").setAttribute("aria-hidden", "true");
  commit();
  render();
  requestAnimationFrame(() => fitView(false));
  toast("子画布已创建");
}

function canvasBranchIds(canvasId) {
  const ids = ne…17450 tokens truncated…forEach((button) => button.addEventListener("click", () => moveContractToTop(button.dataset.pinContract)));
  $("[data-delete-contract-editor]")?.addEventListener("click", () => deleteContract(findContract(contractEditor?.id)));
  $("[data-cancel-contract]")?.addEventListener("click", closeContractEditor);
  const editorForm = $("#contractEditorForm");
  editorForm?.querySelectorAll("[name]").forEach((field) => {
    const rememberDraft = () => {
      if (contractEditor?.type === "contract") {
        contractEditor.draft ||= {};
        contractEditor.draft[field.name] = field.value;
      }
    };
    field.addEventListener("input", rememberDraft);
    field.addEventListener("change", rememberDraft);
  });
  const titleInput = editorForm?.querySelector("[name=title]");
  const titleError = $("#contractTitleError");
  const saveContractButton = editorForm?.querySelector("[data-save-contract]");
  const validateContractTitle = () => {
    if (!titleInput) return true;
    const title = titleInput.value.trim().toLowerCase();
    const duplicate = Boolean(title) && doc.contracts.some((contract) => contract.title.trim().toLowerCase() === title && contract.id !== contractEditor?.id);
    titleInput.classList.toggle("invalid", duplicate);
    titleInput.setAttribute("aria-invalid", String(duplicate));
    if (titleError) titleError.hidden = !duplicate;
    if (saveContractButton) saveContractButton.disabled = duplicate;
    return !duplicate;
  };
  titleInput?.addEventListener("input", validateContractTitle);
  validateContractTitle();
  editorForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const categoryId = String(contractEditor?.draft?.categoryId || "");
    const content = String(form.get("content") || "").trim();
    const color = String(form.get("color") || "");
    if (!title || !content) { toast("请填写标题和合约内容"); return; }
    if (!doc.contractCategories.some((category) => category.id === categoryId)) { toast("所属类目不存在"); return; }
    if (!validateContractTitle()) { titleInput?.focus(); toast("合约标题不能重复"); return; }
    snapshot();
    const existing = contractEditor?.id && findContract(contractEditor.id);
    if (existing) Object.assign(existing, { title, categoryId, content, color, updatedAt: Date.now() });
    else doc.contracts.push({ id: `contract_${Math.random().toString(36).slice(2, 9)}`, title, categoryId, content, color, updatedAt: Date.now() });
    contractEditor = null;
    commit(); renderPanel(); renderInspector(); toast(existing ? "合约已更新" : "合约已创建");
  });
}

function formatRecentTime(value) {
  return new Date(value).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
}

function canvasTreeHtml(parentCanvasId = null, depth = 0) {
  return doc.canvases
    .filter((canvas) => canvas.parentCanvasId === parentCanvasId)
    .map((canvas) => {
      const hasChildren = doc.canvases.some((child) => child.parentCanvasId === canvas.id);
      const collapsed = hasChildren && collapsedCanvasIds.has(canvas.id);
      const toggle = hasChildren
        ? `<button class="canvas-tree-toggle" type="button" data-toggle-canvas-tree="${escapeHtml(canvas.id)}" aria-label="${collapsed ? "展开" : "折叠"} ${escapeHtml(canvasDisplayName(canvas))}" aria-expanded="${!collapsed}"><i aria-hidden="true">›</i></button>`
        : `<span class="canvas-tree-spacer" aria-hidden="true"></span>`;
      return `<div class="canvas-tree-row${collapsed ? " collapsed" : ""}" style="--depth:${depth}">${toggle}<button class="list-button ${canvas.id === doc.activeCanvasId ? "active" : ""}" data-open-canvas="${escapeHtml(canvas.id)}"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h5"/></svg><span>${escapeHtml(canvasDisplayName(canvas))}</span></button></div>${collapsed ? "" : canvasTreeHtml(canvas.id, depth + 1)}`;
    })
    .join("");
}

function outlineHtml(parentId = null, depth = 0) {
  const existingIds = new Set(doc.nodes.map((node) => node.id));
  const children = doc.nodes.filter((node) => parentId === null
    ? node.parentId === null || !existingIds.has(node.parentId)
    : node.parentId === parentId);
  return children.map((node) => {
    const hasChildren = doc.nodes.some((child) => child.parentId === node.id);
    const collapsed = hasChildren && collapsedOutlineNodeIds.has(node.id);
    const toggle = hasChildren
      ? `<button class="outline-tree-toggle" type="button" data-toggle-outline-node="${escapeHtml(node.id)}" aria-label="${collapsed ? "展开" : "折叠"} ${escapeHtml(node.text)}" aria-expanded="${!collapsed}"><i aria-hidden="true">›</i></button>`
      : `<span class="outline-tree-spacer" aria-hidden="true"></span>`;
    return `<div class="outline-tree-row${collapsed ? " collapsed" : ""}" style="--depth:${depth}">${toggle}<button class="list-button ${selectedIds.has(node.id) ? "active" : ""}" data-node-id="${escapeHtml(node.id)}"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M16 12h5"/></svg><span>${escapeHtml(node.text)}</span></button></div>${collapsed ? "" : outlineHtml(node.id, depth + 1)}`;
  }).join("");
}

function runPanelAction(action) {
  if (action === "child") addChild();
  if (action === "topic") addChild("root");
  if (action === "new-project") newProject();
  if (action === "open-project") openProject();
  if (action === "save-project") saveProject();
  if (action === "save-as") saveProjectAs();
  if (action === "fit") fitView();
  if (action === "reset" && confirm("恢复示例工程？当前本地修改会被替换。")) { snapshot(); doc = normalizeDocument(structuredClone(initialDocument)); contractEditor = null; contractSearchQuery = ""; closeInspector(); commit(); fitView(); toast("已恢复示例工程"); }
}

function downloadDocument() {
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${safeFileName(doc.title)}.mindspace.json`; link.click(); URL.revokeObjectURL(link.href);
  fileDirty = false;
  setSaveState("已下载工程文件");
  toast("工程文件已下载");
}

function safeFileName(value) { return String(value).replace(/[\\/:*?"<>|]/g, "-").trim() || "未命名工程"; }

async function newProject() {
  const name = prompt("新工程名称", "未命名工程");
  if (name === null) return;
  currentFileHandle = null;
  doc = createBlankDocument(name.trim() || "未命名工程");
  contractEditor = null;
  contractSearchQuery = "";
  selectedConnectionId = null;
  selectedId = null;
  selectedIds.clear();
  history = [];
  future = [];
  fileDirty = true;
  closeInspector();
  commit();
  requestAnimationFrame(() => fitView(false));
  toast("已新建工程");
}

async function openProject() {
  if ("showOpenFilePicker" in window) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: "Mindspace 工程", accept: { "application/json": [".json", ".mindspace.json"] } }],
        multiple: false
      });
      await importDocument(await handle.getFile(), handle);
      return;
    } catch (error) {
      if (error.name !== "AbortError") toast("无法打开工程文件");
      return;
    }
  }
  $("#fileInput").click();
}

async function saveProject() {
  if (!currentFileHandle) {
    clearTimeout(saveTimer);
    localStorage.setItem("mindspace-document", JSON.stringify(doc));
    rememberProject();
    fileDirty = false;
    setSaveState("已保存到本地");
    renderPanel();
    toast("工程已保存");
    return;
  }
  try {
    await writeProjectFile(currentFileHandle);
    fileDirty = false;
    rememberProject();
    setSaveState("已保存到文件");
    toast("工程已保存");
  } catch (error) {
    if (error.name !== "AbortError") toast("保存失败，请尝试另存为");
  }
}

function addFreeNodeAtCanvasPoint(event) {
  if (event.button !== 0 || spacePressed || event.target.closest(".mind-node, .connection-hit, .connection-endpoint, .connection-label, .canvas-tabs, .zoom-control, .canvas-hint, .selection-badge")) return;
  event.preventDefault();
  const rect = $("#canvas").getBoundingClientRect();
  const worldX = ((event.clientX - rect.left) / UI_SCALE - doc.viewport.x) / doc.viewport.zoom;
  const worldY = ((event.clientY - rect.top) / UI_SCALE - doc.viewport.y) / doc.viewport.zoom;
  snapshot();
  const id = uid();
  doc.nodes.push({ id, parentId: null, text: "自由主题", note: "", aiPrompt: "", contractIds: [], x: worldX - 64, y: worldY - 22, color: COLORS[1], shape: "rounded", priority: "none", updatedAt: Date.now() });
  commit();
  selectNode(id, true);
}

async function saveProjectAs() {
  if (!("showSaveFilePicker" in window)) return downloadDocument();
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `${safeFileName(doc.title)}.mindspace.json`,
      types: [{ description: "Mindspace 工程", accept: { "application/json": [".mindspace.json", ".json"] } }]
    });
    await writeProjectFile(handle);
    currentFileHandle = handle;
    fileDirty = false;
    rememberProject();
    setSaveState("已保存到文件");
    renderPanel();
    toast("工程已另存为");
  } catch (error) {
    if (error.name !== "AbortError") toast("无法保存工程文件");
  }
}

async function writeProjectFile(handle) {
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(doc, null, 2));
  await writable.close();
}

async function importDocument(file, handle = null) {
  try {
    const next = normalizeDocument(JSON.parse(await file.text()));
    doc = next;
    contractEditor = null;
    contractSearchQuery = "";
    currentFileHandle = handle;
    selectedConnectionId = null;
    selectedId = null;
    selectedIds.clear();
    history = [];
    future = [];
    fileDirty = false;
    localStorage.setItem("mindspace-document", JSON.stringify(doc));
    rememberProject();
    closeInspector();
    render();
    requestAnimationFrame(() => fitView(false));
    setSaveState(handle ? `已打开 ${file.name}` : "已导入工程");
    toast("工程打开成功");
  } catch {
    toast("无法读取：不是有效的 Mindspace 工程文件");
  }
}

function openRecentProject(projectId) {
  const item = getRecentProjects().find((project) => project.id === projectId);
  if (!item) return;
  try {
    doc = normalizeDocument(structuredClone(item.document));
    contractEditor = null;
    contractSearchQuery = "";
    currentFileHandle = null;
    selectedConnectionId = null;
    selectedId = null;
    selectedIds.clear();
    history = [];
    future = [];
    fileDirty = false;
    localStorage.setItem("mindspace-document", JSON.stringify(doc));
    closeInspector();
    render();
    requestAnimationFrame(() => fitView(false));
    setSaveState("已打开本地快照");
    toast("已打开最近工程");
  } catch { toast("最近工程已损坏，无法打开"); }
}

function undo() {
  if (!history.length) return; future.push(JSON.stringify(doc)); doc = normalizeDocument(JSON.parse(history.pop())); selectedIds = new Set([...selectedIds].filter((id) => doc.nodes.some((node) => node.id === id))); selectedId = selectedIds.has(selectedId) ? selectedId : (selectedIds.values().next().value || null); selectedConnectionId = getConnectionContext(selectedConnectionId) ? selectedConnectionId : null; commit(); render();
}
function redo() { if (!future.length) return; history.push(JSON.stringify(doc)); doc = normalizeDocument(JSON.parse(future.pop())); selectedIds = new Set([...selectedIds].filter((id) => doc.nodes.some((node) => node.id === id))); selectedId = selectedIds.has(selectedId) ? selectedId : (selectedIds.values().next().value || null); selectedConnectionId = getConnectionContext(selectedConnectionId) ? selectedConnectionId : null; commit(); render(); }
function toggleSidebar(force) { $("#workspace").classList.toggle("sidebar-hidden", force ?? !$("#workspace").classList.contains("sidebar-hidden")); }
function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(el.timer); el.timer = setTimeout(() => el.classList.remove("show"), 1800); }
function escapeHtml(value) { return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char])); }

$("#sidebarToggle").addEventListener("click", () => toggleSidebar());
$("#aboutButton").addEventListener("click", () => {
  const dialog = $("#aboutDialog");
  if (!dialog.open) dialog.showModal();
});
$("#aboutDialogClose").addEventListener("click", () => $("#aboutDialog").close());
$("#aboutDialogConfirm").addEventListener("click", () => $("#aboutDialog").close());
$("#aboutDialog").addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
$("#canvasBack").addEventListener("click", () => { const parentId = currentCanvas().parentCanvasId; if (parentId) openCanvas(parentId); });
$("#panelClose").addEventListener("click", () => {
  if (contractEditor && !confirmDiscardContractChanges()) return;
  contractEditor = null;
  toggleSidebar(true);
  renderPanel();
});
$("#contractDrawerClose").addEventListener("click", closeContractEditor);
$("#inspectorClose").addEventListener("click", closeInspector);
$("#addChild").addEventListener("click", () => addChild());
$("#duplicateNode").addEventListener("click", duplicateSelected);
$("#deleteNode").addEventListener("click", deleteSelected);
$("#saveButton").addEventListener("click", saveProject);
$("#undoButton").addEventListener("click", undo);
$("#redoButton").addEventListener("click", redo);
$("#zoomIn").addEventListener("click", () => setZoom(doc.viewport.zoom + .1));
$("#zoomOut").addEventListener("click", () => setZoom(doc.viewport.zoom - .1));
$("#zoomValue").addEventListener("click", () => setZoom(1));
$("#fitView").addEventListener("click", fitView);
$("#documentTitle").addEventListener("click", () => { const name = prompt("工程名称", doc.title); if (name?.trim()) { snapshot(); doc.title = name.trim(); commit(); render(); } });
$("#nodeText").addEventListener("input", (event) => updateNode("text", event.target.value));
$("#nodeNote").addEventListener("input", (event) => updateNode("note", event.target.value));
$("#nodeAiPrompt").addEventListener("input", (event) => updateNode("aiPrompt", event.target.value));
$("#addNodeContract").addEventListener("click", () => {
  const node = selectedNode();
  if (!node) return;
  const opening = $("#nodeContractPicker").hidden;
  if (opening) {
    nodeContractPickerQuery = "";
    nodeContractPickerCategoryId = null;
  }
  renderNodeContractPicker(node);
  $("#nodeContractPicker").hidden = !opening;
  $("#addNodeContract").setAttribute("aria-expanded", String(opening));
});
$("#nodeShape").addEventListener("change", (event) => updateNode("shape", event.target.value, true));
$("#nodePriority").addEventListener("change", (event) => updateNode("priority", event.target.value, true));
$("#nodeWidth").addEventListener("change", (event) => updateNode("width", Math.min(420, Math.max(112, Number(event.target.value) || 112)), true));
$("#nodeHeight").addEventListener("change", (event) => updateNode("height", Math.min(240, Math.max(44, Number(event.target.value) || 44)), true));
$("#resetNodeSize").addEventListener("click", () => resetNodeSize());
$("#createNodeCanvas").addEventListener("click", createNodeCanvas);
$("#openNodeCanvas").addEventListener("click", () => { const node = selectedNode(); if (node?.childCanvasId) openCanvas(node.childCanvasId); });
$("#deleteNodeCanvas").addEventListener("click", deleteSelectedNodeCanvas);
$("#connectionColor").addEventListener("focus", snapshot);
$("#connectionColor").addEventListener("input", (event) => updateConnection("color", event.target.value));
$("#connectionTitle").addEventListener("focus", snapshot);
$("#connectionTitle").addEventListener("input", (event) => updateConnection("title", event.target.value));
$("#connectionNote").addEventListener("focus", snapshot);
$("#connectionNote").addEventListener("input", (event) => updateConnection("note", event.target.value));
$("#connectionStyle").addEventListener("change", (event) => updateConnection("style", event.target.value, true));
$("#connectionArrow").addEventListener("change", (event) => updateConnection("arrow", event.target.value, true));
$("#resetConnectionStyle").addEventListener("click", resetConnectionStyle);
$("#deleteConnection").addEventListener("click", deleteConnection);
$("#fileInput").addEventListener("change", (event) => { if (event.target.files[0]) importDocument(event.target.files[0]); event.target.value = ""; });
document.querySelectorAll(".rail-item").forEach((button) => button.addEventListener("click", () => {
  if (button.dataset.panel !== "contracts" && contractEditor) {
    if (!confirmDiscardContractChanges()) return;
    contractEditor = null;
  }
  activateSidebarPanel(button.dataset.panel);
  toggleSidebar(false);
  renderPanel();
}));
$("#canvas").addEventListener("pointerdown", startPan);
$("#canvas").addEventListener("dblclick", addFreeNodeAtCanvasPoint);
$("#canvas").addEventListener("auxclick", (event) => { if (event.button === 1) event.preventDefault(); });
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("pointerup", onPointerUp);
window.addEventListener("copy", copySelectedNodes);
window.addEventListener("paste", pasteCopiedNodes);
$("#canvas").addEventListener("wheel", (event) => { if (event.target.closest(".canvas-tabs, .node-tooltip-portal")) return; event.preventDefault(); const rect = $("#canvas").getBoundingClientRect(); setZoom(doc.viewport.zoom * (event.deltaY > 0 ? .92 : 1.08), { x: (event.clientX - rect.left) / UI_SCALE, y: (event.clientY - rect.top) / UI_SCALE }); }, { passive: false });
window.addEventListener("keydown", (event) => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if (event.code === "Space" && !typing) { spacePressed = true; event.preventDefault(); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") { event.preventDefault(); toggleSidebar(); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "n") { event.preventDefault(); newProject(); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "o") { event.preventDefault(); openProject(); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); event.shiftKey ? saveProjectAs() : saveProject(); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d" && selectedId && !typing) { event.preventDefault(); duplicateSelected(); }
  if (event.key === "Tab" && selectedId && !typing) { event.preventDefault(); addChild(); }
  if ((event.key === "Delete" || event.key === "Backspace") && selectedConnectionId && !typing) { event.preventDefault(); deleteConnection(); }
  if ((event.key === "Delete" || event.key === "Backspace") && selectedIds.size && !typing) { event.preventDefault(); deleteSelected(); }
  if (event.key === "Escape" && (selectedIds.size || selectedConnectionId)) closeInspector();
});
window.addEventListener("keyup", (event) => { if (event.code === "Space") spacePressed = false; });
window.addEventListener("resize", () => { if (window.innerWidth / UI_SCALE < 700) toggleSidebar(true); });

if (window.innerWidth / UI_SCALE < 700) toggleSidebar(true);
restoreActiveSidebarPanel();
rememberProject();
setSaveState("已自动保存");
render();
requestAnimationFrame(() => fitView(false));
