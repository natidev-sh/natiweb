import { useState } from 'react'
import { Crown, Shield, Edit3, Eye, Check, Info } from 'lucide-react'

const ROLES = [
  {
    value: 'owner',
    label: 'Owner',
    icon: Crown,
    color: 'yellow',
    description: 'Full access to everything',
    permissions: [
      'Manage team settings',
      'Invite & remove members',
      'Change member roles',
      'Share & unshare apps',
      'Delete team',
      'Manage billing'
    ]
  },
  {
    value: 'admin',
    label: 'Admin',
    icon: Shield,
    color: 'blue',
    description: 'Manage members and resources',
    permissions: [
      'Invite & remove members',
      'Change member roles',
      'Share & unshare apps',
      'View team settings'
    ]
  },
  {
    value: 'editor',
    label: 'Editor',
    icon: Edit3,
    color: 'green',
    description: 'Create and edit team content',
    permissions: [
      'Share apps with team',
      'View team members',
      'Comment on apps',
      'Fork shared apps'
    ]
  },
  {
    value: 'viewer',
    label: 'Viewer',
    icon: Eye,
    color: 'gray',
    description: 'View team content only',
    permissions: [
      'View shared apps',
      'View team members',
      'Fork shared apps'
    ]
  }
]

export default function RoleEditor({ currentRole, onRoleChange, isOwner, disabled = false }) {
  const [showInfo, setShowInfo] = useState(false)
  const [selectedRole, setSelectedRole] = useState(currentRole)

  const handleRoleSelect = (roleValue) => {
    setSelectedRole(roleValue)
    onRoleChange(roleValue)
  }

  const getCurrentRoleData = () => ROLES.find(r => r.value === currentRole)
  const getSelectedRoleData = () => ROLES.find(r => r.value === selectedRole)

  if (disabled) {
    const roleData = getCurrentRoleData()
    const Icon = roleData?.icon || Eye
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <Icon className={`h-4 w-4 text-${roleData?.color}-500`} />
        <span className="text-sm font-medium capitalize">{currentRole}</span>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Role Selector Button */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-all shadow-sm hover:shadow-md group"
      >
        {(() => {
          const roleData = getCurrentRoleData()
          const Icon = roleData?.icon || Eye
          return (
            <>
              <Icon className={`h-4 w-4 text-${roleData?.color}-500 group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-semibold capitalize">{currentRole}</span>
              <Info className="h-3.5 w-3.5 text-gray-400 ml-1" />
            </>
          )
        })()}
      </button>

      {/* Role Info Panel */}
      {showInfo && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowInfo(false)}
          />
          <div className="absolute top-full mt-2 right-0 z-50 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-1">Change Member Role</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Select a role to define permissions
              </p>
            </div>

            {/* Role Options */}
            <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
              {ROLES.map((role) => {
                // Only owner can assign owner role
                if (role.value === 'owner' && !isOwner) return null

                const Icon = role.icon
                const isSelected = selectedRole === role.value
                const isCurrent = currentRole === role.value

                return (
                  <button
                    key={role.value}
                    onClick={() => handleRoleSelect(role.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${
                      isSelected
                        ? `border-${role.color}-500 bg-${role.color}-50 dark:bg-${role.color}-900/20 shadow-lg`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br from-${role.color}-400 to-${role.color}-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base">{role.label}</h4>
                            {isCurrent && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            {role.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className={`h-6 w-6 rounded-full bg-${role.color}-500 flex items-center justify-center animate-in zoom-in duration-200`}>
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Permissions */}
                    <div className="space-y-1.5 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Permissions:
                      </p>
                      {role.permissions.map((permission, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <div className={`h-1.5 w-1.5 rounded-full bg-${role.color}-500`} />
                          <span>{permission}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            {selectedRole !== currentRole && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedRole(currentRole)
                    setShowInfo(false)
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowInfo(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-blue-600 text-white hover:shadow-lg transition-all font-semibold text-sm"
                >
                  Confirm Change
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Export role utilities
export const getRoleConfig = (roleValue) => ROLES.find(r => r.value === roleValue)
export const ROLE_LIST = ROLES
