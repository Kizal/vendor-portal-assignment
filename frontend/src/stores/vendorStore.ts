import { defineStore } from 'pinia'
import { ref } from 'vue'
import { VendorService } from '../services/VendorService'
import type { Vendor } from '../types/Vendor'

export const useVendorStore = defineStore('vendor', () => {
  const vendors = ref<Vendor[]>([])
  const loading = ref(false)
  const fetchError = ref<string | null>(null)
  const actionError = ref<string | null>(null)

  async function fetchVendors() {
    loading.value = true
    fetchError.value = null
    
    try {
      vendors.value = (await VendorService.getVendors()).reverse();
    } catch (err) {
      fetchError.value = 'Failed to load vendors. Please try again later.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addVendor(vendor: Vendor) {
    loading.value = true
    actionError.value = null
    
    try {
      await VendorService.createVendor(vendor)
      // Refresh the vendors list after adding a new vendor
      await fetchVendors()
    } catch (err: any) {
      actionError.value = err.message || 'Failed to add vendor. Please try again later.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteVendor(id: number) {
    loading.value = true
    actionError.value = null

    try {
        await VendorService.deleteVendor(id.toString())
        await fetchVendors()
    } catch (err: any) {
        actionError.value = err.message || 'Failed to delete vendor.'
        console.error(err)
    } finally {
        loading.value = false
    }
  }

  return {
    vendors,
    loading,
    fetchError,
    actionError,
    fetchVendors,
    addVendor,
    deleteVendor
  }
})