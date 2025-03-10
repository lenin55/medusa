import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { CreateForm } from "../components/create-form"
import { 
  Container, 
  Table, 
  Heading, 
  Button, 
  DropdownMenu,
  Badge,
  Skeleton
} from "@medusajs/ui"
import { Header } from "../components/Header"
import { useState, useEffect } from "react"
import { PencilSquare, Trash, Camera, Check, ExclamationCircle } from "@medusajs/icons"
import { format } from "date-fns"

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

// The widget
const BannerWidget = () => {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch banners from API
  const fetchBanners = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/admin/banners')
      
      if (!response.ok) {
        throw new Error(`Error fetching banners: ${response.statusText}`)
      }
      
      const data = await response.json()
      setBanners(data.banners || [])
    } catch (err) {
      console.error('Failed to fetch banners:', err)
      setError('Failed to load banners. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle storage event for cross-tab synchronization
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'medusa_banners') {
      fetchBanners()
    }
  }

  // Handle custom bannersUpdated event
  const handleBannersUpdated = () => {
    fetchBanners()
  }

  // Load banners on initial render
  useEffect(() => {
    fetchBanners()
    
    // Add event listeners for synchronization
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('bannersUpdated', handleBannersUpdated)
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannersUpdated', handleBannersUpdated)
    }
  }, [])

  // Handle create/save new banner
  const handleSaveBanner = async (formData: Omit<Banner, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch('/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error(`Error creating banner: ${response.statusText}`)
      }
      
      // Refresh banners from server to ensure synchronized state
      fetchBanners()
      
      console.log("Banner created successfully")
    } catch (err) {
      console.error('Failed to create banner:', err)
    }
  }

  // Handle update banner
  const handleUpdateBanner = async (formData: Partial<Banner>) => {
    if (!selectedBanner) return

    try {
      const response = await fetch(`/admin/banners/${selectedBanner.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error(`Error updating banner: ${response.statusText}`)
      }
      
      // Refresh banners from server to ensure synchronized state
      fetchBanners()
      
      console.log("Banner updated successfully")
    } catch (err) {
      console.error('Failed to update banner:', err)
    } finally {
      setIsEditModalOpen(false)
      setSelectedBanner(null)
    }
  }

  // Handle delete banner
  const handleDeleteBanner = async (banner: Banner) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete the banner "${banner.name}"?`)) {
      return
    }
    
    try {
      const response = await fetch(`/admin/banners/${banner.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`Error deleting banner: ${response.statusText}`)
      }
      
      // Refresh banners from server to ensure synchronized state
      fetchBanners()
      
      console.log("Banner deleted successfully")
    } catch (err) {
      console.error('Failed to delete banner:', err)
    }
  }

  // Handle edit button click
  const handleEditClick = (banner: Banner) => {
    setSelectedBanner(banner)
    setIsEditModalOpen(true)
  }

  // Handle toggle active status
  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/admin/banners/${banner.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !banner.is_active,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Error toggling banner status: ${response.statusText}`)
      }
      
      // Refresh banners from server to ensure synchronized state
      fetchBanners()
      
      console.log(`Banner ${banner.is_active ? "deactivated" : "activated"} successfully`)
    } catch (err) {
      console.error('Failed to toggle banner status:', err)
    }
  }

  // Determine banner status for display
  const getBannerStatus = (banner: Banner) => {
    if (!banner.is_active) return { label: "Inactive", color: "red" }
    
    const now = new Date()
    const validFrom = banner.valid_from ? new Date(banner.valid_from) : null
    const validUntil = banner.valid_until ? new Date(banner.valid_until) : null
    
    if (validFrom && validFrom > now) return { label: "Scheduled", color: "blue" }
    if (validUntil && validUntil < now) return { label: "Expired", color: "gray" }
    return { label: "Active", color: "green" }
  }

  return (
    <Container>
      <Header
        title="Banner Management"
        actions={[
          {
            type: "custom",
            children: <CreateForm onSave={handleSaveBanner} />,
          },
        ]}
      />
      
      {/* Display edit modal when needed */}
      {isEditModalOpen && selectedBanner && (
        <CreateForm 
          onSave={handleUpdateBanner} 
          initialData={selectedBanner}
          isEditing={true}
        />
      )}
      
      {/* Display the banners */}
      <div className="mt-6 px-6 pb-6">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-4 text-ui-fg-error">
            <p>{error}</p>
            <Button 
              variant="secondary" 
              size="small"
              className="mt-4"
              onClick={() => fetchBanners()}
            >
              Try Again
            </Button>
          </div>
        ) : banners.length > 0 ? (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Image</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Valid Period</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {banners.map((banner) => {
                const status = getBannerStatus(banner)
                
                return (
                  <Table.Row key={banner.id}>
                    <Table.Cell>
                      <div className="relative w-14 h-14 flex items-center justify-center border rounded overflow-hidden">
                        {banner.image_url ? (
                          <img 
                            src={banner.image_url} 
                            alt={banner.name} 
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <Camera className="text-ui-fg-subtle" />
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="font-medium">{banner.name}</span>
                        {banner.description && (
                          <span className="text-ui-fg-subtle text-xs line-clamp-2">
                            {banner.description}
                          </span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={status.color as any}>
                        {status.label}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col text-sm">
                        {banner.valid_from && (
                          <span>
                            From: {format(new Date(banner.valid_from), "MMM d, yyyy")}
                          </span>
                        )}
                        {banner.valid_until && (
                          <span>
                            To: {format(new Date(banner.valid_until), "MMM d, yyyy")}
                          </span>
                        )}
                        {!banner.valid_from && !banner.valid_until && (
                          <span className="text-ui-fg-subtle">No time limit</span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <Button variant="secondary" size="small">
                            Actions
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item 
                            onClick={() => handleEditClick(banner)}
                          >
                            <PencilSquare className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item 
                            onClick={() => handleToggleActive(banner)}
                          >
                            {banner.is_active ? (
                              <>
                                <ExclamationCircle className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item 
                            onClick={() => handleDeleteBanner(banner)}
                            className="text-ui-fg-error"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <Heading>No banners yet</Heading>
            <p className="text-ui-fg-subtle mt-1">
              Create a banner to see it displayed here
            </p>
          </div>
        )}
      </div>
    </Container>
  )
}

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default BannerWidget