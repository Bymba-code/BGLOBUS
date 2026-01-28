'use client'

import { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Button, PageHeader } from '@/components/FormElements'
import ImageUpload from '@/components/ImageUpload'
import Modal from '@/components/Modal'
import { PlusIcon, TrashIcon, PencilIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useSaveReset } from '@/hooks/useSaveReset'
import { SaveResetButtons } from '@/components/SaveResetButtons'

interface HeroSlide {
  id: string
  type: 'image' | 'video'
  src: string
  duration: number
  order: number
  isActive: boolean
}

const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    type: 'video',
    src: '/test.mp4',
    duration: 10,
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    type: 'image',
    src: '/Bichil1.jpg',
    duration: 5,
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    type: 'image',
    src: '/Bichil2.png',
    duration: 5,
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    type: 'image',
    src: '/Bichil3.jpg',
    duration: 5,
    order: 4,
    isActive: true,
  },
]

export default function HeroPage() {
  const { data: slides, setData: setSlides, saveSuccess, handleSave: saveData, handleReset } = useSaveReset<HeroSlide[]>('heroSlides', defaultSlides)
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [formData, setFormData] = useState({
    type: 'image' as 'image' | 'video',
    src: '',
    duration: 5,
    order: slides.length + 1,
    isActive: true,
  })

  // Remove the manual localStorage loading useEffect - it's handled by the hook

  // Auto-play preview slider
  useEffect(() => {
    const activeSlides = slides.filter(s => s.isActive).sort((a, b) => a.order - b.order)
    if (activeSlides.length === 0) return

    const currentSlide = activeSlides[currentPreviewIndex]
    const timer = setTimeout(() => {
      setCurrentPreviewIndex((prev) => (prev + 1) % activeSlides.length)
    }, (currentSlide?.duration || 5) * 1000)

    return () => clearTimeout(timer)
  }, [currentPreviewIndex, slides])

  // Get video duration when file is loaded
  const handleVideoLoad = (file: File) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      const duration = Math.round(video.duration)
      setVideoDuration(duration)
      setFormData(prev => ({ ...prev, duration }))
    }
    
    video.src = URL.createObjectURL(file)
  }

  const handleOpenCreate = () => {
    setEditingSlide(null)
    setMediaType('image')
    setVideoFile(null)
    setVideoDuration(0)
    setFormData({
      type: 'image',
      src: '',
      duration: 5,
      order: slides.length + 1,
      isActive: true,
    })
    setModalOpen(true)
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setMediaType(slide.type)  // Төрлийг тохируулах
    setFormData({
      type: slide.type,
      src: slide.src,
      duration: slide.duration,
      order: slide.order,
      isActive: slide.isActive,
    })
    setModalOpen(true)
  }

  const handleMediaTypeChange = (type: 'image' | 'video') => {
    setMediaType(type)
    setFormData(prev => ({
      ...prev,
      type,
      src: '',
      duration: type === 'video' ? videoDuration : 5
    }))
  }

  const handleSave = () => {
    if (!formData.src) {
      alert('Зураг эсвэл бичлэг оруулна уу')
      return
    }

    if (editingSlide) {
      setSlides(slides.map(s => 
        s.id === editingSlide.id 
          ? { ...s, ...formData }
          : s
      ))
    } else {
      const newSlide: HeroSlide = {
        id: Date.now().toString(),
        ...formData,
      }
      setSlides([...slides, newSlide])
    }

    setModalOpen(false)
    setVideoFile(null)
    setVideoDuration(0)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Устгах уу?')) return
    setSlides(slides.filter(s => s.id !== id))
  }

  return (
    <AdminLayout title="Hero Slider">
      <div className="max-w-6xl mx-auto">
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
          title="Hero Slider удирдлага"
          description="Нүүр хуудасны том зургуудын слайдер"
          action={
            <div className="flex items-center gap-3">
              <SaveResetButtons 
                onSave={saveData}
                onReset={handleReset}
                confirmMessage="Та хадгалахдаа итгэлтэй байна уу?"
              />
              <Button variant="dark" onClick={handleOpenCreate}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Шинэ слайд нэмэх
              </Button>
            </div>
          }
        />

        {/* Live Preview */}
        {slides.filter(s => s.isActive).length > 0 && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50">
            <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Live Preview
                </span>
              </div>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {slides.filter(s => s.isActive).length} слайд
              </span>
            </div>
            
            <div className="p-6">
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl bg-black">
                {slides
                  .filter(s => s.isActive)
                  .sort((a, b) => a.order - b.order)
                  .map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentPreviewIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {slide.type === 'image' ? (
                        <Image
                          src={slide.src}
                          alt="Hero preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={slide.src}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                        <span className="text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                          Слайд {index + 1} / {slides.filter(s => s.isActive).length}
                        </span>
                        {slide.type === 'video' && (
                          <span className="text-sm bg-red-500/80 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <VideoCameraIcon className="h-4 w-4" />
                            Бичлэг
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                
                {/* Progress indicators */}
                <div className="absolute bottom-4 right-4 flex gap-1.5">
                  {slides
                    .filter(s => s.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPreviewIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentPreviewIndex 
                            ? 'w-8 bg-white' 
                            : 'w-2 bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slides List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides
            .sort((a, b) => a.order - b.order)
            .map((slide) => (
              <div
                key={slide.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-black">
                  {slide.type === 'image' ? (
                    <Image
                      src={slide.src}
                      alt="Hero slide"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <video
                        src={slide.src}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          <VideoCameraIcon className="h-3 w-3" />
                          Бичлэг
                        </span>
                      </div>
                    </>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                    >
                      <PencilIcon className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Эрэмбэ: {slide.order}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      slide.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {slide.isActive ? '● Идэвхтэй' : '○ Идэвхгүй'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Хугацаа: {slide.duration} секунд
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {slide.type === 'image' ? '🖼️ Зураг' : '🎬 Бичлэг'}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {slides.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <PhotoIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">Одоогоор слайд байхгүй байна</p>
            <Button variant="dark" onClick={handleOpenCreate}>
              Эхний слайд нэмэх
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setVideoFile(null)
          setVideoDuration(0)
        }}
        title={editingSlide ? ' Слайд засах' : ' Шинэ слайд нэмэх'}
        size="sm"
      >
        <div className="space-y-5">
          {/* Media Type Selection */}
          {!editingSlide && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Төрөл сонгох
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleMediaTypeChange('image')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mediaType === 'image'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <PhotoIcon className={`h-8 w-8 mx-auto mb-2 ${
                    mediaType === 'image' ? 'text-teal-600' : 'text-slate-400'
                  }`} />
                  <div className="text-sm font-medium text-center">
                    Зураг
                  </div>
                  <div className="text-xs text-slate-500 text-center mt-1">
                    JPG, PNG, WebP
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleMediaTypeChange('video')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mediaType === 'video'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <VideoCameraIcon className={`h-8 w-8 mx-auto mb-2 ${
                    mediaType === 'video' ? 'text-teal-600' : 'text-slate-400'
                  }`} />
                  <div className="text-sm font-medium text-center">
                    Бичлэг
                  </div>
                  <div className="text-xs text-slate-500 text-center mt-1">
                    MP4, WebM
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Edit mode: Show current type */}
          {editingSlide && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                {mediaType === 'image' ? (
                  <>
                    <PhotoIcon className="h-6 w-6 text-teal-600" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Зураг</div>
                      <div className="text-xs text-slate-500">Төрөл өөрчлөх боломжгүй</div>
                    </div>
                  </>
                ) : (
                  <>
                    <VideoCameraIcon className="h-6 w-6 text-teal-600" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Бичлэг</div>
                      <div className="text-xs text-slate-500">Төрөл өөрчлөх боломжгүй</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Media Upload */}
          {mediaType === 'image' ? (
            <ImageUpload
              label="Зураг оруулах"
              value={formData.src}
              onChange={(url) => setFormData({ ...formData, src: url })}
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Бичлэг оруулах
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-teal-400 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setVideoFile(file)
                      handleVideoLoad(file)
                      // For demo, use public path
                      const fileName = file.name
                      setFormData({ ...formData, src: `/${fileName}` })
                    }
                  }}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
              {videoFile && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <VideoCameraIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <div className="font-medium">{videoFile.name}</div>
                      <div className="mt-1">
                        Хугацаа: <strong>{videoDuration} секунд</strong> (автоматаар тооцоолсон)
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {formData.src && !videoFile && (
                <div className="mt-3">
                  <video src={formData.src} controls className="w-full rounded-lg" />
                </div>
              )}
            </div>
          )}

          {/* Duration Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Харуулах хугацаа (секунд)
              {mediaType === 'video' && videoDuration > 0 && (
                <span className="ml-2 text-xs text-slate-500">
                  (бичлэгийн үргэлжлэх хугацаа: {videoDuration}с)
                </span>
              )}
            </label>
            <Input
              type="number"
              value={formData.duration.toString()}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) || 5 })
              }
              placeholder="5"
              min="1"
            />
            <p className="mt-1 text-xs text-slate-500">
              {mediaType === 'video' 
                ? 'Бичлэгийн бүтэн хугацаа автоматаар тооцоолсон' 
                : 'Зураг хэдэн секунд харагдах вэ?'}
            </p>
          </div>

          {/* Order Input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Дараалал
              </label>
              <Input
                type="number"
                value={formData.order.toString()}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
                }
                min="1"
              />
              <p className="mt-1 text-xs text-slate-500">Бага тоо эхэнд гарна</p>
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Идэвхжүүлэх
              </label>
              <label className="relative inline-flex items-center cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false)
                setVideoFile(null)
                setVideoDuration(0)
              }}
              className="px-5 py-2.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ← Буцах
            </button>
            <Button variant="dark" onClick={handleSave}>
              ✓ Хадгалах
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}
