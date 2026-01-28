'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Button, PageHeader } from '@/components/FormElements'
import ImageUpload from '@/components/ImageUpload'
import Modal from '@/components/Modal'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import axios from 'axios'

interface CTASlide {
  id: string
  imageUrl: string
  number: string
  title_mn: string
  title_en: string
  subtitle_mn: string
  subtitle_en: string
  font?: string
  textColor?: string
  order: number
  isActive: boolean
}

interface FormData {
  imageUrl: string
  number: string
  title_mn: string
  title_en: string
  subtitle_mn: string
  subtitle_en: string
  font: string
  textColor: string
  order: number
  isActive: boolean
}

const defaultSlides: CTASlide[] = []

// CTASlide-г API формат руу хөрвүүлэх
const convertToPostmanFormat = (slide: CTASlide) => {
  return {
    file: slide.imageUrl,
    index: slide.order,
    font: slide.font === 'font-sans' ? 'Arial' : 
          slide.font === 'font-serif' ? 'Georgia' : 
          slide.font === 'font-mono' ? 'Courier New' : 'Arial',
    color: slide.textColor,
    number: slide.number,
    titles: [
      {
        language: 1,
        label: slide.title_en
      },
      {
        language: 2,
        label: slide.title_mn
      }
    ],
    subtitles: [
      {
        language: 1,
        label: slide.subtitle_en || ''
      },
      {
        language: 2,
        label: slide.subtitle_mn || ''
      }
    ]
  }
}

