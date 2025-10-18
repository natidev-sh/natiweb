import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '../auth/AuthContext.jsx'
import PageMeta from '../components/PageMeta.jsx'
import { Monitor, Play, Square, RefreshCw, Terminal, Settings, Wifi, WifiOff, Clock, Zap, Cpu, HardDrive, Activity, Code, Database, Globe, Folder, FileText, Download, Upload, Trash2 } from 'lucide-react'

export default function RemoteControl() {
  const { user } = useAuth()
  const [desktopDevices, setDesktopDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [buildLogs, setBuildLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingCommand, setSendingCommand] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    uptime: 0
  })
  const [terminalOutput, setTerminalOutput] = useState([])
  const [terminalInput, setTerminalInput] = useState('')

  useEffect(() => {
    if (user) {
      fetchDesktopDevices()
      fetchBuildLogs()
      
      // Poll for updates every 3 seconds for real-time sync
      const interval = setInterval(() => {
        fetchDesktopDevices()
        if (selectedDevice) {
          fetchBuildLogs()
        }
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [selectedDevice, user])

  async function fetchDesktopDevices() {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from('desktop_app_state')
        .select('*')
        .eq('user_id', user.id)
        .order('last_heartbeat', { ascending: false })

      if (error) throw error

      // Parse JSONB fields
      const processedData = (data || []).map(device => ({
        ...device,
        running_apps: typeof device.running_apps === 'string' 
          ? JSON.parse(device.running_apps) 
          : device.running_apps || [],
        system_info: typeof device.system_info === 'string'
          ? JSON.parse(device.system_info)
          : device.system_info || {}
      }))

      setDesktopDevices(processedData)
      
      // Update system stats from selected device
      const currentDevice = processedData.find(d => d.id === selectedDevice?.id)
      if (currentDevice?.system_info) {
        setSystemStats({
          cpu: currentDevice.system_info.cpu || 0,
          memory: currentDevice.system_info.memory || 0,
          disk: currentDevice.system_info.disk || 0,
          uptime: currentDevice.system_info.uptime || 0
        })
      }
      
      // Auto-select first online device
      if (!selectedDevice && processedData.length > 0) {
        const onlineDevice = processedData.find(d => d.is_online)
        if (onlineDevice) {
          setSelectedDevice(onlineDevice)
        }
      }
    } catch (error) {
      console.error('Error fetching desktop devices:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchBuildLogs() {
    if (!selectedDevice) return

    try {
      const { data, error } = await supabase
        .from('build_logs')
        .select('*')
        .eq('app_state_id', selectedDevice.id)
        .order('started_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setBuildLogs(data || [])
    } catch (error) {
      console.error('Error fetching build logs:', error)
    }
  }

  async function sendCommand(commandType, appName, commandData = {}) {
    if (!selectedDevice) return

    setSendingCommand(commandType + '-' + appName)
    try {
      const { data, error} = await supabase
        .from('remote_commands')
        .insert({
          user_id: user.id,
          target_session_id: selectedDevice.session_id,
          command_type: commandType,
          command_data: { app_name: appName, ...commandData }
        })
        .select()
        .single()

      if (error) throw error

      // Wait a bit and refresh
      setTimeout(() => {
        fetchDesktopDevices()
        setSendingCommand(null)
      }, 2000)
    } catch (error) {
      console.error('Error sending command:', error)
      setSendingCommand(null)
    }
  }

  async function executeTerminalCommand(command) {
    if (!selectedDevice || !command.trim()) return

    const newOutput = { type: 'input', text: `$ ${command}`, timestamp: new Date() }
    setTerminalOutput(prev => [...prev, newOutput])
    setTerminalInput('')

    try {
      await sendCommand('execute_terminal', 'terminal', { command })
      
      // Simulate output (in real app, this would come from desktop app)
      setTimeout(() => {
        setTerminalOutput(prev => [...prev, {
          type: 'output',
          text: `Executing command on ${selectedDevice.device_name}...`,
          timestamp: new Date()
        }])
      }, 500)
    } catch (error) {
      setTerminalOutput(prev => [...prev, {
        type: 'error',
        text: `Error: ${error.message}`,
        timestamp: new Date()
      }])
    }
  }

  async function createTestDevice() {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('desktop_app_state')
        .insert({
          user_id: user.id,
          device_name: `Test Desktop - ${new Date().toLocaleString()}`,
          is_online: true,
          last_heartbeat: new Date().toISOString(),
          running_apps: [
            {
              name: 'Chat App',
              status: 'running',
              port: 3000,
              url: 'http://localhost:3000',
              pid: 12345
            },
            {
              name: 'API Server',
              status: 'running',
              port: 8080,
              url: 'http://localhost:8080',
              pid: 12346
            },
            {
              name: 'Database',
              status: 'running',
              port: 5432,
              pid: 12347
            }
          ],
          system_info: {
            cpu: 35,
            memory: 62,
            disk: 78,
            uptime: 86400,
            platform: 'Windows 11',
            nodeVersion: 'v20.11.0',
            appVersion: '1.0.0'
          }
        })
        .select()
        .single()

      if (error) throw error
      
      await fetchDesktopDevices()
      alert('Test device created successfully!')
    } catch (error) {
      console.error('Error creating test device:', error)
      alert('Error: ' + error.message)
    }
  }

  const onlineDevices = desktopDevices.filter(d => d.is_online)
  const offlineDevices = desktopDevices.filter(d => !d.is_online)

  return (
    <>
      <PageMeta
        title="Remote Control | Nati.dev"
        description="Control your desktop apps remotely from the web"
      />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Remote Control</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage your desktop apps from anywhere
          </p>
        </div>

        {/* Device Selection */}
        <div className="grid gap-4 md:grid-cols-3">
          {onlineDevices.map(device => (
            <button
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className={`p-4 rounded-lg border transition-all text-left ${
                selectedDevice?.id === device.id
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                  : 'border-[var(--border)] hover:bg-[var(--muted)]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                  <Monitor className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{device.device_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 mt-1">
                    <Wifi className="h-3 w-3" />
                    <span>Online</span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {device.running_apps?.length || 0} apps running
                  </p>
                </div>
              </div>
            </button>
          ))}

          {offlineDevices.map(device => (
            <div
              key={device.id}
              className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] opacity-50"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-[var(--muted-foreground)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{device.device_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mt-1">
                    <WifiOff className="h-3 w-3" />
                    <span>Offline</span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Last seen {new Date(device.last_heartbeat).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {desktopDevices.length === 0 && !loading && (
            <div className="col-span-3 p-8 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] text-center space-y-4">
              <Monitor className="h-12 w-12 mx-auto mb-3 text-[var(--muted-foreground)]" />
              <h3 className="font-semibold mb-1">No Devices Connected</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Open the Nati Desktop app to connect, or create a test device to see how it works
              </p>
              <button
                onClick={createTestDevice}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-sm"
              >
                Create Test Device
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        {selectedDevice && (
          <div className="flex gap-2 border-b border-[var(--border)]">
            {[
              { id: 'overview', label: 'Overview', icon: Monitor },
              { id: 'apps', label: 'Apps', icon: Zap },
              { id: 'terminal', label: 'Terminal', icon: Terminal },
              { id: 'system', label: 'System', icon: Activity },
              { id: 'logs', label: 'Logs', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Overview Tab */}
        {selectedDevice && activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
              <div className="flex items-center justify-between mb-4">
                <Cpu className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold">{systemStats.cpu}%</span>
              </div>
              <h3 className="text-sm font-medium mb-2">CPU Usage</h3>
              <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${systemStats.cpu}%` }}
                />
              </div>
            </div>

            <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
              <div className="flex items-center justify-between mb-4">
                <Activity className="h-8 w-8 text-green-500" />
                <span className="text-2xl font-bold">{systemStats.memory}%</span>
              </div>
              <h3 className="text-sm font-medium mb-2">Memory</h3>
              <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${systemStats.memory}%` }}
                />
              </div>
            </div>

            <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
              <div className="flex items-center justify-between mb-4">
                <HardDrive className="h-8 w-8 text-purple-500" />
                <span className="text-2xl font-bold">{systemStats.disk}%</span>
              </div>
              <h3 className="text-sm font-medium mb-2">Disk Usage</h3>
              <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
                  style={{ width: `${systemStats.disk}%` }}
                />
              </div>
            </div>

            <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-amber-500" />
                <span className="text-2xl font-bold">{Math.floor(systemStats.uptime / 3600)}h</span>
              </div>
              <h3 className="text-sm font-medium mb-2">Uptime</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {new Date(Date.now() - systemStats.uptime * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Apps Tab */}
        {selectedDevice && activeTab === 'apps' && (
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Running Apps on {selectedDevice.device_name}</h2>
              <button
                onClick={fetchDesktopDevices}
                className="p-2 rounded-md hover:bg-[var(--muted)] transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {selectedDevice.running_apps && selectedDevice.running_apps.length > 0 ? (
              <div className="space-y-3">
                {selectedDevice.running_apps.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{app.name}</h3>
                        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] mt-1">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {app.status || 'Running'}
                          </span>
                          {app.port && <span>Port: {app.port}</span>}
                          {app.url && (
                            <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                              Open →
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => sendCommand('build', app.name)}
                          disabled={sendingCommand === 'build-' + app.name}
                          className="p-2 rounded-md hover:bg-green-500/20 text-green-600 dark:text-green-400 transition-colors disabled:opacity-50"
                          title="Build"
                        >
                          {sendingCommand === 'build-' + app.name ? (
                            <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => sendCommand('stop_app', app.name)}
                          disabled={sendingCommand === 'stop_app-' + app.name}
                          className="p-2 rounded-md hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                          title="Stop"
                        >
                          {sendingCommand === 'stop_app-' + app.name ? (
                            <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No apps running</p>
              </div>
            )}
          </div>
        )}

        {/* Terminal Tab */}
        {selectedDevice && activeTab === 'terminal' && (
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Remote Terminal - {selectedDevice.device_name}
            </h2>
            
            {/* Terminal Output */}
            <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm mb-4">
              {terminalOutput.length === 0 ? (
                <div className="text-green-400">
                  <p>Nati Remote Terminal v1.0</p>
                  <p>Type commands to execute on {selectedDevice.device_name}</p>
                  <p className="mt-2 text-gray-400">$</p>
                </div>
              ) : (
                terminalOutput.map((line, idx) => (
                  <div key={idx} className={
                    line.type === 'input' ? 'text-white' :
                    line.type === 'error' ? 'text-red-400' :
                    'text-green-400'
                  }>
                    {line.text}
                  </div>
                ))
              )}
            </div>

            {/* Terminal Input */}
            <form onSubmit={(e) => {
              e.preventDefault()
              executeTerminalCommand(terminalInput)
            }} className="flex gap-2">
              <span className="text-green-400 font-mono">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Enter command..."
                className="flex-1 bg-black text-white font-mono px-3 py-2 rounded outline-none border border-[var(--border)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Execute
              </button>
            </form>

            {/* Quick Commands */}
            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                onClick={() => setTerminalInput('ls -la')}
                className="px-3 py-1 text-xs bg-[var(--muted)] rounded hover:bg-[var(--muted)]/80"
              >
                ls -la
              </button>
              <button
                onClick={() => setTerminalInput('npm install')}
                className="px-3 py-1 text-xs bg-[var(--muted)] rounded hover:bg-[var(--muted)]/80"
              >
                npm install
              </button>
              <button
                onClick={() => setTerminalInput('git status')}
                className="px-3 py-1 text-xs bg-[var(--muted)] rounded hover:bg-[var(--muted)]/80"
              >
                git status
              </button>
              <button
                onClick={() => setTerminalOutput([])}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* System Tab */}
        {selectedDevice && activeTab === 'system' && (
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
              <h2 className="text-lg font-semibold mb-4">System Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Device Name</p>
                  <p className="font-medium">{selectedDevice.device_name}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Platform</p>
                  <p className="font-medium">{selectedDevice.system_info?.platform || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Node Version</p>
                  <p className="font-medium">{selectedDevice.system_info?.nodeVersion || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">App Version</p>
                  <p className="font-medium">{selectedDevice.system_info?.appVersion || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Last Heartbeat</p>
                  <p className="font-medium">{new Date(selectedDevice.last_heartbeat).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Status</p>
                  <p className={`font-medium ${selectedDevice.is_online ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedDevice.is_online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Desktop App Integration Guide
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[var(--muted)] space-y-2">
                  <p className="text-sm font-medium">Your desktop app should send updates to this endpoint:</p>
                  <code className="block text-xs bg-black/50 p-2 rounded">
                    POST /rest/v1/desktop_app_state
                  </code>
                  <p className="text-xs text-[var(--muted-foreground)] mt-2">Example payload:</p>
                  <pre className="text-xs bg-black/50 p-3 rounded overflow-x-auto">
{`{
  "user_id": "YOUR_USER_ID",
  "device_name": "MacBook Pro",
  "is_online": true,
  "running_apps": [
    {
      "name": "Chat App",
      "status": "running",
      "port": 3000,
      "url": "http://localhost:3000",
      "pid": 12345
    }
  ],
  "system_info": {
    "cpu": 45,
    "memory": 62,
    "disk": 78,
    "uptime": 86400,
    "platform": "darwin",
    "nodeVersion": "v20.11.0"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {selectedDevice && activeTab === 'logs' && buildLogs.length > 0 && (
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Build Logs
            </h2>
            <div className="space-y-2">
              {buildLogs.map(log => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border ${
                    log.build_status === 'success'
                      ? 'border-green-500/20 bg-green-500/5'
                      : log.build_status === 'failed'
                      ? 'border-red-500/20 bg-red-500/5'
                      : 'border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{log.project_name}</h4>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {new Date(log.started_at).toLocaleString()}
                        {log.duration_ms && ` • ${(log.duration_ms / 1000).toFixed(1)}s`}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      log.build_status === 'success'
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : log.build_status === 'failed'
                        ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                        : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                    }`}>
                      {log.build_status}
                    </span>
                  </div>
                  {log.log_content && (
                    <pre className="mt-2 p-2 rounded bg-black/20 text-xs overflow-x-auto max-h-32 overflow-y-auto">
                      {log.log_content}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
