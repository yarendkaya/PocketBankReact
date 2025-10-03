export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

export const validateLoginForm = (email: string, password: string): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!email.trim()) {
    errors.email = 'E-posta gerekli'
  } else if (!validateEmail(email)) {
    errors.email = 'Geçerli bir e-posta girin'
  }

  if (!password) {
    errors.password = 'Şifre gerekli'
  }

  return errors
}

export const validateRegisterForm = (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!firstName.trim()) {
    errors.firstName = 'Ad gerekli'
  }
  if (!lastName.trim()) {
    errors.lastName = 'Soyad gerekli'
  }
  if (!email || !validateEmail(email)) {
    errors.email = 'Geçerli e-posta gerekli'
  }
  if (!phone.trim()) {
    errors.phone = 'Telefon numarası gerekli'
  }
  if (!validatePassword(password)) {
    errors.password = 'Şifre en az 8 karakter olmalı'
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Şifreler eşleşmiyor'
  }

  return errors
}
