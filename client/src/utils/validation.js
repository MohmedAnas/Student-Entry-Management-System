export const validateForm = (data) => {
  const errors = {};

  if (!data.name?.trim()) errors.name = 'Name is required';
  
  if (!data.mobileNo) {
    errors.mobileNo = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(data.mobileNo)) {
    errors.mobileNo = 'Mobile must be 10 digits';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.address?.trim()) errors.address = 'Address is required';
  if (!data.admissionDate) errors.admissionDate = 'Admission date is required';
  if (!data.courseName) errors.courseName = 'Course name is required';

  return errors;
};

export const validateEditForm = (data) => {
  const errors = {};

  if (data.mobileNo && !/^\d{10}$/.test(data.mobileNo)) {
    errors.mobileNo = 'Mobile must be 10 digits';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  return errors;
};
