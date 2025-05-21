/**
 * Utility functions to help with Strapi API integration
 */

// Map between Strapi admin IDs and API IDs
// Update this map whenever you notice a discrepancy
const idMap = {
  // Strapi Admin ID: API ID
  '16': '17',  // The company showing as ID 16 in admin is actually ID 17 in API
  // Add more mappings as needed
};

/**
 * Convert a Strapi admin ID to the corresponding API ID
 * @param {string|number} adminId - The ID shown in Strapi admin
 * @returns {string} - The corresponding ID to use in API calls
 */
export const getApiId = (adminId) => {
  const id = String(adminId);
  return idMap[id] || id;
};

/**
 * Convert an API ID back to the Strapi admin ID
 * @param {string|number} apiId - The ID returned by the API
 * @returns {string} - The corresponding ID shown in Strapi admin
 */
export const getAdminId = (apiId) => {
  const id = String(apiId);
  // Reverse lookup in the map
  for (const [adminId, mappedApiId] of Object.entries(idMap)) {
    if (mappedApiId === id) {
      return adminId;
    }
  }
  return id;
};

/**
 * Fetch all companies and return a mapping of names to IDs
 * This can be used to find the correct ID by company name
 */
export const getCompanyIdsByName = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/companies');
    const data = await response.json();
    
    if (data && data.data && Array.isArray(data.data)) {
      const mapping = {};
      data.data.forEach(company => {
        if (company.attributes.Name) {
          mapping[company.attributes.Name] = company.id;
        }
      });
      return mapping;
    }
    return {};
  } catch (error) {
    console.error('Error fetching company IDs by name:', error);
    return {};
  }
};