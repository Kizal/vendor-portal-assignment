<template>
  <div class="vendor-list card">
    <h2>Vendor List</h2>
    <div v-if="vendorStore.loading && vendorStore.vendors.length === 0" class="loading"></div>
    <div v-else-if="vendorStore.fetchError" class="error-message">{{ vendorStore.fetchError }}</div>
    <div v-else-if="vendorStore.vendors.length === 0" class="no-vendors">
      <div class="empty-state-icon">📋</div>
      <p class="empty-text">No vendors found.</p>
      <p class="sub-text">Add your first vendor using the form.</p>
    </div>
    <div v-else class="table-container">
      <table class="vendors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Partner Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vendor in vendorStore.vendors" :key="vendor.id" tabindex="0">
            <td>{{ vendor.id }}</td>
            <td>{{ vendor.name }}</td>
            <td>{{ vendor.contact_person }}</td>
            <td>{{ vendor.email }}</td>
            <td>
              <span :class="['badge', vendor.partner_type.toLowerCase()]">{{ vendor.partner_type }}</span>
            </td>
            <td>
              <button 
                @click.stop.prevent="initiateDelete(vendor)" 
                class="delete-btn"
                :disabled="vendorStore.loading"
                aria-label="Delete vendor"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Custom Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h3 id="modal-title">Confirm Deletion</h3>
        <p>Are you sure you want to delete <strong>{{ vendorToDelete?.name }}</strong>?</p>
        <p class="modal-warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-cancel">Cancel</button>
          <button @click="confirmDelete" class="btn-delete" :disabled="vendorStore.loading">
            {{ vendorStore.loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVendorStore } from '../stores/vendorStore';
import type { Vendor } from '../types/Vendor';

const vendorStore = useVendorStore();
const showDeleteModal = ref(false);
const vendorToDelete = ref<Vendor | null>(null);

onMounted(() => {
  vendorStore.fetchVendors();
});

const initiateDelete = (vendor: Vendor) => {
  console.log('Initiating delete for:', vendor);
  if (!vendor.id) {
    console.error('Missing ID');
    return;
  }
  vendorToDelete.value = vendor;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  vendorToDelete.value = null;
};

const confirmDelete = async () => {
  if (!vendorToDelete.value || !vendorToDelete.value.id) return;
  
  try {
    await vendorStore.deleteVendor(vendorToDelete.value.id);
    showDeleteModal.value = false;
    vendorToDelete.value = null;
  } catch (error) {
    console.error('Delete failed:', error);
    // Keep modal open on error to show state or handle differently
  }
};
</script>

<style scoped>
.vendor-list {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: relative;
}

.table-container {
  overflow-x: auto;
}

.vendors-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-md);
  color: var(--color-text);
  font-size: 0.95rem;
}

.vendors-table th,
.vendors-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s;
}

.vendors-table th {
  background-color: var(--color-table-header);
  font-weight: 600;
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 0.8em;
  letter-spacing: 0.5px;
}

/* Zebra striping */
.vendors-table tbody tr:nth-child(even) {
  background-color: var(--color-table-zebra);
}

/* Hover effects */
.vendors-table tbody tr:hover {
  background-color: var(--color-table-row-hover);
  cursor: default;
}

/* Focus states for accessibility */
.vendors-table tbody tr:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.delete-btn {
  padding: 6px 12px;
  font-size: 0.85rem;
  background-color: transparent;
  border: 1px solid var(--color-error);
  color: var(--color-error);
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s;
}

.delete-btn:hover:not(:disabled) {
  background-color: var(--color-error);
  color: white;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

.no-vendors {
  padding: var(--spacing-xl) 20px;
  text-align: center;
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  margin-top: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-text {
  font-size: 1.2em;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.sub-text {
  font-size: 0.95em;
  opacity: 0.7;
  margin: 0;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.badge.supplier {
  background-color: rgba(33, 150, 243, 0.15);
  color: #1976d2;
}

.badge.partner {
  background-color: rgba(156, 39, 176, 0.15);
  color: #7b1fa2;
}

.error-message {
  color: var(--color-error);
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.loading {
  padding: var(--spacing-lg);
  text-align: center;
  font-style: italic;
  opacity: 0.7;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: var(--color-card-bg);
  padding: var(--spacing-lg);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  border: 1px solid var(--color-border);
}

.modal-content h3 {
  margin-top: 0;
  color: var(--color-text);
}

.modal-warning {
  color: var(--color-error);
  font-size: 0.9em;
  margin-bottom: var(--spacing-md);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-delete {
  background-color: var(--color-error);
  color: white;
  border: none;
}

.btn-delete:hover:not(:disabled) {
  background-color: #d32f2f;
}

/* Dark mode adjustments */
:root[data-theme="dark"] .badge.supplier {
  background-color: rgba(33, 150, 243, 0.2);
  color: #64b5f6;
}

:root[data-theme="dark"] .badge.partner {
  background-color: rgba(156, 39, 176, 0.2);
  color: #ba68c8;
}
</style>