const getTenantConfig = async () => {
  const response = await fetch('/api/tenant-config');
  return response.json();
};

export default getTenantConfig;