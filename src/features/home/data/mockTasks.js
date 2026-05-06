export const MOCK_TASKS = [
  {
    id: 1,
    title: "Limpiar la cocina",
    description: "Lavar platos, limpiar encimeras y barrer el piso",
    date: "9/4/2026",
    assignee: { name: "Usuario Actual", avatarId: "22" },
    status: "Pendiente",
    priority: "Alta",
    comments: 0
  },
  {
    id: 2,
    title: "Hacer la compra semanal",
    description: "Supermercado: frutas, verduras, lácteos",
    date: "7/4/2026",
    assignee: { name: "María García", avatarId: "MG" },
    status: "En progreso",
    priority: "Media",
    comments: 1
  },
  {
    id: 3,
    title: "Regar las plantas",
    description: "Todas las plantas del jardín y balcón",
    date: "8/4/2026",
    assignee: { name: "Juan Pérez", avatarId: "JP" },
    status: "Completada",
    priority: "Baja",
    comments: 0
  }
];

export const MOCK_STATS = {
  total: 12,
  completed: 8,
  members: 3
};
