import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd'

export default function SaaSDashboard() {
  const [activeSection, setActiveSection] =
    useState('Dashboard')

  const [darkMode, setDarkMode] =
    useState(true)

  const [searchQuery, setSearchQuery] =
    useState('')

  const [showNotifications, setShowNotifications] =
    useState(false)

  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  const [users, setUsers] = useState([])

  const [loading, setLoading] =
    useState(false)

  const [currentPage, setCurrentPage] =
    useState(1)

  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Design Landing Page',
    },
    {
      id: '2',
      title: 'Fix Dashboard Bugs',
    },
    {
      id: '3',
      title: 'Implement Stripe Billing',
    },
  ])

  const usersPerPage = 4

  const sections = [
    'Dashboard',
    'Analytics',
    'Projects',
    'Customers',
    'Billing',
    'Settings',
  ]

  const stats = [
    {
      title: 'Total Revenue',
      value: '$48,290',
      growth: '+12.5%',
    },
    {
      title: 'Active Users',
      value: '12,840',
      growth: '+8.1%',
    },
    {
      title: 'Subscriptions',
      value: '3,240',
      growth: '+18.3%',
    },
    {
      title: 'Server Uptime',
      value: '99.98%',
      growth: '+0.4%',
    },
  ]

  const projects = [
    {
      name: 'Enterprise CRM',
      team: 'Development',
      status: 'In Progress',
      progress: 78,
    },
    {
      name: 'AI Analytics',
      team: 'Data Team',
      status: 'Completed',
      progress: 100,
    },
    {
      name: 'Customer Portal',
      team: 'Frontend',
      status: 'Review',
      progress: 64,
    },
    {
      name: 'Marketing Automation',
      team: 'Marketing',
      status: 'Planning',
      progress: 24,
    },
  ]

  const activities = [
    'New subscription purchased',
    'Database backup completed',
    'Support ticket resolved',
    'New team member invited',
  ]

  const chartData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 7200 },
    { month: 'May', revenue: 8600 },
    { month: 'Jun', revenue: 9800 },
  ]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)

        const res = await axios.get(
          'https://jsonplaceholder.typicode.com/users'
        )

        setUsers(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const searchableData = [
    ...sections.map((item) => ({
      type: 'Section',
      name: item,
    })),

    ...projects.map((item) => ({
      type: 'Project',
      name: item.name,
    })),
  ]

  const filteredResults =
    searchableData.filter((item) =>
      item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(tasks)

    const [reorderedItem] = items.splice(
      result.source.index,
      1
    )

    items.splice(
      result.destination.index,
      0,
      reorderedItem
    )

    setTasks(items)
  }

  const indexOfLastUser =
    currentPage * usersPerPage

  const indexOfFirstUser =
    indexOfLastUser - usersPerPage

  const currentUsers = users.slice(
    indexOfFirstUser,
    indexOfLastUser
  )

  const totalPages = Math.ceil(
    users.length / usersPerPage
  )

  return (
    <div
      className={`min-h-screen flex transition-all duration-500 ${
        darkMode
          ? 'bg-slate-950 text-white'
          : 'bg-gray-100 text-black'
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 h-full transition-all duration-300 ${
          sidebarOpen ? 'left-0' : '-left-full'
        } lg:left-0 w-72 ${
          darkMode
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-gray-200'
        } border-r flex flex-col justify-between`}
      >
        <div>
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-3xl font-bold">
              SaaS
              <span className="text-cyan-400">
                Flow
              </span>
            </h1>

            <p className="text-slate-400 mt-2">
              Enterprise Dashboard
            </p>
          </div>

          <nav className="p-5 space-y-3">
            {sections.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveSection(item)
                  setSidebarOpen(false)
                }}
                className={`w-full px-4 py-3 rounded-2xl flex justify-between items-center transition-all duration-300 ${
                  activeSection === item
                    ? 'bg-cyan-500 text-black'
                    : darkMode
                    ? 'bg-slate-800 hover:bg-cyan-500 hover:text-black'
                    : 'bg-gray-200 hover:bg-cyan-500 hover:text-black'
                }`}
              >
                <span>{item}</span>

                <span>→</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-5">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-2xl font-bold">
              Upgrade Pro
            </h3>

            <p className="mt-3 text-sm">
              Unlock premium analytics,
              AI insights, and Stripe billing.
            </p>

            <button className="bg-black text-white w-full py-3 rounded-2xl mt-5 hover:scale-105 transition">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header
          className={`sticky top-0 z-40 backdrop-blur border-b p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${
            darkMode
              ? 'bg-slate-950/90 border-slate-800'
              : 'bg-white/90 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              className="lg:hidden bg-cyan-500 text-black px-4 py-2 rounded-xl"
            >
              ☰
            </button>

            <div>
              <h2 className="text-3xl font-bold">
                {activeSection}
              </h2>

              <p className="text-slate-400 mt-1">
                Advanced SaaS management
                platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap relative">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search anything..."
                className={`px-4 py-3 rounded-2xl outline-none w-72 border ${
                  darkMode
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-white border-gray-300'
                }`}
              />

              {searchQuery && (
                <div className="absolute top-16 left-0 w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-50">
                  {filteredResults.map(
                    (item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery('')
                          setActiveSection(
                            item.name
                          )
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-cyan-500 hover:text-black transition border-b border-slate-800"
                      >
                        <p className="font-semibold">
                          {item.name}
                        </p>

                        <p className="text-sm text-slate-400">
                          {item.type}
                        </p>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Dark Mode */}
            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className="bg-cyan-500 text-black px-4 py-3 rounded-2xl font-bold hover:scale-105 transition"
            >
              {darkMode
                ? '☀ Light'
                : '🌙 Dark'}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                className="bg-slate-900 p-3 rounded-2xl relative"
              >
                🔔

                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-16 w-80 bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">
                    Notifications
                  </h3>

                  <div className="space-y-4">
                    {activities.map(
                      (activity, index) => (
                        <div
                          key={index}
                          className="bg-slate-800 p-4 rounded-2xl"
                        >
                          {activity}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-700">
              <img
                src="https://i.pravatar.cc/100"
                alt="User"
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h4 className="font-semibold">
                  Mohammed Zakaria
                </h4>

                <p className="text-sm text-slate-400">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              whileHover={{
                scale: 1.05,
              }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-slate-400">
                    {stat.title}
                  </p>

                  <h3 className="text-3xl font-bold mt-3">
                    {stat.value}
                  </h3>
                </div>

                <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full h-fit">
                  {stat.growth}
                </span>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-6">
          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold">
                  Revenue Analytics
                </h3>

                <p className="text-slate-400 mt-1">
                  Recharts line animation
                </p>
              </div>

              <button className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-semibold">
                Export
              </button>
            </div>

            <div className="h-96">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#06b6d4"
                    strokeWidth={4}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">
              Recent Activity
            </h3>

            <div className="space-y-5">
              {activities.map(
                (activity, index) => (
                  <motion.div
                    key={index}
                    whileHover={{
                      x: 8,
                    }}
                    className="flex items-start gap-4 border-b border-slate-800 pb-4"
                  >
                    <div className="w-3 h-3 rounded-full bg-cyan-400 mt-2" />

                    <div>
                      <p>{activity}</p>

                      <p className="text-sm text-slate-400 mt-1">
                        {index + 1} hour ago
                      </p>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* AI Analytics */}
        <section className="p-6">
          <div className="bg-gradient-to-br from-purple-600 to-cyan-500 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center flex-wrap gap-6">
              <div>
                <p className="uppercase tracking-widest text-sm">
                  AI Analytics
                </p>

                <h2 className="text-4xl font-bold mt-4">
                  AI Revenue Prediction
                </h2>

                <p className="mt-4 max-w-2xl">
                  AI predicts 34% growth next
                  month using behavioral
                  analytics and retention data.
                </p>
              </div>

              <div className="text-7xl">
                🤖
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                [
                  'Prediction Accuracy',
                  '94%',
                ],
                ['Growth Forecast', '+34%'],
                ['Churn Risk', 'Low'],
              ].map((item) => (
                <div
                  key={item[0]}
                  className="bg-white/10 backdrop-blur rounded-2xl p-6"
                >
                  <p>{item[0]}</p>

                  <h3 className="text-3xl font-bold mt-3">
                    {item[1]}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Multi Users */}
        <section className="p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <div className="flex justify-between mb-8">
              <h2 className="text-3xl font-bold">
                Multi User System
              </h2>

              <span className="text-cyan-400">
                {users.length} Users
              </span>
            </div>

            {loading ? (
              <p>Loading users...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{
                      scale: 1.03,
                    }}
                    className="bg-slate-800 rounded-2xl p-6"
                  >
                    <h3 className="text-2xl font-bold">
                      {user.name}
                    </h3>

                    <p className="text-slate-400 mt-2">
                      {user.email}
                    </p>

                    <p className="mt-2">
                      {user.company.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex gap-3 mt-8">
              {Array.from({
                length: totalPages,
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(
                      index + 1
                    )
                  }
                  className={`px-4 py-2 rounded-xl ${
                    currentPage ===
                    index + 1
                      ? 'bg-cyan-500 text-black'
                      : 'bg-slate-800'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Kanban */}
        <section className="p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <div className="flex justify-between mb-8">
              <h2 className="text-3xl font-bold">
                Drag & Drop Kanban
              </h2>

              <button className="bg-cyan-500 text-black px-5 py-2 rounded-xl font-bold">
                + Add Task
              </button>
            </div>

            <DragDropContext
              onDragEnd={handleDragEnd}
            >
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {tasks.map(
                      (task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={
                            task.id
                          }
                          index={index}
                        >
                          {(provided) => (
                            <motion.div
                              whileHover={{
                                scale: 1.02,
                              }}
                              ref={
                                provided.innerRef
                              }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-slate-800 rounded-2xl p-6 cursor-grab"
                            >
                              <h3 className="text-xl font-bold">
                                {task.title}
                              </h3>
                            </motion.div>
                          )}
                        </Draggable>
                      )
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </section>

        {/* Stripe */}
        <section className="p-6">
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center flex-wrap gap-6">
              <div>
                <p className="uppercase tracking-widest text-sm">
                  Stripe Billing
                </p>

                <h2 className="text-4xl font-bold mt-4">
                  Subscription Revenue
                </h2>

                <p className="mt-4 max-w-xl">
                  Manage SaaS subscriptions,
                  recurring invoices, and
                  enterprise payments.
                </p>
              </div>

              <div className="text-7xl">
                💳
              </div>
            </div>

            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="bg-black text-white px-6 py-3 rounded-2xl font-bold">
                Connect Stripe
              </button>

              <button className="bg-white text-black px-6 py-3 rounded-2xl font-bold">
                View Invoices
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}