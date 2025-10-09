import {
  AccountBalanceWallet,
  TrendingUp,
  CreditCard,
  AttachMoney,
  Savings,
  Security as SecurityIcon,
  Calculate,
  LocalAtm,
  PieChart
} from '@mui/icons-material'

export const bankingServices = [
  { icon: AccountBalanceWallet, title: 'Hesap İşlemleri', description: 'Hesap bakiyesi ve hareket görüntüleme' },
  { icon: TrendingUp, title: 'Yatırım', description: 'Borsa ve yatırım işlemleri' },
  { icon: CreditCard, title: 'Kart İşlemleri', description: 'Kredi kartı ve banka kartı işlemleri' },
  { icon: AttachMoney, title: 'Krediler', description: 'İhtiyaç, konut ve taşıt kredileri' },
  { icon: Savings, title: 'Mevduat', description: 'Vadeli hesap ve altın hesabı' },
  { icon: SecurityIcon, title: 'Sigorta', description: 'Hayat ve genel sigorta ürünleri' }
]

export const quickActions = [
  { title: 'Kredi Hesaplama', icon: Calculate, color: '#1976d2' },
  { title: 'Döviz Kurları', icon: TrendingUp, color: '#388e3c' },
  { title: 'Şube/ATM', icon: LocalAtm, color: '#f57c00' },
  { title: 'Faiz Oranları', icon: PieChart, color: '#7b1fa2' }
]