export default function CTAPage() {
  const [slides, setSlides] = useState<CTASlide[]>(defaultSlides)
  const [modalOpen, setModalOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [previewLang, setPreviewLang] = useState<'mn' | 'en'>('mn')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    imageUrl: '',
    number: '',
    title_mn: '',
    title_en: '',
    subtitle_mn: '',
    subtitle_en: '',
    font: 'font-sans',
    textColor: '#ffffff',
    order: 1,
    isActive: true,
  })

  // Backend-ээс слайдууд татах
  const fetchSlides = async () => {
    try {
      const response = await axiosInstance.get('/cta')
      const apiSlides = response.data
      
      // API форматаас React формат руу хөрвүүлэх
      const convertedSlides: CTASlide[] = apiSlides.map((apiSlide: any) => {
        const titleMn = apiSlide.titles.find((t: any) => t.language === 2)?.label || ''
        const titleEn = apiSlide.titles.find((t: any) => t.language === 1)?.label || ''
        const subtitleMn = apiSlide.subtitles.find((s: any) => s.language === 2)?.label || ''
        const subtitleEn = apiSlide.subtitles.find((s: any) => s.language === 1)?.label || ''
        
        return {
          id: apiSlide.id.toString(),
          imageUrl: apiSlide.file,
          number: apiSlide.number,
          title_mn: titleMn,
          title_en: titleEn,
          subtitle_mn: subtitleMn,
          subtitle_en: subtitleEn,
          font: apiSlide.font === 'Arial' ? 'font-sans' : 
                apiSlide.font === 'Georgia' ? 'font-serif' : 
                apiSlide.font === 'Courier New' ? 'font-mono' : 'font-sans',
          textColor: apiSlide.color,
          order: apiSlide.index,
          isActive: true
        }
      })
      
      setSlides(convertedSlides)
    } catch (err) {
      console.error('Backend-ээс татахад алдаа:', err)
      setError('Өгөгдөл татахад алдаа гарлаа')
    }
  }

  // Компонент ачаалагдахад backend-ээс өгөгдөл татах
  useEffect(() => {
    fetchSlides()
  }, [])

  // Шинэ слайд үүсгэх
  const createSlide = async () => {
    if (!formData.imageUrl || !formData.title_mn) {
      setError('Зураг болон монгол гарчиг оруулна уу')
      return
    }

    try {
      setSaving(true)
      setError(null)
      
      const newSlide: CTASlide = {
        id: Date.now().toString(),
        ...formData,
      }
      
      const postmanData = convertToPostmanFormat(newSlide)
      const response = await axiosInstance.post('/cta', postmanData)
      
      console.log('API хариу:', response.data)
      
      // Амжилттай бол backend-ээс дахин татах
      await fetchSlides()
      setSuccess('Слайд амжилттай нэмэгдлээ!')
      setModalOpen(false)
      
      // Форм цэвэрлэх
      setFormData({
        imageUrl: '',
        number: `0${slides.length + 2}`,
        title_mn: '',
        title_en: '',
        subtitle_mn: '',
        subtitle_en: '',
        font: 'font-sans',
        textColor: '#ffffff',
        order: slides.length + 1,
        isActive: true,
      })

      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Слайд үүсгэхэд алдаа гарлаа'
      setError(message)
      console.error('Create error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleOpenCreate = () => {
    setError(null)
    setFormData({
      imageUrl: '',
      number: `0${slides.length + 1}`,
      title_mn: '',
      title_en: '',
      subtitle_mn: '',
      subtitle_en: '',
      font: 'font-sans',
      textColor: '#ffffff',
      order: slides.length + 1,
      isActive: true,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Устгах уу?')) return
    
    try {
      await axiosInstance.delete(`/cta/${id}`)
      setSlides(slides.filter(s => s.id !== id))
      setSuccess('Слайд амжилттай устгагдлаа!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Устгахад алдаа:', err)
      setError('Слайд устгахад алдаа гарлаа')
    }
  }

  return (
    <AdminLayout title="CTA Slider">
      <div className="max-w-6xl mx-auto">
        {success && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-900">Амжилттай!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">Алдаа гарлаа</h4>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <PageHeader
          title="CTA Accordion Slider"
          description="Нүүр хуудасны дунд хэсгийн интерактив слайдер"
          action={
            <Button onClick={handleOpenCreate} disabled={saving} className="px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-md">
              <PlusIcon className="h-4 w-4" />
              Шинэ слайд нэмэх
            </Button>
          }
        />

        {/* Live Preview */}
        {slides.filter(s => s.isActive).length > 0 && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50">
            <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Live Preview - Accordion Slider
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
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
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  🖱️ Hover хийнэ үү
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="relative" style={{ height: '80vh', minHeight: '500px', maxHeight: '700px' }}>
                <div className="flex h-full gap-4">
                  {slides
                    .filter(s => s.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map((slide, index) => {
                      const isHovered = hoveredIndex === index
                      
                      return (
                        <div
                          key={slide.id}
                          className={`relative transition-all duration-700 ease-out cursor-pointer overflow-hidden rounded-2xl ${
                            isHovered ? 'flex-[2.7]' : 'flex-1'
                          }`}
                          style={{
                            filter: isHovered ? 'grayscale(0) contrast(1.02)' : 'grayscale(0.7) contrast(0.95)',
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                            minWidth: '140px',
                          }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <Image
                            src={slide.imageUrl}
                            alt={previewLang === 'mn' ? slide.title_mn : slide.title_en}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/0 to-transparent"></div>
                          
                          <div 
                            className={`absolute ${isHovered ? 'bottom-20' : 'bottom-8'} left-7 right-7 z-10 transition-all duration-700 ${slide.font || 'font-sans'}`}
                            style={{ color: slide.textColor || '#ffffff' }}
                          >
                            <div className="text-base font-bold mb-2" style={{ opacity: 0.95 }}>
                              {previewLang === 'mn' ? slide.title_mn : slide.title_en}
                            </div>
                            
                            <div className={`transition-all duration-600 overflow-hidden ${
                              isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
                            }`}>
                              <p className="text-sm font-medium mt-2" style={{ opacity: 0.85 }}>
                                {previewLang === 'mn' ? slide.subtitle_mn : slide.subtitle_en}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slides Grid - Эрэмбээр харуулах */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides
            .sort((a, b) => a.order - b.order)
            .map((slide) => (
              <div
                key={slide.id}
                className="bg-white rounded-xl shadow-sm border-2 border-slate-200 overflow-hidden transition-all hover:border-teal-300 hover:shadow-md"
              >
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-slate-800 shadow-sm">
                      {slide.number}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      Эрэмбэ: {slide.order}
                    </span>
                  </div>
                </div>

                <div className="relative h-48">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title_mn}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                      {slide.font || 'font-sans'}
                    </span>
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-slate-200 shadow-sm"
                      style={{ backgroundColor: slide.textColor }}
                      title={`Өнгө: ${slide.textColor}`}
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{slide.title_mn}</h3>
                  <p className="text-sm text-slate-600 mb-1">{slide.subtitle_mn}</p>
                  <p className="text-xs text-slate-400 italic">{slide.title_en}</p>
                </div>
              </div>
            ))}
        </div>

        {slides.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Слайд байхгүй байна</h3>
            <p className="text-sm text-slate-500 mb-4">Эхний слайдаа нэмж эхлээрэй</p>
            <Button onClick={handleOpenCreate} className="inline-flex">
              <PlusIcon className="h-5 w-5 mr-2" />
              Шинэ слайд нэмэх
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Шинэ слайд нэмэх"
      >
        <div className="space-y-4">
          <ImageUpload
            label="Арын зураг"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />

          <Input
            label="Дугаар (жнь: 01, 02)"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            placeholder="01"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Гарчиг (Монгол)"
              value={formData.title_mn}
              onChange={(e) => setFormData({ ...formData, title_mn: e.target.value })}
              placeholder="Хашаа барьцаалсан зээл"
            />
            <Input
              label="Гарчиг (English)"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              placeholder="Property Collateral Loan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Дэд гарчиг (Монгол)"
              value={formData.subtitle_mn}
              onChange={(e) => setFormData({ ...formData, subtitle_mn: e.target.value })}
              placeholder="Тогтвортой, уян хатан нөхцөлтэй зээл"
            />
            <Input
              label="Дэд гарчиг (English)"
              value={formData.subtitle_en}
              onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
              placeholder="Stable and flexible loan terms"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Фонт
              </label>
              <select
                value={formData.font}
                onChange={(e) => setFormData({ ...formData, font: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="font-sans">Sans Serif</option>
                <option value="font-serif">Serif</option>
                <option value="font-mono">Monospace</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Текстийн өнгө
              </label>
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="w-full h-10 border border-slate-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <Input
            label="Эрэмбэ"
            type="number"
            value={formData.order.toString()}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
            }
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Болих
            </button>
            <Button variant="dark" onClick={createSlide} disabled={saving}>
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Хадгалж байна...
                </>
              ) : 'Хадгалах'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}