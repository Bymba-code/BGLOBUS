'use client'

import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Textarea, Button, PageHeader } from '@/components/FormElements'
import { 
  DevicePhoneMobileIcon, PlusIcon, TrashIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon, 
  ChevronUpIcon, ChevronDownIcon, ShieldCheckIcon, BoltIcon, ClockIcon, UserIcon, 
  CreditCardIcon, GlobeAltIcon, StarIcon, SparklesIcon 
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'
import { useSaveReset } from '@/hooks/useSaveReset'
import { SaveResetButtons } from '@/components/SaveResetButtons'

const iconMap: Record<string, any> = {
  check: CheckCircleIcon,
  shield: ShieldCheckIcon,
  bolt: BoltIcon,
  clock: ClockIcon,
  user: UserIcon,
  card: CreditCardIcon,
  globe: GlobeAltIcon,
  star: StarIcon,
  sparkles: SparklesIcon
}

interface AppDownloadData {
  titles: { mn: string; en: string }[]
  features: { 
    mn: string; 
    en: string; 
    active: boolean; 
    color?: string; 
    size?: string;
    fontWeight?: string;
    fontFamily?: string;
    icon?: string;
    iconColor?: string;
  }[]
  appStoreUrl: string
  googlePlayUrl: string
  appImageUrl: string
  appSvgCode?: string
  // Styling options
  textFont: string
  textColor: string
  titleColor: string
  accentColor: string
  buttonBgColor: string
  buttonTextColor: string
  // Google Play Specific
  googleButtonBgColor?: string
  googleButtonTextColor?: string
  
  iconColor: string
  featuresTextColor: string
  featuresTextSize: string
  position: 'left' | 'right'
  // Layout positions
  titlePositions: {
    top: number
    left: number
    rotation: number
    size: string
    color?: string
    fontWeight?: string;
    fontFamily?: string;
  }[]
  featuresLayout: 'vertical' | 'horizontal' | 'grid'
  // Button styles
  buttonStyle: 'solid' | 'outline' | 'minimal' | '3d' | 'glass' | 'flat' | 'gradient'
  
  // Device Frame
  deviceFrame: 'none' | 'iphone' | 'android' | 'macbook'
  deviceColor?: string
  deviceRotation?: number
}

const defaultData: AppDownloadData = {
  titles: [
    { mn: 'Манай', en: 'Our' },
    { mn: 'апп-аар', en: 'app' },
    { mn: 'илүү хялбар,', en: 'easier,' },
    { mn: 'хурдан', en: 'faster' }
  ],
  features: [
    { mn: '24/7 зээлийн мэдээлэл шалгах', en: 'Check loan info 24/7', active: true, icon: 'clock' },
    { mn: 'Хаанаас ч төлбөр төлөх', en: 'Pay from anywhere', active: true, icon: 'globe' },
    { mn: 'Хурдан зээлийн хүсэлт илгээх', en: 'Quick loan application', active: true, icon: 'bolt' },
    { mn: 'Нууцлал, аюулгүй байдал', en: 'Privacy & Security', active: true, icon: 'shield' },
  ],
  appStoreUrl: '#',
  googlePlayUrl: '#',
  appImageUrl: '/App.svg',
  textFont: 'font-sans',
  textColor: '#334155',
  titleColor: '#1e293b',
  accentColor: '#2563eb',
  buttonBgColor: '#2563eb',
  buttonTextColor: '#ffffff',
  googleButtonBgColor: 'transparent',
  googleButtonTextColor: '#334155',
  iconColor: '#2563eb',
  featuresTextColor: '#334155',
  featuresTextSize: 'text-sm',
  position: 'left',
  titlePositions: [
    { top: 24, left: 16, rotation: -2, size: 'text-5xl' },
    { top: 96, left: 80, rotation: 3, size: 'text-6xl' },
    { top: 176, left: 32, rotation: -1, size: 'text-4xl' },
    { top: 240, left: 144, rotation: 2, size: 'text-5xl' },
  ],
  featuresLayout: 'vertical',
  buttonStyle: 'solid',
  deviceFrame: 'none',
  deviceColor: '#000000',
  deviceRotation: 0,
}

const fontFamilies = [
  { label: 'Sans Serif (Default)', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Mono', value: 'font-mono' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { label: 'Impact', value: 'Impact, sans-serif' },
]

const fontWeights = [
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
  { label: 'Black', value: '900' }
]

export default function AppDownloadPage() {
  const { data, setData, saveSuccess, handleSave: saveData, handleReset } = useSaveReset<AppDownloadData>('appDownloadConfig', defaultData)
  const [newFeature, setNewFeature] = useState({ mn: '', en: '', icon: 'check' })
  const [newTitle, setNewTitle] = useState({ mn: '', en: '' })
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState<{ mn: string; en: string; color?: string; size?: string; fontWeight?: string; fontFamily?: string }>({ mn: '', en: '' })
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null)
  const [editingFeature, setEditingFeature] = useState<{ mn: string; en: string; color?: string; size?: string; fontWeight?: string; fontFamily?: string; icon?: string; iconColor?: string }>({ mn: '', en: '' })
  const [previewLang, setPreviewLang] = useState<'mn' | 'en'>('mn')
  const [showPreview, setShowPreview] = useState(true)
  const [showAddTitle, setShowAddTitle] = useState(true)
  const [showAddFeature, setShowAddFeature] = useState(true)
  const [imageInputType, setImageInputType] = useState<'upload' | 'svg'>('upload')
  const [svgError, setSvgError] = useState<string | null>(null);

  const validateSvg = (svgContent: string) => {
    if (!svgContent) {
        setSvgError(null);
        return true;
    }
    const trimmed = svgContent.trim();
    // Simple check for svg tag
    if (!trimmed.toLowerCase().includes('<svg')) {
      setSvgError('Та зөв SVG код оруулна уу.');
      return false;
    }
    
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(trimmed, "image/svg+xml");
        const errorNode = doc.querySelector("parsererror");
        if (errorNode) {
            setSvgError('Та зөв SVG код оруулна уу.');
            return false;
        }
    } catch (e) {
        setSvgError('Та зөв SVG код оруулна уу.');
        return false;
    }
    
    setSvgError(null);
    return true;
  }

  const updateTitleField = (idx: number, field: string, value: any) => {
    // Determine if the field belongs to title text or layout position
    const isLayoutField = ['top', 'left', 'rotation', 'size', 'color', 'fontWeight', 'fontFamily'].includes(field);
    const newData = { ...data };
    
    if (isLayoutField) {
      const newCtx = [...newData.titlePositions];
      newCtx[idx] = { ...newCtx[idx], [field]: value };
      newData.titlePositions = newCtx;
    } else {
      const newCtx = [...newData.titles];
      // @ts-ignore
      newCtx[idx] = { ...newCtx[idx], [field]: value };
      newData.titles = newCtx;
    }
    
    setData(newData);
    setEditingTitle(prev => ({ ...prev, [field]: value }));
  }

  const updateFeatureField = (idx: number, field: string, value: any) => {
    const newFeatures = [...data.features];
    // @ts-ignore
    newFeatures[idx] = { ...newFeatures[idx], [field]: value };
    setData({ ...data, features: newFeatures });
    setEditingFeature(prev => ({ ...prev, [field]: value }));
  }

  const handleAddFeature = () => {
    if (!newFeature.mn.trim() || !newFeature.en.trim()) return
    setData({
      ...data,
      features: [...data.features, { ...newFeature, active: true }],
    })
    setNewFeature({ mn: '', en: '', icon: 'check' })
  }

  const handleDeleteFeature = (index: number) => {
    if (!confirm('Устгах уу?')) return
    setData({
      ...data,
      features: data.features.filter((_, i) => i !== index),
    })
  }

  const handleToggleFeature = (index: number) => {
    const newFeatures = [...data.features]
    newFeatures[index].active = !newFeatures[index].active
    setData({
      ...data,
      features: newFeatures
    })
  }

  const handleAddTitle = () => {
    if (!newTitle.mn.trim() || !newTitle.en.trim()) return
    
    // Calculate default position for new title
    const lastPosition = data.titlePositions[data.titlePositions.length - 1]
    const newPosition = {
      top: lastPosition.top + 80,
      left: lastPosition.left + 20,
      rotation: Math.floor(Math.random() * 7) - 3, // Random rotation between -3 and 3
      size: 'text-5xl'
    }
    
    setData({
      ...data,
      titles: [...data.titles, newTitle],
      titlePositions: [...data.titlePositions, newPosition]
    })
    setNewTitle({ mn: '', en: '' })
  }

  const handleDeleteTitle = (index: number) => {
    if (data.titles.length <= 1) {
      alert('Хамгийн багадаа 1 гарчиг байх ёстой!')
      return
    }
    if (!confirm('Устгах уу?')) return
    
    setData({
      ...data,
      titles: data.titles.filter((_, i) => i !== index),
      titlePositions: data.titlePositions.filter((_, i) => i !== index)
    })
  }

  const handleUpdateTitle = (index: number, value: { mn: string; en: string }) => {
    const newTitles = [...data.titles]
    newTitles[index] = value
    setData({ ...data, titles: newTitles })
  }

  const handleStartEditTitle = (index: number) => {
    setEditingTitleIndex(index)
    setEditingTitle({
      ...data.titles[index],
      color: data.titlePositions[index].color || (index === 1 ? data.accentColor : data.titleColor),
      size: data.titlePositions[index].size,
      fontWeight: data.titlePositions[index].fontWeight,
      fontFamily: data.titlePositions[index].fontFamily
    })
  }

  const handleSaveTitle = () => {
    if (editingTitleIndex !== null) {
      const newTitles = [...data.titles]
      newTitles[editingTitleIndex] = { mn: editingTitle.mn, en: editingTitle.en }
      
      const newPositions = [...data.titlePositions]
      newPositions[editingTitleIndex] = {
        ...newPositions[editingTitleIndex],
        color: editingTitle.color,
        size: editingTitle.size || 'text-5xl'
      }

      setData({ ...data, titles: newTitles, titlePositions: newPositions })
      setEditingTitleIndex(null)
      setEditingTitle({ mn: '', en: '' })
    }
  }

  const handleStartEditFeature = (index: number) => {
    setEditingFeatureIndex(index)
    setEditingFeature({
      ...data.features[index],
      color: data.features[index].color || data.featuresTextColor || data.textColor,
      size: data.features[index].size || data.featuresTextSize,
      fontWeight: data.features[index].fontWeight,
      fontFamily: data.features[index].fontFamily,
      icon: data.features[index].icon || 'check'
    })
  }

  const handleSaveFeature = () => {
    if (editingFeatureIndex !== null) {
      const newFeatures = [...data.features]
      newFeatures[editingFeatureIndex] = { 
        ...newFeatures[editingFeatureIndex],
        mn: editingFeature.mn, 
        en: editingFeature.en,
        color: editingFeature.color,
        size: editingFeature.size,
        icon: editingFeature.icon
      }
      setData({ ...data, features: newFeatures })
      setEditingFeatureIndex(null)
      setEditingFeature({ mn: '', en: '' })
    }
  }

  return (
    <AdminLayout title="App Download">
      <div className="space-y-6">
        {saveSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-900">Амжилттай хадгалагдлаа!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">Өөрчлөлтүүд хадгалагдсан.</p>
            </div>
          </div>
        )}
        
        <PageHeader
          title="App Download Section"
          description="Апп татаж авах хэсгийг удирдах"
          action={
            <SaveResetButtons 
              onSave={saveData}
              onReset={handleReset}
              confirmMessage="Та хадгалахдаа итгэлтэй байна уу?"
            />
          }
        />

        {/* Preview Section */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-100 overflow-hidden transition-all duration-300">
          <div 
            className="px-6 py-4 border-b border-blue-100 bg-white/60 backdrop-blur-sm flex items-center justify-between cursor-pointer hover:bg-white/80 transition-colors"
            onClick={() => setShowPreview(!showPreview)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full bg-emerald-500 ${showPreview ? 'animate-pulse' : 'opacity-50'}`}></div>
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide select-none">
                Preview
              </span>
              <span className="text-xs text-slate-400 font-normal ml-2 select-none">
                {showPreview ? '(Click to hide)' : '(Click to show)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewLang('mn')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewLang === 'mn'
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  MN
                </button>
                <button
                  onClick={() => setPreviewLang('en')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewLang === 'en'
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
              </div>
              <button 
                onClick={(e) => {
                   e.stopPropagation();
                   setShowPreview(!showPreview);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPreview ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {showPreview && (
          <div className="p-8 animate-in slide-in-from-top-2 duration-300">
            <div className="max-w-6xl mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${data.position === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text Content */}
                <div className={`flex flex-col gap-8 ${data.position === 'right' ? 'lg:order-2' : ''}`}>
                  {/* Scattered headline */}
                  <div className={`relative min-h-[300px] ${data.textFont}`}>
                    {data.titles.map((title, index) => {
                      const pos = data.titlePositions[index]
                      const isTwSize = pos.size?.startsWith('text-')
                      return (
                      <span
                        key={index}
                        className={`absolute ${isTwSize ? pos.size : ''} ${!pos.fontWeight ? 'font-extrabold' : ''}`}
                        style={{
                          top: `${pos.top}px`,
                          left: `${pos.left}px`,
                          transform: `rotate(${pos.rotation}deg)`,
                          color: pos.color || (index === 1 ? data.accentColor : data.titleColor),
                          fontSize: isTwSize ? undefined : pos.size,
                          fontWeight: pos.fontWeight,
                          fontFamily: pos.fontFamily
                        }}
                      >
                        {title[previewLang]}
                      </span>
                    )})}
                  </div>

                  {/* Features */}
                  <div className={`flex ${
                    data.featuresLayout === 'horizontal' ? 'flex-row flex-wrap' :
                    data.featuresLayout === 'grid' ? 'grid grid-cols-2' :
                    'flex-col'
                  } gap-4 mt-2 ${data.textFont}`}>
                    {data.features.filter(f => f.active).map((feature, index) => {
                      const isTwSize = feature.size ? feature.size.startsWith('text-') : data.featuresTextSize?.startsWith('text-')
                      const sizeVal = feature.size || data.featuresTextSize || 'text-sm'
                      const sizeClass = isTwSize ? sizeVal : ''
                      const sizeStyle = isTwSize ? undefined : sizeVal

                      return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110 shadow-sm" style={{ backgroundColor: `${feature.iconColor || data.iconColor}15` }}>
                          {(() => {
                            const Icon = iconMap[feature.icon || 'check'] || CheckCircleIcon;
                            return <Icon className="w-5 h-5" style={{ color: feature.iconColor || data.iconColor }} />;
                          })()}
                        </div>
                        <span 
                          className={`${sizeClass}`} 
                          style={{ 
                            color: feature.color || data.featuresTextColor || data.textColor,
                            fontSize: sizeStyle,
                            fontWeight: feature.fontWeight,
                            fontFamily: feature.fontFamily
                          }}
                        >
                          {feature[previewLang]}
                        </span>
                      </div>
                    )})}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    {/* App Store Button */}
                    <div 
                        className={`flex items-center gap-3 px-6 py-3.5 font-medium transition-all cursor-pointer ${data.textFont} ${
                            data.buttonStyle === 'solid' ? 'rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5' :
                            data.buttonStyle === 'outline' ? 'rounded-xl border-2 hover:bg-slate-50' :
                            data.buttonStyle === '3d' ? 'rounded-xl border-b-4 active:border-b-0 active:translate-y-1' :
                            data.buttonStyle === 'glass' ? 'rounded-xl backdrop-blur-md shadow-lg hover:bg-white/10 border border-white/20' :
                            data.buttonStyle === 'flat' ? 'rounded-sm hover:brightness-95' :
                            data.buttonStyle === 'gradient' ? 'rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5' :
                            'rounded-xl hover:bg-slate-50'
                        }`} 
                        style={{ 
                            backgroundColor: ['solid', '3d', 'flat'].includes(data.buttonStyle) ? data.buttonBgColor : 
                                             data.buttonStyle === 'glass' ? `${data.buttonBgColor}CC` : 'transparent',
                            backgroundImage: data.buttonStyle === 'gradient' ? `linear-gradient(135deg, ${data.buttonBgColor}, ${data.accentColor})` : undefined,
                            color: ['solid', '3d', 'flat', 'gradient', 'glass'].includes(data.buttonStyle) ? data.buttonTextColor : data.buttonBgColor,
                            borderColor: data.buttonStyle === '3d' ? `${data.buttonBgColor}CC` : data.buttonBgColor
                         }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      App Store
                    </div>

                    {/* Google Play Button */}
                    <div 
                        className={`flex items-center gap-3 px-6 py-3.5 font-medium transition-all cursor-pointer ${data.textFont} ${
                            data.buttonStyle === 'solid' ? 'rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5' :
                            data.buttonStyle === 'outline' ? 'rounded-xl border-2 hover:bg-slate-50' :
                            data.buttonStyle === '3d' ? 'rounded-xl border-b-4 active:border-b-0 active:translate-y-1' :
                            data.buttonStyle === 'glass' ? 'rounded-xl backdrop-blur-md shadow-lg hover:bg-white/10 border border-white/20' :
                            data.buttonStyle === 'flat' ? 'rounded-sm hover:brightness-95' :
                            data.buttonStyle === 'gradient' ? 'rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5' :
                            'rounded-xl hover:bg-slate-50'
                        }`} 
                        style={{ 
                            backgroundColor: ['solid', '3d', 'flat'].includes(data.buttonStyle) ? (data.googleButtonBgColor || '#ffffff') : 
                                             data.buttonStyle === 'glass' ? `${data.googleButtonBgColor || '#ffffff'}CC` : 'transparent',
                            backgroundImage: data.buttonStyle === 'gradient' ? `linear-gradient(135deg, ${data.googleButtonBgColor || '#ffffff'}, ${data.accentColor})` : undefined,
                            color: ['solid', '3d', 'flat', 'gradient', 'glass'].includes(data.buttonStyle) ? (data.googleButtonTextColor || data.textColor) : (data.googleButtonBgColor || data.textColor),
                            borderColor: data.buttonStyle === '3d' ? `${data.googleButtonBgColor || '#e2e8f0'}CC` : 
                                         data.buttonStyle === 'outline' ? (data.googleButtonBgColor !== 'transparent' ? data.googleButtonBgColor : data.iconColor) : undefined
                        }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                      </svg>
                      Google Play
                    </div>
                  </div>
                </div>

                {/* App Image with Device Frame */}
                <div className={`flex justify-center lg:justify-end relative ${data.position === 'right' ? 'lg:order-1 lg:justify-start' : ''}`}>
                  {/* Device Frame Wrapper */}
                  <div 
                    className={`relative transition-all duration-300 ${
                      data.deviceFrame === 'iphone' ? 'w-[320px] h-[650px] rounded-[50px] shadow-[0_0_0_4px_#334155,0_0_0_8px_#1e293b,0_20px_50px_-10px_rgba(0,0,0,0.5)]' :
                      data.deviceFrame === 'android' ? 'w-[320px] h-[660px] rounded-[18px] shadow-[0_0_0_2px_#333,0_0_0_6px_#111,0_20px_50px_-10px_rgba(0,0,0,0.5)]' :
                      data.deviceFrame === 'macbook' ? 'w-[700px] mt-10' :
                      ''
                    }`}
                    style={{
                       transform: `rotate(${data.deviceRotation || 0}deg)`,
                       backgroundColor: data.deviceFrame === 'macbook' ? 'transparent' : (data.deviceColor || '#000000')
                    }}
                  >
                    
                    {/* iPhone Specific Details */}
                    {data.deviceFrame === 'iphone' && (
                       <>
                         {/* Dynamic Island */}
                         <div className="absolute top-3 left-1/2 -translate-x-1/2 h-[28px] w-[90px] bg-black rounded-full z-20 flex items-center justify-end px-2 gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
                         </div>
                         {/* Side Buttons */}
                         <div className="absolute top-28 -left-[10px] w-[6px] h-8 bg-gray-700 rounded-l-md shadow-sm" style={{ backgroundColor: data.deviceColor || '#374151' }}></div>
                         <div className="absolute top-40 -left-[10px] w-[6px] h-12 bg-gray-700 rounded-l-md shadow-sm" style={{ backgroundColor: data.deviceColor || '#374151' }}></div>
                         <div className="absolute top-56 -left-[10px] w-[6px] h-12 bg-gray-700 rounded-l-md shadow-sm" style={{ backgroundColor: data.deviceColor || '#374151' }}></div>
                         <div className="absolute top-44 -right-[10px] w-[6px] h-16 bg-gray-700 rounded-r-md shadow-sm" style={{ backgroundColor: data.deviceColor || '#374151' }}></div>
                       </>
                    )}

                    {/* Android Specific Details */}
                    {data.deviceFrame === 'android' && (
                       <>
                         {/* Punch Hole Camera */}
                         <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-20 ring-1 ring-gray-800 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#111] opacity-50"></div>
                         </div>
                         {/* Power / Volume Buttons */}
                         <div className="absolute top-40 -right-[8px] w-[4px] h-10 bg-gray-800 rounded-r-sm" style={{ backgroundColor: data.deviceColor || '#1f2937' }}></div>
                         <div className="absolute top-56 -right-[8px] w-[4px] h-20 bg-gray-800 rounded-r-sm" style={{ backgroundColor: data.deviceColor || '#1f2937' }}></div>
                       </>
                    )}
                    
                    {/* Macbook Frame Construction */}
                    {data.deviceFrame === 'macbook' ? (
                       <div className="relative group">
                          {/* Screen - Top Lid */}
                          <div 
                              className="rounded-t-2xl p-3 shadow-2xl relative z-10 w-full aspect-[16/10] border-[4px]"
                              style={{ 
                                backgroundColor: data.deviceColor || '#0f0f0f',
                                borderColor: data.deviceColor || '#1a1a1a'
                              }}
                          >
                             {/* Macbook Notch */}
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#1a1a1a] rounded-b-xl z-30 flex items-center justify-center">
                                {/* Webcam lens */}
                                <div className="w-2 h-2 bg-[#0f0f0f] rounded-full ring-1 ring-gray-700 relative">
                                    <div className="absolute top-[2px] right-[2px] w-0.5 h-0.5 bg-blue-900 rounded-full opacity-50"></div>
                                </div>
                             </div>
                             
                             {/* Screen Content Area */}
                             <div className="bg-white w-full h-full rounded-md overflow-hidden flex items-center justify-center relative">
                                {data.appSvgCode ? (
                                    <div 
                                        className="w-full h-full flex items-center justify-center"
                                        dangerouslySetInnerHTML={{ __html: data.appSvgCode }}
                                    />
                                  ) : (
                                  <Image
                                    src={data.appImageUrl}
                                    alt="Macbook App"
                                    fill
                                    className="object-cover object-top"
                                  />
                                )}
                             </div>
                          </div>
                          
                          {/* Macbook Bottom Base */}
                          <div className="relative z-20">
                             {/* Hinge Area */}
                             <div className="h-4 bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] mx-4 rounded-b-sm"></div>
                             {/* Main Body */}
                             <div className="h-3 bg-gradient-to-b from-[#d1d5db] to-[#9ca3af] rounded-b-xl mt-[-1px] shadow-lg flex items-center justify-center relative">
                                {/* Thumb groove for opening */}
                                <div className="absolute top-0 w-32 h-1.5 bg-[#a1a1a1]/50 rounded-b-md backdrop-blur-sm"></div>
                             </div>
                             {/* Rubber feet reflection shadow */}
                             <div className="absolute -bottom-2 left-10 right-10 h-4 bg-black/20 blur-xl rounded-full"></div>
                          </div>
                       </div>
                    ) : (
                      // Standard Phone Screen Content
                      <div className={`w-full h-full overflow-hidden flex items-center justify-center relative bg-white ${data.deviceFrame !== 'none' ? 'border-[3px] border-black' : ''} ${
                          data.deviceFrame === 'iphone' ? 'rounded-[46px]' : 
                          data.deviceFrame === 'android' ? 'rounded-[14px]' : 
                          ''
                      }`}>
                          {data.appSvgCode ? (
                            <div 
                                className={`${data.deviceFrame === 'none' ? 'w-[400px] h-[600px] drop-shadow-2xl' : 'w-full h-full'} flex items-center justify-center`}
                                dangerouslySetInnerHTML={{ __html: data.appSvgCode }}
                            />
                          ) : (
                          <div className={`${data.deviceFrame === 'none' ? 'w-[400px] h-[600px] drop-shadow-2xl relative' : 'w-full h-full relative'}`}>
                             <Image
                                src={data.appImageUrl}
                                alt="Mobile App"
                                fill
                                className={`${data.deviceFrame === 'none' ? 'object-contain' : 'object-cover'}`}
                             />
                          </div>
                          )}
                          
                          {/* Screen Glare Effect (Optional) */}
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Edit Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Titles Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Гарчиг хэсгүүд</h2>
                  <p className="text-sm text-gray-500">Нэмэх, засах</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {/* Add New Title */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-4">
                <div 
                  className="flex items-center justify-between gap-2 mb-3 cursor-pointer select-none"
                  onClick={() => setShowAddTitle(!showAddTitle)}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <h3 className="text-sm font-semibold text-slate-700">Шинэ гарчиг нэмэх</h3>
                  </div>
                  {showAddTitle ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
                </div>
                {showAddTitle && (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      Монгол
                    </label>
                    <input
                      value={newTitle.mn}
                      onChange={(e) => setNewTitle({ ...newTitle, mn: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="Гарчиг (Монгол)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      English
                    </label>
                    <input
                      value={newTitle.en}
                      onChange={(e) => setNewTitle({ ...newTitle, en: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="Title (English)"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTitle()}
                    />
                  </div>
                  <button
                    onClick={handleAddTitle}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow-md"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Гарчиг нэмэх
                  </button>
                </div>
                )}
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 flex items-start gap-2">
                  <span>Гарчиг бүрийг тусдаа өөр өөр хэмжээ, өнгө, өнцгөөр харуулна. Байршлыг доорх "Текстийн байршил" хэсгээс засна.</span>
                </p>
              </div>
              <div className="space-y-3">
                {data.titles.map((title, index) => (
                  <div key={index} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-teal-300 transition-colors">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Хэсэг #{index + 1}: {title.mn}</span>
                      <div className="flex gap-2">
                        {editingTitleIndex !== index && (
                          <>
                            <button
                              onClick={() => handleStartEditTitle(index)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Засах
                            </button>
                            {data.titles.length > 1 && (
                              <button
                                onClick={() => handleDeleteTitle(index)}
                                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Устгах"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {editingTitleIndex === index ? (
                      <div className="p-4 space-y-3 bg-teal-50">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            Монгол
                          </label>
                          <input
                            value={editingTitle.mn}
                            onChange={(e) => updateTitleField(index, 'mn', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            placeholder="Гарчиг (Монгол)"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            English
                          </label>
                          <input
                            value={editingTitle.en}
                            onChange={(e) => updateTitleField(index, 'en', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            placeholder="Title (English)"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                             <label className="text-xs font-medium text-slate-600">Өнгө</label>
                             <div className="flex gap-1">
                                <input
                                  type="color"
                                  value={editingTitle.color}
                                  onChange={(e) => updateTitleField(index, 'color', e.target.value)}
                                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                                />
                                <input 
                                  type="text" 
                                  value={editingTitle.color} 
                                  onChange={(e) => updateTitleField(index, 'color', e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded"
                                />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-medium text-slate-600">Хэмжээ (px/text-xl)</label>
                             <div className="flex gap-1">
                               <input
                                  type="text"
                                  value={editingTitle.size}
                                  onChange={(e) => updateTitleField(index, 'size', e.target.value)}
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                                  placeholder="Eg: 50px or text-5xl"
                                />
                                <select
                                  value={editingTitle.size?.startsWith('text-') ? editingTitle.size : 'custom'}
                                  onChange={(e) => {
                                      if(e.target.value !== 'custom') updateTitleField(index, 'size', e.target.value);
                                  }}
                                  className="w-8 px-0 border border-slate-300 rounded text-xs"
                                >
                                  <option value="custom">✎</option>
                                  <option value="text-3xl">3XL</option>
                                  <option value="text-4xl">4XL</option>
                                  <option value="text-5xl">5XL</option>
                                  <option value="text-6xl">6XL</option>
                                  <option value="text-7xl">7XL</option>
                                </select>
                             </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                             <label className="text-xs font-medium text-slate-600">Фонт (Font/Style)</label>
                             <div className="grid grid-cols-2 gap-2">
                               <select
                                  value={editingTitle.fontFamily || ''}
                                  onChange={(e) => updateTitleField(index, 'fontFamily', e.target.value || undefined)}
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                                >
                                  <option value="">Default Font</option>
                                  {fontFamilies.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                </select>
                               <select
                                  value={editingTitle.fontWeight || ''}
                                  onChange={(e) => updateTitleField(index, 'fontWeight', e.target.value || undefined)}
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                                >
                                  <option value="">Default Weight</option>
                                  {fontWeights.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                                </select>
                             </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setEditingTitleIndex(null)}
                            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                          >
                            Хаах (Дуусгах)
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800">{title.mn}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-slate-600">{title.en}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
              {/* Add Feature */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div 
                  className="flex items-center justify-between gap-2 mb-3 cursor-pointer select-none"
                  onClick={() => setShowAddFeature(!showAddFeature)}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <h3 className="text-sm font-semibold text-slate-700">Шинэ онцлог нэмэх</h3>
                  </div>
                  {showAddFeature ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
                </div>
                {showAddFeature && (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      Монгол
                    </label>
                    <input
                      value={newFeature.mn}
                      onChange={(e) => setNewFeature({ ...newFeature, mn: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="Жишээ: 24/7 зээлийн мэдээлэл шалгах"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      English
                    </label>
                    <input
                      value={newFeature.en}
                      onChange={(e) => setNewFeature({ ...newFeature, en: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      placeholder="Example: Check loan info 24/7"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">Icon сонгох</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(iconMap).map((iconKey) => {
                        const IconComponent = iconMap[iconKey];
                        const isSelected = (newFeature.icon || 'check') === iconKey;
                        return (
                          <button
                            key={iconKey}
                            onClick={() => setNewFeature({ ...newFeature, icon: iconKey })}
                            className={`p-2 rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-teal-50 border-teal-500 text-teal-600 ring-1 ring-teal-500' 
                                : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                            }`}
                            title={iconKey}
                          >
                            <IconComponent className="w-5 h-5" />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleAddFeature}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow-md"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Онцлог нэмэх
                  </button>
                </div>
                )}
              </div>

              {/* Features Styling */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <h3 className="text-sm font-semibold text-slate-700">Онцлогуудын загвар</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Текстийн өнгө
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={data.featuresTextColor || data.textColor}
                        onChange={(e) => setData({ ...data, featuresTextColor: e.target.value })}
                        className="w-10 h-9 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={data.featuresTextColor || data.textColor}
                        onChange={(e) => setData({ ...data, featuresTextColor: e.target.value })}
                        className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Текстийн хэмжээ
                    </label>
                    <select
                      value={data.featuresTextSize || 'text-sm'}
                      onChange={(e) => setData({ ...data, featuresTextSize: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                    >
                      <option value="text-xs">Маш жижиг (XS)</option>
                      <option value="text-sm">Жижиг (SM)</option>
                      <option value="text-base">Дунд (Base)</option>
                      <option value="text-lg">Том (LG)</option>
                      <option value="text-xl">Илүү том (XL)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <h3 className="text-sm font-semibold text-slate-700">Нийт {data.features.length} онцлог</h3>
                </div>
                
                {data.features.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                    <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm text-slate-500">Онцлог нэмэгдээгүй байна</p>
                    <p className="text-xs text-slate-400 mt-1">Дээрх хэсгээс онцлог нэмнэ үү</p>
                  </div>
                ) : (
                  data.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`p-4 bg-white rounded-lg border-2 hover:border-teal-300 hover:shadow-md transition-all group ${
                        feature.active ? 'border-slate-200' : 'border-slate-100 bg-slate-50 opacity-75'
                      }`}
                    >
                      {editingFeatureIndex === index ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                             <label className="text-xs font-medium text-slate-600">Монгол</label>
                             <input
                               value={editingFeature.mn}
                               onChange={(e) => updateFeatureField(index, 'mn', e.target.value)}
                               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-medium text-slate-600">English</label>
                             <input
                               value={editingFeature.en}
                               onChange={(e) => updateFeatureField(index, 'en', e.target.value)}
                               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                             />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-slate-600">Icon & Color</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400">Өнгө:</span>
                                    <input
                                        type="color"
                                        value={editingFeature.iconColor || data.iconColor}
                                        onChange={(e) => updateFeatureField(index, 'iconColor', e.target.value)}
                                        className="w-5 h-5 rounded border border-slate-300 cursor-pointer p-0.5"
                                    />
                                    {editingFeature.iconColor && (
                                        <button
                                            onClick={() => updateFeatureField(index, 'iconColor', undefined)}
                                            className="text-[10px] text-slate-400 hover:text-red-500"
                                            title="Clear color override"
                                        >✕</button>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.keys(iconMap).map((iconKey) => {
                                const IconComponent = iconMap[iconKey];
                                const isSelected = (editingFeature.icon || 'check') === iconKey;
                                return (
                                  <button
                                    key={iconKey}
                                    onClick={() => updateFeatureField(index, 'icon', iconKey)}
                                    className={`p-2 rounded-lg border transition-all ${
                                      isSelected
                                        ? 'bg-teal-50 border-teal-500 text-teal-600 ring-1 ring-teal-500' 
                                        : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                    }`}
                                    style={{ color: isSelected && editingFeature.iconColor ? editingFeature.iconColor : undefined, borderColor: isSelected && editingFeature.iconColor ? editingFeature.iconColor : undefined }}
                                    title={iconKey}
                                  >
                                    <IconComponent className="w-5 h-5" />
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">Өнгө</label>
                                <div className="flex gap-1">
                                  <input
                                    type="color"
                                    value={editingFeature.color || '#000000'}
                                    onChange={(e) => updateFeatureField(index, 'color', e.target.value)}
                                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                                  />
                                   <button
                                     onClick={() => updateFeatureField(index, 'color', undefined)}
                                     className="px-2 py-1 text-xs border border-slate-200 rounded hover:bg-slate-100"
                                     title="Default color"
                                   >Auto</button>
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">Хэмжээ (px/text)</label>
                                <div className="flex gap-1">
                                   <input
                                      type="text"
                                      value={editingFeature.size || ''}
                                      onChange={(e) => updateFeatureField(index, 'size', e.target.value)}
                                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                                      placeholder="Auto / 16px"
                                   />
                                   <select
                                      value={editingFeature.size?.startsWith('text-') ? editingFeature.size : (editingFeature.size ? 'custom' : '')}
                                      onChange={(e) => {
                                          if(e.target.value !== 'custom') updateFeatureField(index, 'size', e.target.value)
                                      }}
                                      className="w-8 px-0 border border-slate-300 rounded text-xs"
                                    >
                                      <option value="">A</option>
                                      <option value="custom">✎</option>
                                      <option value="text-xs">XS</option>
                                      <option value="text-sm">SM</option>
                                      <option value="text-base">MD</option>
                                      <option value="text-lg">LG</option>
                                      <option value="text-xl">XL</option>
                                    </select>
                                </div>
                             </div>
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-medium text-slate-600">Фонт (Font/Style)</label>
                             <div className="grid grid-cols-2 gap-2">
                               <select
                                  value={editingFeature.fontFamily || ''}
                                  onChange={(e) => updateFeatureField(index, 'fontFamily', e.target.value || undefined)}
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                                >
                                  <option value="">Default Font</option>
                                  {fontFamilies.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                </select>
                               <select
                                  value={editingFeature.fontWeight || ''}
                                  onChange={(e) => updateFeatureField(index, 'fontWeight', e.target.value || undefined)}
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                                >
                                  <option value="">Default Weight</option>
                                  {fontWeights.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                                </select>
                             </div>
                        </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingFeatureIndex(null)}
                              className="flex-1 px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs font-medium hover:bg-slate-300"
                            >
                              Хаах (Дуусгах)
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-0.5">
                            <CheckCircleIcon className={`h-5 w-5 ${feature.active ? 'text-teal-600' : 'text-slate-400'}`} />
                          </div>
                          <div className={`flex-1 ${!feature.active && 'line-through text-slate-400'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-slate-700 font-medium">{feature.mn}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-slate-500">{feature.en}</p>
                            </div>
                            {(feature.color || feature.size) && (
                              <div className="flex gap-2 mt-1">
                                {feature.color && <span className="text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-500">Color: {feature.color}</span>}
                                {feature.size && <span className="text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-500">Size: {feature.size}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                             onClick={() => handleStartEditFeature(index)}
                             className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                             title="Засах"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                          </button>
                          <button
                            onClick={() => handleToggleFeature(index)}
                            className={`p-2 rounded-lg transition-all ${
                              feature.active 
                                ? 'text-slate-400 hover:text-teal-600 hover:bg-teal-50' 
                                : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50'
                            }`}
                            title={feature.active ? "Нуух" : "Харуулах"}
                          >
                            {feature.active ? (
                              <EyeIcon className="h-5 w-5" />
                            ) : (
                              <EyeSlashIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteFeature(index)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Устгах"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Links & Image Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Store холбоос & Зураг</h2>
            <p className="text-sm text-gray-500">Апп татах холбоос болон дэлгэцийн зураг</p>
          </div>
          <div className="p-6 space-y-6">
            {/* App Store Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="text-sm font-semibold text-slate-900">Татах холбоосууд</h3>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <Input
                  label="App Store холбоос"
                  value={data.appStoreUrl}
                  onChange={(e) => setData({ ...data, appStoreUrl: e.target.value })}
                  placeholder="https://apps.apple.com/..."
                />
                <p className="text-xs text-slate-500 mt-1 ml-1">Apple App Store дээрх апп-ын хуудас</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <Input
                  label="Google Play холбоос"
                  value={data.googlePlayUrl}
                  onChange={(e) => setData({ ...data, googlePlayUrl: e.target.value })}
                  placeholder="https://play.google.com/store/apps/..."
                />
                <p className="text-xs text-slate-500 mt-1 ml-1">Google Play Store дээрх апп-ын хуудас</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Төхөөрөмжийн хүрээ</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setData({ ...data, deviceFrame: 'none' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${data.deviceFrame === 'none' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                     <div className={`w-8 h-12 border-2 border-dashed rounded flex items-center justify-center ${data.deviceFrame === 'none' ? 'border-teal-500 bg-teal-100' : 'border-slate-300'}`}>
                        <div className="w-4 h-6 bg-slate-200"></div>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.deviceFrame === 'none' ? 'border-teal-600' : 'border-slate-400'}`}>
                           {data.deviceFrame === 'none' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                         </div>
                         <span className={`text-sm font-medium ${data.deviceFrame === 'none' ? 'text-teal-700' : 'text-slate-600'}`}>Хүрээгүй</span>
                     </div>
                  </div>
                  <div
                    onClick={() => setData({ ...data, deviceFrame: 'iphone' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${data.deviceFrame === 'iphone' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                     <div className={`w-8 h-12 border-2 rounded-lg flex flex-col items-center justify-between py-1 ${data.deviceFrame === 'iphone' ? 'border-teal-500 bg-teal-100' : 'border-slate-400'}`}>
                        <div className="w-3 h-0.5 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full mb-0.5"></div>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.deviceFrame === 'iphone' ? 'border-teal-600' : 'border-slate-400'}`}>
                           {data.deviceFrame === 'iphone' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                         </div>
                         <span className={`text-sm font-medium ${data.deviceFrame === 'iphone' ? 'text-teal-700' : 'text-slate-600'}`}>iPhone</span>
                     </div>
                  </div>
                  <div
                    onClick={() => setData({ ...data, deviceFrame: 'android' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${data.deviceFrame === 'android' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                     <div className={`w-8 h-12 border-2 rounded-md flex flex-col items-center justify-start py-1 ${data.deviceFrame === 'android' ? 'border-teal-500 bg-teal-100' : 'border-slate-400'}`}>
                        <div className="w-1 h-1 bg-current rounded-full mt-0.5"></div>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.deviceFrame === 'android' ? 'border-teal-600' : 'border-slate-400'}`}>
                           {data.deviceFrame === 'android' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                         </div>
                         <span className={`text-sm font-medium ${data.deviceFrame === 'android' ? 'text-teal-700' : 'text-slate-600'}`}>Android</span>
                     </div>
                  </div>
                  <div
                    onClick={() => setData({ ...data, deviceFrame: 'macbook' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${data.deviceFrame === 'macbook' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                      <div className="flex flex-col items-center">
                         <div className={`w-12 h-8 border-2 rounded-t flex items-center justify-center ${data.deviceFrame === 'macbook' ? 'border-teal-500 bg-teal-100' : 'border-slate-400'}`}></div>
                         <div className={`w-14 h-1 border-2 border-t-0 rounded-b ${data.deviceFrame === 'macbook' ? 'border-teal-500 bg-teal-500' : 'border-slate-400 bg-slate-400'}`}></div>
                      </div>
                     <div className="flex items-center gap-2">
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.deviceFrame === 'macbook' ? 'border-teal-600' : 'border-slate-400'}`}>
                           {data.deviceFrame === 'macbook' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                         </div>
                         <span className={`text-sm font-medium ${data.deviceFrame === 'macbook' ? 'text-teal-700' : 'text-slate-600'}`}>Macbook</span>
                     </div>
                  </div>
                </div>
                
                {data.deviceFrame !== 'none' && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Төхөөрөмжийн өнгө
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={data.deviceColor || '#000000'}
                            onChange={(e) => setData({ ...data, deviceColor: e.target.value })}
                            className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-1"
                          />
                          <input
                            type="text"
                            value={data.deviceColor || '#000000'}
                            onChange={(e) => setData({ ...data, deviceColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Эргүүлэх (Rotation / Angle)
                        </label>
                        <div className="flex items-center gap-2">
                           <input
                              type="range"
                              min="-180"
                              max="180"
                              step="5"
                              value={data.deviceRotation || 0}
                              onChange={(e) => setData({ ...data, deviceRotation: parseInt(e.target.value) })}
                              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                           />
                           <span className="text-xs font-mono w-10 text-right">{data.deviceRotation || 0}°</span>
                        </div>
                         <button 
                            type="button"
                            onClick={() => setData({ ...data, deviceRotation: 0 })}
                            className="mt-1 text-[10px] text-teal-600 hover:underline"
                        >
                            Reset to 0°
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Товчлуурын загвар</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setData({ ...data, buttonStyle: 'solid' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${data.buttonStyle === 'solid' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.buttonStyle === 'solid' ? 'border-teal-600' : 'border-slate-400'}`}>
                      {data.buttonStyle === 'solid' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                    </div>
                    <span className={`text-sm font-medium ${data.buttonStyle === 'solid' ? 'text-teal-700' : 'text-slate-600'}`}>Solid</span>
                  </div>
                  <div
                    onClick={() => setData({ ...data, buttonStyle: 'outline' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${data.buttonStyle === 'outline' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.buttonStyle === 'outline' ? 'border-teal-600' : 'border-slate-400'}`}>
                      {data.buttonStyle === 'outline' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                    </div>
                    <span className={`text-sm font-medium ${data.buttonStyle === 'outline' ? 'text-teal-700' : 'text-slate-600'}`}>Outline</span>
                  </div>
                 <div
                    onClick={() => setData({ ...data, buttonStyle: 'minimal' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${data.buttonStyle === 'minimal' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.buttonStyle === 'minimal' ? 'border-teal-600' : 'border-slate-400'}`}>
                      {data.buttonStyle === 'minimal' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                    </div>
                    <span className={`text-sm font-medium ${data.buttonStyle === 'minimal' ? 'text-teal-700' : 'text-slate-600'}`}>Minimal</span>
                  </div>
                  <div
                    onClick={() => setData({ ...data, buttonStyle: '3d' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${data.buttonStyle === '3d' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.buttonStyle === '3d' ? 'border-teal-600' : 'border-slate-400'}`}>
                      {data.buttonStyle === '3d' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                    </div>
                    <span className={`text-sm font-medium ${data.buttonStyle === '3d' ? 'text-teal-700' : 'text-slate-600'}`}>3D</span>
                  </div>

                  <div
                    onClick={() => setData({ ...data, buttonStyle: 'glass' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${data.buttonStyle === 'glass' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.buttonStyle === 'glass' ? 'border-teal-600' : 'border-slate-400'}`}>
                      {data.buttonStyle === 'glass' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                    </div>
                    <span className={`text-sm font-medium ${data.buttonStyle === 'glass' ? 'text-teal-700' : 'text-slate-600'}`}>Glass</span>
                  </div>

                  <div
                    onClick={() => setData({ ...data, buttonStyle: 'flat' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${data.buttonStyle === 'flat' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.buttonStyle === 'flat' ? 'border-teal-600' : 'border-slate-400'}`}>
                      {data.buttonStyle === 'flat' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                    </div>
                    <span className={`text-sm font-medium ${data.buttonStyle === 'flat' ? 'text-teal-700' : 'text-slate-600'}`}>Flat</span>
                  </div>

                  <div
                    onClick={() => setData({ ...data, buttonStyle: 'gradient' })} 
                    className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${data.buttonStyle === 'gradient' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.buttonStyle === 'gradient' ? 'border-teal-600' : 'border-slate-400'}`}>
                      {data.buttonStyle === 'gradient' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                    </div>
                    <span className={`text-sm font-medium ${data.buttonStyle === 'gradient' ? 'text-teal-700' : 'text-slate-600'}`}>Gradient</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="space-y-4">
                    {/* App Store Colors */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">App Store Товчлуур</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                             Үндсэн өнгө
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={data.buttonBgColor}
                              onChange={(e) => setData({ ...data, buttonBgColor: e.target.value })}
                              className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-1 bg-white"
                            />
                            <input
                              type="text"
                              value={data.buttonBgColor}
                              onChange={(e) => setData({ ...data, buttonBgColor: e.target.value })}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Текстийн өнгө
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={data.buttonTextColor}
                              onChange={(e) => setData({ ...data, buttonTextColor: e.target.value })}
                              className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-1 bg-white"
                            />
                            <input
                              type="text"
                              value={data.buttonTextColor}
                              onChange={(e) => setData({ ...data, buttonTextColor: e.target.value })}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Google Play Colors */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Google Play Товчлуур</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                             Үндсэн өнгө
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={data.googleButtonBgColor || '#ffffff'}
                              onChange={(e) => setData({ ...data, googleButtonBgColor: e.target.value })}
                              className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-1 bg-white"
                            />
                            <input
                              type="text"
                              value={data.googleButtonBgColor || '#ffffff'}
                              onChange={(e) => setData({ ...data, googleButtonBgColor: e.target.value })}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Текстийн өнгө
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={data.googleButtonTextColor || '#334155'}
                              onChange={(e) => setData({ ...data, googleButtonTextColor: e.target.value })}
                              className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-1 bg-white"
                            />
                            <input
                              type="text"
                              value={data.googleButtonTextColor || '#334155'}
                              onChange={(e) => setData({ ...data, googleButtonTextColor: e.target.value })}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* App Image Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-slate-900">Утасны зураг</h3>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                   <button
                     onClick={() => setImageInputType('upload')}
                     className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${imageInputType === 'upload' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     Зураг
                   </button>
                   <button
                     onClick={() => setImageInputType('svg')}
                     className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${imageInputType === 'svg' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     SVG Код
                   </button>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                {imageInputType === 'upload' ? (
                  <>
                    <ImageUpload
                      label="Апп-ын дэлгэцийн зураг"
                      value={data.appImageUrl}
                      onChange={(url) => setData({ ...data, appImageUrl: url, appSvgCode: undefined })}
                    />
                    <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-700 font-medium flex items-start gap-2">
                        <span>Утасны дэлгэцийн зураг оруулна. Хамгийн сайн үр дүнгийн тулд <strong>400x600</strong> эсвэл түүнээс том хэмжээтэй зураг ашиглана уу.</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                     <label className="block text-sm font-medium text-slate-700">SVG код оруулах</label>
                     <textarea
                       value={data.appSvgCode || ''}
                       onChange={(e) => {
                         const newVal = e.target.value;
                         setData({ ...data, appSvgCode: newVal, appImageUrl: '' });
                         validateSvg(newVal);
                       }}
                       className={`w-full h-48 px-3 py-2 text-xs font-mono border rounded-lg focus:ring-2 focus:ring-teal-500 ${svgError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-300'}`}
                       placeholder="<svg ...> ... </svg>"
                     />
                     {svgError ? (
                        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {svgError}
                        </p>
                     ) : (
                       <p className="text-xs text-slate-500">
                         SVG кодыг шууд хуулж тавина уу. Энэ нь зургийн чанарыг алдагдуулахгүй сайн талтай.
                       </p>
                     )}
                  </div>
                )}
              </div>

              {/* Preview of uploaded image */}
              {(data.appImageUrl || (data.appSvgCode && !svgError)) && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Одоогийн зураг:</p>
                  <div className="flex items-center gap-4">
                     {data.appSvgCode ? (
                       <div 
                         className="w-[100px] h-[150px] rounded-lg shadow-md border border-slate-200 bg-white overflow-hidden flex items-center justify-center p-2"
                         dangerouslySetInnerHTML={{ __html: data.appSvgCode }}
                       />
                    ) : (
                    <Image
                      src={data.appImageUrl}
                      alt="App Preview"
                      width={100}
                      height={150}
                      className="rounded-lg shadow-md border border-slate-200"
                    />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1 mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {data.appSvgCode ? 'SVG код амжилттай' : 'Зураг амжилттай оруулсан'}
                      </p>
                      <p className="text-xs text-slate-500 break-all line-clamp-2">
                         {data.appSvgCode ? 'SVG Code content...' : data.appImageUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title & Feature Position Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Текстийн байршил</h2>
            <p className="text-sm text-gray-500">Гарчиг болон онцлог хэсгийн байршил</p>
          </div>
          <div className="p-6 space-y-8">
            {/* Features Layout */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Онцлог давуу талуудын загвар
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setData({ ...data, featuresLayout: 'vertical' })}
                  className={`relative overflow-hidden flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${
                    data.featuresLayout === 'vertical'
                      ? 'border-teal-500 bg-white shadow-lg shadow-teal-100 scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-teal-500/10 to-transparent -mr-8 -mt-8 rounded-full ${data.featuresLayout === 'vertical' ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="flex flex-col gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-20 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                    <div className="w-20 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                    <div className="w-20 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                  </div>
                  <div className="text-center">
                    <span className={`block text-sm font-bold ${data.featuresLayout === 'vertical' ? 'text-teal-700' : 'text-slate-700'}`}>
                      Босоо жагсаалт
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">Сонгодог загвар</span>
                  </div>
                  {data.featuresLayout === 'vertical' && (
                    <div className="absolute top-2 right-2 text-teal-600">
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setData({ ...data, featuresLayout: 'horizontal' })}
                  className={`relative overflow-hidden flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${
                    data.featuresLayout === 'horizontal'
                      ? 'border-teal-500 bg-white shadow-lg shadow-teal-100 scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                   <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-teal-500/10 to-transparent -mr-8 -mt-8 rounded-full ${data.featuresLayout === 'horizontal' ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="flex gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-6 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                    <div className="w-6 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                    <div className="w-6 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                  </div>
                  <div className="text-center">
                    <span className={`block text-sm font-bold ${data.featuresLayout === 'horizontal' ? 'text-teal-700' : 'text-slate-700'}`}>
                      Хэвтээ цуваа
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">Орчин үеийн загвар</span>
                  </div>
                  {data.featuresLayout === 'horizontal' && (
                    <div className="absolute top-2 right-2 text-teal-600">
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setData({ ...data, featuresLayout: 'grid' })}
                  className={`relative overflow-hidden flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${
                    data.featuresLayout === 'grid'
                      ? 'border-teal-500 bg-white shadow-lg shadow-teal-100 scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                   <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-teal-500/10 to-transparent -mr-8 -mt-8 rounded-full ${data.featuresLayout === 'grid' ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-8 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                    <div className="w-8 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                    <div className="w-8 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                    <div className="w-8 h-2.5 bg-slate-300 rounded shadow-sm"></div>
                  </div>
                  <div className="text-center">
                    <span className={`block text-sm font-bold ${data.featuresLayout === 'grid' ? 'text-teal-700' : 'text-slate-700'}`}>
                      Сүлжээ (Grid)
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">Компакт загвар</span>
                  </div>
                  {data.featuresLayout === 'grid' && (
                    <div className="absolute top-2 right-2 text-teal-600">
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Title Positions */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Гарчгийн байршил тохируулах
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const defaultPositions = [
                        { top: 24, left: 16, rotation: -2, size: 'text-5xl' },
                        { top: 96, left: 80, rotation: 3, size: 'text-6xl' },
                        { top: 176, left: 32, rotation: -1, size: 'text-4xl' },
                        { top: 240, left: 144, rotation: 2, size: 'text-5xl' },
                      ]
                      setData({ ...data, titlePositions: defaultPositions.slice(0, data.titles.length) })
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resest to Default
                  </button>
                </div>
              </div>
              
              {/* Quick Presets */}
              <div className="mb-6 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Бэлэн загварууд (Presets)</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      const cascadePositions = data.titlePositions.map((_, i) => ({
                        top: 30 + (i * 70),
                        left: 20 + (i * 25),
                        rotation: 0,
                        size: i === 1 ? 'text-6xl' : 'text-5xl'
                      }))
                      setData({ ...data, titlePositions: cascadePositions })
                    }}
                    className="group flex flex-col items-center justify-center p-3 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex flex-col gap-0.5 mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-1 bg-indigo-500 rounded translate-x-0"></div>
                      <div className="w-6 h-1 bg-indigo-500 rounded translate-x-2"></div>
                      <div className="w-6 h-1 bg-indigo-500 rounded translate-x-4"></div>
                    </div>
                    Каскад (Cascade)
                  </button>
                  <button
                    onClick={() => {
                      const stackedPositions = data.titlePositions.map((_, i) => ({
                        top: 20 + (i * 60),
                        left: 40,
                        rotation: 0,
                        size: i === 1 ? 'text-6xl' : 'text-5xl'
                      }))
                      setData({ ...data, titlePositions: stackedPositions })
                    }}
                    className="group flex flex-col items-center justify-center p-3 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                  >
                     <div className="flex flex-col gap-0.5 mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-1 bg-indigo-500 rounded my-0.5"></div>
                      <div className="w-8 h-1 bg-indigo-500 rounded my-0.5"></div>
                      <div className="w-8 h-1 bg-indigo-500 rounded my-0.5"></div>
                    </div>
                    Босоо (Stacked)
                  </button>
                  <button
                    onClick={() => {
                      const scatteredPositions = data.titlePositions.map((_, i) => ({
                        top: 20 + Math.random() * 300,
                        left: 10 + Math.random() * 200,
                        rotation: -5 + Math.random() * 10,
                        size: ['text-4xl', 'text-5xl', 'text-6xl'][Math.floor(Math.random() * 3)]
                      }))
                      setData({ ...data, titlePositions: scatteredPositions })
                    }}
                    className="group flex flex-col items-center justify-center p-3 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                  >
                     <div className="relative w-8 h-8 mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="absolute top-0 left-0 w-3 h-1 bg-indigo-500 rounded -rotate-6"></div>
                      <div className="absolute top-4 right-1 w-3 h-1 bg-indigo-500 rounded rotate-12"></div>
                      <div className="absolute bottom-1 left-3 w-3 h-1 bg-indigo-500 rounded -rotate-3"></div>
                    </div>
                    Санамсаргүй (Random)
                  </button>
                  <button
                    onClick={() => {
                      // Custom setup for 4 items
                       const zigZag = [
                        { top: 20, left: 20, rotation: -2, size: 'text-5xl' },
                        { top: 100, left: 180, rotation: 2, size: 'text-5xl' },
                        { top: 180, left: 20, rotation: -2, size: 'text-5xl' },
                        { top: 260, left: 180, rotation: 2, size: 'text-5xl' },
                       ];
                       const newPos = data.titlePositions.map((_, i) => {
                          if (i < 4) return zigZag[i];
                          return { top: 300 + (i*50), left: 50, rotation: 0, size: 'text-4xl' }
                       })
                       setData({ ...data, titlePositions: newPos })
                     }}
                    className="group flex flex-col items-center justify-center p-3 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                  >
                     <div className="flex flex-col gap-0.5 mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="w-4 h-1 bg-indigo-500 rounded self-start"></div>
                      <div className="w-4 h-1 bg-indigo-500 rounded self-end"></div>
                      <div className="w-4 h-1 bg-indigo-500 rounded self-start"></div>
                    </div>
                    Зиг-Заг (ZigZag)
                  </button>
                </div>
              </div>

              {/* Individual Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.titlePositions.map((pos, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold text-slate-700">Хэсэг #{index + 1}: {data.titles[index]?.mn || 'N/A'}</span>
                       <span className="text-[10px] text-slate-400 font-mono">X:{pos.left} Y:{pos.top}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-500 font-semibold">Дээрээс (Top)</label>
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={pos.top}
                          onChange={(e) => updateTitleField(index, 'top', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-500 font-semibold">Зүүнээс (Left)</label>
                        <input
                          type="range"
                          min="0"
                          max="400"
                          value={pos.left}
                          onChange={(e) => updateTitleField(index, 'left', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-500 font-semibold">Эргүүлэх (Rotate)</label>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          value={pos.rotation}
                          onChange={(e) => updateTitleField(index, 'rotation', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-500 font-semibold">Size</label>
                        <select
                          value={pos.size}
                          onChange={(e) => updateTitleField(index, 'size', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50 focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="text-3xl">Small (3XL)</option>
                          <option value="text-4xl">Medium (4XL)</option>
                          <option value="text-5xl">Large (5XL)</option>
                          <option value="text-6xl">Huge (6XL)</option>
                          <option value="text-7xl">Giant (7XL)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Styling Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Position & Typography */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Байршил & Фонт</h2>
                  <p className="text-sm text-gray-500">Текст, зурагны байршил болон үсгийн загвар</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Position Toggle */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <h3 className="text-sm font-semibold text-slate-700">Зурагны байршил</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setData({ ...data, position: 'left' })}
                    className={`group relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                      data.position === 'left'
                        ? 'border-teal-500 bg-teal-50 shadow-lg scale-105'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                    }`}
                  >
                    {data.position === 'left' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="flex gap-2 items-center">
                      <div className="w-12 h-16 bg-slate-300 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                        ABC
                      </div>
                      <div className="w-8 h-20 bg-teal-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        IMG
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${data.position === 'left' ? 'text-teal-700' : 'text-slate-600'}`}>
                        Стандарт
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Текст зүүн · Зураг баруун</p>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setData({ ...data, position: 'right' })}
                    className={`group relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                      data.position === 'right'
                        ? 'border-teal-500 bg-teal-50 shadow-lg scale-105'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                    }`}
                  >
                    {data.position === 'right' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-20 bg-teal-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        IMG
                      </div>
                      <div className="w-12 h-16 bg-slate-300 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                        ABC
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${data.position === 'right' ? 'text-teal-700' : 'text-slate-600'}`}>
                        Эсрэг
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Зураг зүүн · Текст баруун</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>

      </div>
    </AdminLayout>
  )
}
