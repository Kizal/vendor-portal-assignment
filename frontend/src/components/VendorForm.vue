<template>
  <div class="vendor-form card">
    <h2>Add New Vendor</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input 
          id="name" 
          v-model="form.name" 
          type="text" 
          required 
          placeholder="Company name"
          :disabled="vendorStore.loading"
        />
      </div>
      
      <div class="form-group">
        <label for="contactPerson">Contact Person:</label>
        <input 
          id="contactPerson" 
          v-model="form.contact_person" 
          type="text" 
          required 
          placeholder="Contact person name"
          :disabled="vendorStore.loading"
        />
      </div>
      
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          required 
          placeholder="contact@example.com"
          :disabled="vendorStore.loading"
        />
      </div>
      
      <div class="form-group">
        <label for="partnerType">Partner Type:</label>
        <select 
          id="partnerType" 
          v-model="form.partner_type" 
          required
          :disabled="vendorStore.loading"
        >
          <option value="Supplier">Supplier</option>
          <option value="Partner">Partner</option>
        </select>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="primary" :disabled="vendorStore.loading">
          {{ vendorStore.loading ? 'Submitting...' : 'Add Vendor' }}
        </button>
      </div>

      <div v-if="vendorStore.actionError" class="alert error-message" role="alert">
        <strong>Error:</strong> {{ vendorStore.actionError }}
      </div>
      <div v-if="success" class="alert success-message" role="status">
        Vendor added successfully!
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useVendorStore } from '../stores/vendorStore';
import type { Vendor } from '../types/Vendor';

const vendorStore = useVendorStore();

const form = reactive<Vendor>({
  name: '',
  contact_person: '',
  email: '',
  partner_type: 'Supplier'
});

const success = ref(false);

const resetForm = () => {
  form.name = '';
  form.contact_person = '';
  form.email = '';
  form.partner_type = 'Supplier';
};

const submitForm = async () => {
  success.value = false;
  
  try {
    await vendorStore.addVendor({ ...form });
    success.value = true;
    resetForm();
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (err) {
    // Error is handled in store and displayed via vendorStore.actionError
  }
};
</script>

<style scoped>
.vendor-form {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--color-text);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  background-color: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: var(--color-table-header); /* Use subtle gray */
  cursor: not-allowed;
  opacity: 0.7;
}

.form-actions {
  margin-top: var(--spacing-lg);
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  font-weight: 600;
}

.alert {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: 6px;
  font-size: 0.95em;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  border: 1px solid #ef5350;
}

.success-message {
  color: #2e7d32;
  background-color: #e8f5e9;
  border: 1px solid #66bb6a;
}

/* Dark mode adjustments for alerts */
:root[data-theme="dark"] .error-message {
  background-color: rgba(211, 47, 47, 0.1);
  color: #ef9a9a;
  border-color: #e57373;
}

:root[data-theme="dark"] .success-message {
  background-color: rgba(46, 125, 50, 0.1);
  color: #a5d6a7;
  border-color: #81c784;
}
</style>