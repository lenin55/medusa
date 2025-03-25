import { 
  Container, 
  Heading, 
  Skeleton,
  Text,
  Badge,
  Button,
  DropdownMenu,
  createDataTableColumnHelper,
  useDataTable,
  DataTable
} from "@medusajs/ui"
import { PencilSquare, Trash, Camera, Check, ExclamationCircle, EllipsisVertical } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CreateForm } from "../components/create-form"
import { Header } from "../components/Header"
import useCustomToast from "../components/useCustomToast"
import ToastDisplay from "../components/ToastDisplay"

interface Banner {
  id: string
  name: string
  image_url: string
  description?: string
  is_active: boolean
  link_url?: string
  valid_from?: Date
  valid_until?: Date
  created_at: string
  updated_at: string
}

const columnHelper = createDataTableColumnHelper<Banner>()

const BannerWidget = () => {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editModalKey, setEditModalKey] = useState("banner-edit-0")
  const { toasts, success, error: showError, dismissToast } = useCustomToast()

  const fetchBanners = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/admin/banners')
      if (!response.ok) throw new Error(`Error fetching banners: ${response.statusText}`)
      const data = await response.json()
      setBanners(data.banners || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load banners. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('bannersUpdated', handleBannersUpdated)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannersUpdated', handleBannersUpdated)
    }
  }, [])

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'medusa_banners') fetchBanners()
  }

  const handleBannersUpdated = () => fetchBanners()

  const handleSaveBanner = async (formData: Omit<Banner, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch('/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Create failed')
      fetchBanners()
      success('Banner created successfully')
    } catch (err) {
      console.error(err)
      showError('Failed to create banner')
    }
  }

  const handleUpdateBanner = async (formData: Partial<Banner>) => {
    if (!selectedBanner) return
    try {
      const response = await fetch(`/admin/banners/${selectedBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Update failed')
      fetchBanners()
      setSelectedBanner(null)
      success('Banner updated successfully')
    } catch (err) {
      console.error(err)
      showError('Failed to update banner')
    }
  }

  const handleDeleteBanner = async (banner: Banner) => {
    if (!window.confirm(`Delete banner "${banner.name}"?`)) return
    try {
      const response = await fetch(`/admin/banners/${banner.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      fetchBanners()
      success('Banner deleted successfully')
    } catch (err) {
      console.error(err)
      showError('Failed to delete banner')
    }
  }

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner)
    setEditModalKey(`banner-edit-${Date.now()}`)
    setTimeout(() => setIsEditModalOpen(true), 0)
  }

  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !banner.is_active }),
      })
      if (!response.ok) throw new Error('Toggle failed')
      fetchBanners()
      success(`Banner ${banner.is_active ? "deactivated" : "activated"}`)
    } catch (err) {
      console.error(err)
      showError('Failed to toggle banner status')
    }
  }

  const columns = [
    columnHelper.display({
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const banner = row.original
        return (
          <div className="w-14 h-14 border rounded flex items-center justify-center overflow-hidden">
            {banner.image_url ? (
              <img src={banner.image_url} alt={banner.name} className="object-contain max-h-full max-w-full" />
            ) : (
              <Camera className="text-ui-fg-subtle" />
            )}
          </div>
        )
      },
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Text className="font-medium">{row.original.name}</Text>
          {row.original.description && (
            <Text className="text-ui-fg-subtle text-xs line-clamp-2">
              {row.original.description}
            </Text>
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const banner = row.original
        const now = new Date()
        const validFrom = banner.valid_from ? new Date(banner.valid_from) : null
        const validUntil = banner.valid_until ? new Date(banner.valid_until) : null
        let status = { label: "Inactive", color: "red" as any }
        if (banner.is_active) {
          if (validFrom && validFrom > now) status = { label: "Scheduled", color: "blue" }
          else if (validUntil && validUntil < now) status = { label: "Expired", color: "gray" }
          else status = { label: "Active", color: "green" }
        }
        return <Badge color={status.color}>{status.label}</Badge>
      },
    }),
    columnHelper.display({
      id: "validity",
      header: "Valid Period",
      cell: ({ row }) => {
        const banner = row.original
        return (
          <div className="flex flex-col text-sm">
            {banner.valid_from && <Text>From: {format(new Date(banner.valid_from), "MMM d, yyyy")}</Text>}
            {banner.valid_until && <Text>To: {format(new Date(banner.valid_until), "MMM d, yyyy")}</Text>}
            {!banner.valid_from && !banner.valid_until && (
              <Text className="text-ui-fg-subtle">No time limit</Text>
            )}
          </div>
        )
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const banner = row.original
        return (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" size="small" className="ml-2">
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onClick={() => handleEdit(banner)}>
                <PencilSquare className="w-4 h-4 mr-2" /> Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => handleToggleActive(banner)}>
                {banner.is_active ? (
                  <><ExclamationCircle className="w-4 h-4 mr-2" /> Deactivate</>
                ) : (
                  <><Check className="w-4 h-4 mr-2" /> Activate</>
                )}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item className="text-ui-fg-error" onClick={() => handleDeleteBanner(banner)}>
                <Trash className="w-4 h-4 mr-2" /> Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        )
      },
    }),
  ]

  const table = useDataTable({
    data: banners,
    columns,
    getRowId: (banner) => banner.id,
    rowCount: banners.length,
    isLoading,
  })

  return (
    <Container>
      <ToastDisplay toasts={toasts} onDismiss={dismissToast} />
      <Header
        title="Banner Management"
        actions={[{
          type: "custom",
          children: <CreateForm onSave={handleSaveBanner} isEditing={false} />,
        }]} />

      {error ? (
        <div className="flex flex-col items-center justify-center p-4 text-ui-fg-error">
          <p>{error}</p>
          <Button variant="secondary" size="small" className="mt-4" onClick={fetchBanners}>Try Again</Button>
        </div>
      ) : (
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex items-center justify-between">
            <Heading>Banners</Heading>
          </DataTable.Toolbar>
          <DataTable.Table />
        </DataTable>
      )}

      {selectedBanner && (
        <CreateForm
          onSave={async (formData) => {
            await handleUpdateBanner(formData)
            setIsEditModalOpen(false)
          }}
          initialData={{
            ...selectedBanner,
            valid_from: selectedBanner?.valid_from ? new Date(selectedBanner.valid_from) : undefined,
            valid_until: selectedBanner?.valid_until ? new Date(selectedBanner.valid_until) : undefined
          }}
          isEditing={true}
          autoOpen={isEditModalOpen}
          modalKey={editModalKey}
        />
      )}
    </Container>
  )
}

export default BannerWidget;
