import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded Komponenten für bessere Performance
const Dashboard = () => import('@/views/Dashboard.vue')
const CreateMaterial = () => import('@/views/CreateMaterial.vue')
const EditMaterial = () => import('@/views/EditMaterial.vue')
const MaterialsList = () => import('@/views/MaterialsList.vue')
const MaterialDetails = () => import('@/views/MaterialDetails.vue')
const TemplateLibrary = () => import('@/views/TemplateLibrary.vue')
const Settings = () => import('@/views/Settings.vue')
const NotFound = () => import('@/views/NotFound.vue')
const MaterialsGrid = () => import('@/views/MaterialsGrid.vue') // Import hinzugefügt

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/create',
    name: 'create',
    component: CreateMaterial,
    props: route => ({ templateId: route.query.template, type: route.query.type }),
    meta: { title: 'Neues Material erstellen' }
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: EditMaterial,
    props: true,
    meta: { title: 'Material bearbeiten' }
  },
  {
    path: '/materials',
    component: MaterialsList,
    meta: { title: 'Meine Materialien' },
    children: [
      {
        path: '',
        name: 'materials',
        component: MaterialsGrid // Korrigierter Komponentenname
      },
      {
        path: ':id',
        name: 'material-details',
        component: MaterialDetails,
        props: true
      }
    ]
  },
  {
    path: '/templates',
    name: 'templates',
    component: TemplateLibrary,
    meta: { title: 'Vorlagenbibliothek' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { title: 'Einstellungen' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: '404 - Seite nicht gefunden' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Dynamischen Titel setzen
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | CLIL-KI-Tool` : 'CLIL-KI-Tool'
  next()
})

export default router 